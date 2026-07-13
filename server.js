const http = require("http");
const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");
const crypto = require("crypto");

// Load .env file if present (no external dependencies needed)
(function loadEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fsSync.existsSync(envPath)) return;
  const lines = fsSync.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex < 1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && !(key in process.env)) process.env[key] = value;
  }
})();

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;
const DATA_FILE = path.join(__dirname, "data.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function normalizeEndpoint(value) {
  return value ? value.replace(/\/+$/, "") : "";
}

async function readRequestBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function getBedrockConfig() {
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SESSION_TOKEN || "";
  const modelId = process.env.BEDROCK_MODEL_ID || "us.anthropic.claude-sonnet-4-5-20250929-v1:0";
  const maxTokens = Number(process.env.BEDROCK_MAX_TOKENS || 8000);

  if (!accessKeyId || !secretAccessKey) {
    return null;
  }

  return { region, accessKeyId, secretAccessKey, sessionToken, modelId, maxTokens };
}

// --- AWS SigV4 signing (no external dependencies) ---
function sha256Hex(data) {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}

function hmac(key, data) {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function getSignatureKey(secretKey, dateStamp, region, service) {
  const kDate = hmac(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  return hmac(kService, "aws4_request");
}

function signedBedrockRequest(config, host, canonicalUri, bodyString) {
  const service = "bedrock";
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ""); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = sha256Hex(bodyString);
  const canonicalHeaders =
    `content-type:application/json\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n` +
    (config.sessionToken ? `x-amz-security-token:${config.sessionToken}\n` : "");
  const signedHeaders = config.sessionToken
    ? "content-type;host;x-amz-content-sha256;x-amz-date;x-amz-security-token"
    : "content-type;host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = [
    "POST",
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join("\n");

  const credentialScope = `${dateStamp}/${config.region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest)
  ].join("\n");

  const signingKey = getSignatureKey(config.secretAccessKey, dateStamp, config.region, service);
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign, "utf8").digest("hex");

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const headers = {
    "Content-Type": "application/json",
    Host: host,
    "X-Amz-Content-Sha256": payloadHash,
    "X-Amz-Date": amzDate,
    Authorization: authorization
  };
  if (config.sessionToken) {
    headers["X-Amz-Security-Token"] = config.sessionToken;
  }

  return headers;
}

function extractBedrockText(payload, modelId) {
  if (!payload || typeof payload !== "object") return "";

  // Anthropic Claude (Messages API on Bedrock)
  if (Array.isArray(payload.content)) {
    return payload.content
      .map((block) => (typeof block === "string" ? block : block.text || ""))
      .filter(Boolean)
      .join("\n");
  }

  // Amazon Nova / Titan-style
  const novaText = payload.output?.message?.content
    ?.map((block) => block.text || "")
    .filter(Boolean)
    .join("\n");
  if (novaText) return novaText;

  if (Array.isArray(payload.results)) {
    return payload.results.map((r) => r.outputText || "").filter(Boolean).join("\n");
  }

  // Meta Llama
  if (typeof payload.generation === "string") {
    return payload.generation;
  }

  return "";
}

function buildBedrockBody(modelId, systemMessage, prompt, maxTokens) {
  const id = modelId.toLowerCase();

  if (id.includes("anthropic") || id.includes("claude")) {
    return {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: maxTokens,
      temperature: 0.7,
      system: systemMessage,
      messages: [{ role: "user", content: [{ type: "text", text: prompt }] }]
    };
  }

  if (id.includes("nova")) {
    return {
      system: [{ text: systemMessage }],
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens, temperature: 0.7 }
    };
  }

  if (id.includes("llama")) {
    return {
      prompt: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n${systemMessage}<|eot_id|><|start_header_id|>user<|end_header_id|>\n${prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n`,
      max_gen_len: Math.min(maxTokens, 2048),
      temperature: 0.7
    };
  }

  // Amazon Titan text fallback
  return {
    inputText: `${systemMessage}\n\n${prompt}`,
    textGenerationConfig: { maxTokenCount: maxTokens, temperature: 0.7 }
  };
}

async function callBedrock(prompt) {
  const config = getBedrockConfig();

  if (!config) {
    throw new Error("AWS credentials are missing on the local server (set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY).");
  }

  const systemMessage = [
    "You are a senior inbound content strategist for Art Flaneur.",
    "Respond in English.",
    "Use HubSpot-style inbound methodology.",
    "Be concrete, structured, and practical for an early-stage content marketing operator.",
    "Prefer concise sections and actionable recommendations."
  ].join(" ");

  const host = `bedrock-runtime.${config.region}.amazonaws.com`;
  const encodedModelId = encodeURIComponent(config.modelId);
  // Actual request path (single-encoded, e.g. ...v2%3A0)
  const requestUri = `/model/${encodedModelId}/invoke`;
  // Canonical URI for SigV4 must URI-encode the path again (e.g. %3A -> %253A)
  const canonicalUri = `/model/${encodeURIComponent(encodedModelId)}/invoke`;
  const url = `https://${host}${requestUri}`;

  const bodyObject = buildBedrockBody(config.modelId, systemMessage, prompt, config.maxTokens);
  const bodyString = JSON.stringify(bodyObject);

  const headers = signedBedrockRequest(config, host, canonicalUri, bodyString);

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: bodyString
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AWS Bedrock invoke failed with ${response.status}: ${errorText}`);
  }

  const payload = await response.json();
  const text = extractBedrockText(payload, config.modelId);

  if (!text) {
    throw new Error("AWS Bedrock returned no readable text.");
  }

  return { text, providerMode: `bedrock:${config.modelId}` };
}

async function serveStatic(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.join(ROOT, path.normalize(requestedPath).replace(/^\/+/, ""));

  if (!filePath.startsWith(ROOT)) {
    sendJson(response, 403, { error: "Forbidden" });
    return;
  }

  try {
    const content = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(content);
  } catch {
    sendJson(response, 404, { error: "Not found" });
  }
}

const server = http.createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/api/state") {
    try {
      const content = await fs.readFile(DATA_FILE, "utf8");
      sendJson(response, 200, JSON.parse(content));
    } catch {
      // No data file yet — return empty object so client uses initialData
      sendJson(response, 200, {});
    }
    return;
  }

  if (request.method === "POST" && request.url === "/api/state") {
    try {
      const body = await readRequestBody(request);
      if (!body || typeof body !== "object") {
        sendJson(response, 400, { error: "Invalid state payload." });
        return;
      }
      await fs.writeFile(DATA_FILE, JSON.stringify(body, null, 2), "utf8");
      sendJson(response, 200, { ok: true });
    } catch (error) {
      sendJson(response, 500, { error: error.message || "Failed to save state." });
    }
    return;
  }

  if (request.method === "POST" && request.url === "/api/ai/generate") {
    try {
      const body = await readRequestBody(request);
      const prompt = body.prompt;

      if (!prompt || typeof prompt !== "string") {
        sendJson(response, 400, { error: "Prompt is required." });
        return;
      }

      const result = await callBedrock(prompt);
      sendJson(response, 200, result);
    } catch (error) {
      sendJson(response, 500, { error: error.message || "Unknown server error." });
    }
    return;
  }

  if (request.method === "GET" && request.url.startsWith("/api/youtube/stats")) {
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const channelId = url.searchParams.get("channelId");
      const apiKey = url.searchParams.get("apiKey");

      if (!channelId || !apiKey) {
        sendJson(response, 400, { error: "channelId and apiKey are required." });
        return;
      }

      const ytUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`;
      const ytResponse = await fetch(ytUrl);
      const ytData = await ytResponse.json();

      if (!ytResponse.ok) {
        sendJson(response, ytResponse.status, { error: ytData.error?.message || "YouTube API error." });
        return;
      }

      const item = ytData.items?.[0];
      if (!item) {
        sendJson(response, 404, { error: "Channel not found." });
        return;
      }

      sendJson(response, 200, {
        subscriberCount: Number(item.statistics?.subscriberCount || 0),
        viewCount: Number(item.statistics?.viewCount || 0),
        videoCount: Number(item.statistics?.videoCount || 0),
        title: item.snippet?.title || "",
        thumbnail: item.snippet?.thumbnails?.default?.url || ""
      });
    } catch (error) {
      sendJson(response, 500, { error: error.message || "YouTube fetch failed." });
    }
    return;
  }

  if (request.method === "GET") {
    await serveStatic(request, response);
    return;
  }

  sendJson(response, 405, { error: "Method not allowed" });
});

server.listen(PORT, HOST, () => {
  process.stdout.write(`Art Flaneur dashboard running at http://${HOST}:${PORT}\n`);
});