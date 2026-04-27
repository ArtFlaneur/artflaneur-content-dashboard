const http = require("http");
const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");

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

const SECURITY_HEADERS = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "default-src 'self'; img-src 'self' https: data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    ...SECURITY_HEADERS
  });
  response.end(JSON.stringify(payload));
}

function normalizeEndpoint(value) {
  return value ? value.replace(/\/+$/, "") : "";
}

function extractText(payload) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  if (Array.isArray(payload.output_text) && payload.output_text.length > 0) {
    return payload.output_text.join("\n");
  }

  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  if (Array.isArray(payload.output)) {
    const chunks = payload.output
      .flatMap((item) => item.content || [])
      .map((item) => item.text || item.output_text || "")
      .filter(Boolean);

    if (chunks.length > 0) {
      return chunks.join("\n\n");
    }
  }

  const chatContent = payload.choices?.[0]?.message?.content;

  if (typeof chatContent === "string") {
    return chatContent;
  }

  if (Array.isArray(chatContent)) {
    return chatContent
      .map((item) => (typeof item === "string" ? item : item.text || ""))
      .filter(Boolean)
      .join("\n\n");
  }

  return "";
}

async function readRequestBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function getAzureConfig() {
  const endpoint = normalizeEndpoint(process.env.AZURE_OPENAI_ENDPOINT);
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const model = process.env.AZURE_OPENAI_MODEL;
  const apiVersion = process.env.AZURE_OPENAI_VERSION || "2025-03-01-preview";

  if (!endpoint || !apiKey || !model) {
    return null;
  }

  return { endpoint, apiKey, model, apiVersion };
}

async function callAzureWithFallback(prompt) {
  const config = getAzureConfig();

  if (!config) {
    throw new Error("Azure OpenAI environment variables are missing on the local server.");
  }

  const systemMessage = [
    "You are a senior inbound content strategist for Art Flaneur.",
    "Respond in English.",
    "Use HubSpot-style inbound methodology.",
    "Be concrete, structured, and practical for an early-stage content marketing operator.",
    "Prefer concise sections and actionable recommendations."
  ].join(" ");

  const attempts = [
    {
      label: "chat-completions",
      url: `${config.endpoint}/openai/deployments/${encodeURIComponent(config.model)}/chat/completions?api-version=${encodeURIComponent(config.apiVersion)}`,
      body: {
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 16000,
        max_completion_tokens: 16000
      }
    },
    {
      label: "responses-preview",
      url: `${config.endpoint}/openai/responses?api-version=${encodeURIComponent(config.apiVersion)}`,
      body: {
        model: config.model,
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: systemMessage }]
          },
          {
            role: "user",
            content: [{ type: "input_text", text: prompt }]
          }
        ],
        max_output_tokens: 16000,
        temperature: 0.7
      }
    }
  ];

  let lastError = null;

  for (const attempt of attempts) {
    const response = await fetch(attempt.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": config.apiKey
      },
      body: JSON.stringify(attempt.body)
    });

    if (response.ok) {
      const payload = await response.json();
      const text = extractText(payload);

      if (!text) {
        lastError = new Error(`Azure returned no readable text for ${attempt.label}.`);
        continue;
      }

      return { text, providerMode: attempt.label };
    }

    const errorText = await response.text();
    lastError = new Error(`Azure ${attempt.label} failed with ${response.status}: ${errorText}`);

    if (![400, 404].includes(response.status)) {
      break;
    }
  }

  throw lastError || new Error("Azure OpenAI request failed.");
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
      ...SECURITY_HEADERS
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

      const result = await callAzureWithFallback(prompt);
      sendJson(response, 200, result);
    } catch (error) {
      sendJson(response, 500, { error: error.message || "Unknown server error." });
    }
    return;
  }

  if (request.method === "POST" && request.url === "/api/youtube/stats") {
    try {
      const body = await readRequestBody(request);
      const channelId = body.channelId;
      const apiKey = body.apiKey;

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