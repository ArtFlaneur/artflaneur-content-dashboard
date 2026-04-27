const STORAGE_KEY = "art-flaneur-content-dashboard";
const DATA_VERSION = 3; // bump to force-reset personas+clusters when structure changes
const DEMO_PERSONA_NAMES = ["Independent Curator", "Emerging Collector", "Cultural Traveler"];
const DEMO_CLUSTER_TITLES = [
  "Contemporary Art Discovery",
  "Art Travel Narratives",
  "Collector Confidence"
];
const DEMO_PIPELINE_TITLES = [
  "Why art jargon blocks emerging collectors",
  "Paris gallery district story map",
  "How curators build a gallery narrative",
  "What to look for in an artist profile",
  "Vienna weekend art route",
  "How to start exploring contemporary art"
];
const DEMO_CALENDAR_TITLES = [
  "How to start exploring contemporary art",
  "Paris gallery district story map",
  "Questions to ask before buying your first artwork"
];

const STATUS_ORDER = ["Idea", "Brief", "Draft", "Review", "Published"];

const initialData = {
  personas: [
    {
      id: "biennale-organizer",
      name: "Biennale Organizer",
      role: "Festival director or audience lead responsible for attendance, visibility, sponsor value, and visitor experience",
      pains: [
        "low event discoverability",
        "fragmented visitor journey",
        "pressure to prove sponsor ROI",
        "complex stakeholder coordination",
        "difficulty balancing artistic ambition with public engagement"
      ],
      goals: [
        "grow attendance",
        "improve event visibility",
        "strengthen international reach",
        "maximize sponsor satisfaction",
        "create a smooth visitor experience"
      ],
      channels: ["LinkedIn", "email outreach", "industry newsletters", "cultural conferences", "partner referrals"]
    },
    {
      id: "gallery-director",
      name: "Gallery Director",
      role: "Owner or director of a gallery focused on exhibitions, collector relationships, visitor traffic, and sales",
      pains: [
        "visibility that does not convert",
        "difficulty attracting the right audience",
        "weak collector pipeline",
        "unclear artwork value communication",
        "low exhibition-to-sale conversion"
      ],
      goals: [
        "increase collector relationships",
        "improve exhibition visibility",
        "drive qualified visitor traffic",
        "convert interest into sales",
        "build a stronger program"
      ],
      channels: ["Instagram", "email outreach", "LinkedIn", "art fairs", "gallery networks"]
    },
    {
      id: "cultural-tourist",
      name: "Cultural Tourist",
      role: "Art-loving traveler or local explorer looking for meaningful cultural experiences in a city",
      pains: [
        "fragmented cultural information",
        "hard to find quality exhibitions",
        "lack of personalized recommendations",
        "uncertainty around timing and logistics",
        "too much time spent researching"
      ],
      goals: [
        "discover unique art experiences",
        "navigate cities easily",
        "find nearby galleries and exhibitions",
        "connect with local art scenes",
        "enrich travel through culture"
      ],
      channels: ["Instagram", "TikTok", "app stores", "travel blogs", "city guides"]
    }
  ],
  journey: [
    {
      stage: "Awareness",
      description: "Audience is naming a problem or curiosity.",
      focus: ["Educational explainers", "Trend context", "Glossaries"],
      promptHint: "What questions appear before a buying intent exists?"
    },
    {
      stage: "Consideration",
      description: "Audience compares approaches, formats, or options.",
      focus: ["Roundups", "Frameworks", "Comparison guides"],
      promptHint: "What helps them compare with confidence?"
    },
    {
      stage: "Decision",
      description: "Audience is ready for a concrete next step.",
      focus: ["Case studies", "Offers", "Calls to action"],
      promptHint: "What removes friction from action?"
    }
  ],
  clusters: [
    {
      title: "Festival Audience Growth",
      persona: "Biennale Organizer",
      intent: "Awareness",
      score: "9/10",
      summary: "Helps biennale and festival organizers improve attendance, discoverability, and public engagement",
      subtopics: ["festival audience development", "event discoverability", "cultural event marketing", "visitor engagement", "public program promotion", "audience growth strategy"]
    },
    {
      title: "Sponsor Value for Festivals",
      persona: "Biennale Organizer",
      intent: "Consideration",
      score: "8/10",
      summary: "Helps festival teams prove sponsor ROI and position Art Flaneur as a measurable partner",
      subtopics: ["sponsor ROI", "partnership visibility", "cultural sponsorship value", "event reporting", "sponsor activation", "festival analytics"]
    },
    {
      title: "Event Routes and Visitor Experience",
      persona: "Biennale Organizer",
      intent: "Consideration",
      score: "9/10",
      summary: "Shows how Art Flaneur improves navigation, visitor flow, and the experience of moving through multi-venue events",
      subtopics: ["event routes", "art festival map", "visitor journey", "citywide art event navigation", "multi-venue experience", "cultural wayfinding"]
    },
    {
      title: "Partner with Art Flaneur for Your Festival",
      persona: "Biennale Organizer",
      intent: "Decision",
      score: "8/10",
      summary: "Moves festival directors from evaluation to commitment by addressing final objections, demonstrating measurable ROI, and making the path to onboarding with Art Flaneur clear and low-risk",
      subtopics: ["Art Flaneur festival partnership", "event platform onboarding", "festival ROI case studies", "cultural event tech adoption", "pilot program for festivals", "festival partnership pricing and scope"]
    },
    {
      title: "Gallery Visibility That Converts",
      persona: "Gallery Director",
      intent: "Awareness",
      score: "10/10",
      summary: "Speaks directly to galleries that struggle to turn visibility into qualified traffic and sales",
      subtopics: ["gallery visibility", "exhibition promotion", "art gallery marketing", "qualified visitor traffic", "collector discovery", "exhibition traffic"]
    },
    {
      title: "Exhibition Discovery",
      persona: "Gallery Director",
      intent: "Awareness",
      score: "8/10",
      summary: "Attracts both galleries and cultural audiences through the problem of finding current exhibitions easily",
      subtopics: ["current exhibitions", "how to find exhibitions", "art shows near me", "exhibition guides", "local art discovery", "gallery exhibitions"]
    },
    {
      title: "Collector Traffic and Conversion",
      persona: "Gallery Director",
      intent: "Consideration",
      score: "9/10",
      summary: "Positions Art Flaneur as a growth tool for galleries seeking collector relationships and better exhibition conversion",
      subtopics: ["collector traffic", "collector engagement", "gallery sales conversion", "art buyer journey", "exhibition-to-sale conversion", "collector acquisition"]
    },
    {
      title: "Convert Exhibition Interest to Sales",
      persona: "Gallery Director",
      intent: "Decision",
      score: "9/10",
      summary: "Supports gallery directors at the decision stage with clear frameworks for converting exhibition visitors and online followers into buyers and long-term collector relationships",
      subtopics: ["artwork pricing transparency", "collector follow-up process", "gallery CTA strategy", "purchase confidence builders", "exhibition closing techniques", "collector relationship onboarding"]
    },
    {
      title: "Cultural City Guides",
      persona: "Cultural Tourist",
      intent: "Awareness",
      score: "8/10",
      summary: "Helps cultural tourists discover cities through art and supports Art Flaneur's distribution and authority layer",
      subtopics: ["art city guide", "cultural travel guide", "art in Tokyo", "art in Melbourne", "gallery neighborhoods", "creative city routes"]
    },
    {
      title: "Art Travel Planning",
      persona: "Cultural Tourist",
      intent: "Consideration",
      score: "7/10",
      summary: "Solves the planning problem for cultural tourists who need timing, relevance, and easy navigation",
      subtopics: ["art trip planning", "cultural itinerary", "gallery route planner", "exhibition travel tips", "weekend art itinerary", "art tourism planning"]
    },
    {
      title: "Book and Plan Your Art Trip",
      persona: "Cultural Tourist",
      intent: "Decision",
      score: "8/10",
      summary: "Helps cultural tourists move from intent to action with clear booking paths, exhibition checklists, and personalised itinerary guidance for art-focused travel",
      subtopics: ["art experience booking", "gallery visit planning", "cultural trip itinerary builder", "what to see this weekend", "exhibition booking guide", "art travel checklist"]
    }
  ],
  pipeline: {
    Idea: [],
    Brief: [],
    Draft: [],
    Review: [],
    Published: []
  },
  channels: [],
  calendar: [],
  hints: [
    {
      title: "Start with the problem, not the product",
      body: "Inbound content works best when each piece answers a real audience question before it asks for attention or conversion."
    },
    {
      title: "One cluster, many entry points",
      body: "A strong cluster has one core topic and several subtopics that help different personas enter the same conversation."
    },
    {
      title: "Match content to buyer intent",
      body: "Awareness content should educate. Consideration content should compare. Decision content should reduce friction and move to action."
    },
    {
      title: "Use English as your operating language",
      body: "Keep titles, briefs, prompts, and publication notes in English so the AI workflow and final content stay aligned."
    }
  ],
  aiTasks: [
    {
      id: "strategy-plan",
      title: "Build strategic plan",
      body: "Plan the next cluster and brief for the current focus."
    },
    {
      id: "persona-depth",
      title: "Expand persona depth",
      body: "Sharpen pains, objections, and trusted channels for one persona."
    },
    {
      id: "cluster-gaps",
      title: "Generate cluster gaps",
      body: "Spot missing subtopics and weak stage coverage."
    },
    {
      id: "content-brief",
      title: "Draft an English brief",
      body: "Turn one topic into a concise, publishable brief."
    },
    {
      id: "full-draft",
      title: "Write full draft",
      body: "Turn a brief into publication-ready prose for the selected format."
    }
  ],
  aiHistory: []
};

const personaFilter = document.querySelector("#personaFilter");
const stageFilter = document.querySelector("#stageFilter");
const overviewMetrics = document.querySelector("#overviewMetrics");
const workflowGuide = document.querySelector("#workflowGuide");
const personaGrid = document.querySelector("#personaGrid");
const journeyGrid = document.querySelector("#journeyGrid");
const clusterGrid = document.querySelector("#clusterGrid");
const pipelineBoard = document.querySelector("#pipelineBoard");
const calendarList = document.querySelector("#calendarList");
const coverageList = document.querySelector("#coverageList");
const learningGrid = document.querySelector("#learningGrid");
const aiTaskList = document.querySelector("#aiTaskList");
const promptOutput = document.querySelector("#promptOutput");
const aiResponse = document.querySelector("#aiResponse");
const aiStatus = document.querySelector("#aiStatus");
const runAiButton = document.querySelector("#runAi");
const applyAiButton = document.querySelector("#applyAi");
const applyAiNote = document.querySelector("#applyAiNote");
const aiHistoryList = document.querySelector("#aiHistoryList");
const navStatusTargets = document.querySelectorAll("[data-status-for]");
const weeklyFocus = document.querySelector("#weekly-focus");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".panel[id]");
const personaForm = document.querySelector("#personaForm");
const clusterForm = document.querySelector("#clusterForm");
const contentForm = document.querySelector("#contentForm");
const clusterPersona = document.querySelector("#clusterPersona");
const contentPersona = document.querySelector("#contentPersona");
const copyPromptButton = document.querySelector("#copyPrompt");
const aiQuickAction = document.querySelector("#aiQuickAction");
const briefModal = document.querySelector("#briefModal");
const briefModalTitle = document.querySelector("#briefModalTitle");
const briefPersonaSelect = document.querySelector("#briefPersona");
const briefStageSelect = document.querySelector("#briefStage");
const briefStatusSelect = document.querySelector("#briefStatus");
const briefFormat = document.querySelector("#briefFormat");
const briefChannel = document.querySelector("#briefChannel");
const briefPublishDate = document.querySelector("#briefPublishDate");
const briefContentEditor = document.querySelector("#briefContentEditor");
const saveBriefButton = document.querySelector("#saveBrief");
const advanceBriefButton = document.querySelector("#advanceBrief");
const scheduleBriefButton = document.querySelector("#scheduleBrief");
const deleteBriefButton = document.querySelector("#deleteBrief");
const closeBriefModalButton = document.querySelector("#closeBriefModal");
const editPersonaModal = document.querySelector("#editPersonaModal");
const editPersonaModalTitle = document.querySelector("#editPersonaName");
const editPersonaForm = document.querySelector("#editPersonaForm");
const editPersonaIdInput = document.querySelector("#editPersonaId");
const editPersonaNameInput = document.querySelector("#editPersonaNameInput");
const editPersonaRoleInput = document.querySelector("#editPersonaRole");
const editPersonaPainsInput = document.querySelector("#editPersonaPains");
const editPersonaGoalsInput = document.querySelector("#editPersonaGoals");
const editPersonaChannelsInput = document.querySelector("#editPersonaChannels");
const closeEditPersonaModalButton = document.querySelector("#closeEditPersonaModal");
const calendarForm = document.querySelector("#calendarForm");
const channelForm = document.querySelector("#channelForm");
const channelGrid = document.querySelector("#channelGrid");
const editClusterModal = document.querySelector("#editClusterModal");
const editClusterModalTitle = document.querySelector("#editClusterModalTitle");
const editClusterForm = document.querySelector("#editClusterForm");
const editClusterKeyInput = document.querySelector("#editClusterKey");
const editClusterTitleInput = document.querySelector("#editClusterTitle");
const editClusterPersonaSelect = document.querySelector("#editClusterPersona");
const editClusterIntentSelect = document.querySelector("#editClusterIntent");
const editClusterScoreInput = document.querySelector("#editClusterScore");
const editClusterSummaryInput = document.querySelector("#editClusterSummary");
const editClusterSubtopicsInput = document.querySelector("#editClusterSubtopics");
const closeEditClusterModalButton = document.querySelector("#closeEditClusterModal");

const selectedFilters = {
  persona: "All personas",
  stage: "All stages"
};

let activeAiTaskId = "strategy-plan";
let latestAiRun = null;
let activeBriefEdit = null;
let activeEditPersonaId = null;
let activeEditClusterKey = null;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeLabel(value) {
  return String(value || "").trim().toLowerCase();
}

function uniqueList(values) {
  return [...new Set((values || []).map((value) => String(value).trim()).filter(Boolean))];
}

function normalizeCluster(cluster) {
  return {
    title: String(cluster?.title || "").trim(),
    persona: String(cluster?.persona || "").trim(),
    score: cluster?.score || "AI draft",
    intent: cluster?.intent || "Awareness",
    summary: cluster?.summary || "AI-generated cluster summary.",
    subtopics: uniqueList(cluster?.subtopics)
  };
}

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizePipelineItem(item) {
  return {
    id: item?.id || generateId(),
    title: String(item?.title || "").trim(),
    persona: String(item?.persona || "").trim(),
    stage: String(item?.stage || "").trim(),
    format: item?.format || "",
    channel: item?.channel || "",
    publishDate: item?.publishDate || "",
    briefContent: item?.briefContent || ""
  };
}

function normalizeCalendarEntry(entry) {
  return {
    id: entry?.id || generateId(),
    date: String(entry?.date || "").trim(),
    title: String(entry?.title || "").trim(),
    channel: String(entry?.channel || "").trim(),
    note: String(entry?.note || "").trim()
  };
}

function normalizeChannel(channel) {
  return {
    id: channel?.id || generateId(),
    platform: String(channel?.platform || "").trim(),
    handle: String(channel?.handle || "").trim(),
    url: String(channel?.url || "").trim(),
    apiKey: String(channel?.apiKey || "").trim(),
    channelId: String(channel?.channelId || "").trim(),
    snapshots: (channel?.snapshots || []).map((s) => ({
      date: String(s.date || ""),
      count: Number(s.count) || 0
    }))
  };
}

function matchesExactSet(items, expected, getValue) {
  const actual = [...(items || [])].map(getValue).sort();
  const target = [...expected].sort();

  if (actual.length !== target.length) {
    return false;
  }

  return actual.every((value, index) => value === target[index]);
}

function isDemoPipeline(pipeline) {
  const titles = Object.values(pipeline || {})
    .flat()
    .map((item) => item.title);

  return matchesExactSet(titles, DEMO_PIPELINE_TITLES, (value) => value);
}

function migratePrototypeState(data) {
  const nextData = { ...data };

  if (matchesExactSet(nextData.personas, DEMO_PERSONA_NAMES, (persona) => persona.name)) {
    nextData.personas = clone(initialData.personas);
  }

  if (matchesExactSet(nextData.clusters, DEMO_CLUSTER_TITLES, (cluster) => cluster.title)) {
    nextData.clusters = [];
  }

  if (isDemoPipeline(nextData.pipeline)) {
    nextData.pipeline = clone(initialData.pipeline);
  }

  if (matchesExactSet(nextData.calendar, DEMO_CALENDAR_TITLES, (entry) => entry.title)) {
    nextData.calendar = [];
  }

  return nextData;
}

function loadState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return clone(initialData);
    }

    const parsed = JSON.parse(stored);

    // If data version is stale, reset personas and clusters to initialData only once,
    // then immediately persist the new version so subsequent loads don't re-reset.
    const needsReset = !parsed.dataVersion || parsed.dataVersion < DATA_VERSION;
    const personas = needsReset ? clone(initialData.personas) : (parsed.personas || clone(initialData.personas));
    const rawClusters = needsReset
      ? clone(initialData.clusters)
      : ((parsed.clusters && parsed.clusters.length > 0) ? parsed.clusters : clone(initialData.clusters));

    const state = migratePrototypeState({
      ...clone(initialData),
      ...parsed,
      dataVersion: DATA_VERSION,
      hints: clone(initialData.hints),
      aiTasks: clone(initialData.aiTasks),
      personas,
      clusters: rawClusters.map((cluster) => normalizeCluster(cluster)),
      pipeline: Object.fromEntries(
        Object.entries({ ...clone(initialData.pipeline), ...(parsed.pipeline || {}) }).map(([status, items]) => [
          status,
          (items || []).map(normalizePipelineItem)
        ])
      ),
      channels: (parsed.channels || []).map(normalizeChannel),
      calendar: (parsed.calendar || []).map(normalizeCalendarEntry)
    });

    // Persist immediately after a version reset so it only happens once
    if (needsReset) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, dataVersion: DATA_VERSION }));
      } catch {
        // ignore
      }
    }

    return state;
  } catch {
    return clone(initialData);
  }
}

let dashboardData = loadState();

function saveState() {
  const payload = { ...dashboardData, dataVersion: DATA_VERSION };
  // Persist to localStorage as fallback
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
  // Persist to server (fire-and-forget) for cross-computer stability
  fetch("/api/state", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => {
    // offline or server not running — localStorage already saved above
  });
}

// On startup, load from server and overwrite local state if server has valid data.
// Runs after renderAll() so the page shows immediately while the fetch completes.
async function initServerSync() {
  try {
    const res = await fetch("/api/state");
    if (!res.ok) return;
    const serverData = await res.json();
    // Only update if server has actual data (clusters or personas present)
    const hasClusters = Array.isArray(serverData.clusters) && serverData.clusters.length > 0;
    const hasPersonas = Array.isArray(serverData.personas) && serverData.personas.length > 0;
    if (!hasClusters && !hasPersonas) return;
    // Apply same migration logic as loadState
    const needsReset = !serverData.dataVersion || serverData.dataVersion < DATA_VERSION;
    const personas = needsReset ? clone(initialData.personas) : (serverData.personas || clone(initialData.personas));
    const rawClusters = needsReset
      ? clone(initialData.clusters)
      : (serverData.clusters && serverData.clusters.length > 0 ? serverData.clusters : clone(initialData.clusters));
    dashboardData = migratePrototypeState({
      ...clone(initialData),
      ...serverData,
      dataVersion: DATA_VERSION,
      hints: clone(initialData.hints),
      aiTasks: clone(initialData.aiTasks),
      personas,
      clusters: rawClusters.map((cluster) => normalizeCluster(cluster)),
      pipeline: Object.fromEntries(
        Object.entries({ ...clone(initialData.pipeline), ...(serverData.pipeline || {}) }).map(([status, items]) => [
          status,
          (items || []).map(normalizePipelineItem)
        ])
      ),
      channels: (serverData.channels || []).map(normalizeChannel),
      calendar: (serverData.calendar || []).map(normalizeCalendarEntry)
    });
    // Sync localStorage to match server
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...dashboardData, dataVersion: DATA_VERSION }));
    } catch {
      // ignore
    }
    renderAll();
  } catch {
    // Server unreachable — continue with localStorage data
  }
}

function splitList(value) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function parseCoverageScore(value) {
  const score = Number.parseInt(String(value).replace(/[^0-9]/g, ""), 10);
  return Number.isNaN(score) ? 0 : score;
}

function isClusterMatch(cluster, personaName = selectedFilters.persona, stageName = selectedFilters.stage) {
  const matchesPersona = personaName === "All personas" || cluster.persona === personaName;
  const matchesStage = stageName === "All stages" || cluster.intent === stageName;

  return matchesPersona && matchesStage;
}

function getFilteredClusters(personaName = selectedFilters.persona, stageName = selectedFilters.stage) {
  return dashboardData.clusters.filter((cluster) => isClusterMatch(cluster, personaName, stageName));
}

function getLargestGapCluster() {
  return [...getFilteredClusters()].sort(
    (left, right) => parseCoverageScore(left.score) - parseCoverageScore(right.score)
  )[0] || null;
}

function getFocusedPersona() {
  if (selectedFilters.persona !== "All personas") {
    return selectedFilters.persona;
  }

  const pipelineItems = Object.values(dashboardData.pipeline).flat();
  const stageItems =
    selectedFilters.stage === "All stages"
      ? pipelineItems
      : pipelineItems.filter((item) => item.stage === selectedFilters.stage);

  const rankedPersonas = dashboardData.personas
    .map((persona) => ({
      name: persona.name,
      stageCount: stageItems.filter((item) => item.persona === persona.name).length,
      totalCount: pipelineItems.filter((item) => item.persona === persona.name).length
    }))
    .sort((left, right) => {
      if (right.stageCount !== left.stageCount) {
        return right.stageCount - left.stageCount;
      }

      return right.totalCount - left.totalCount;
    });

  return rankedPersonas[0]?.name || "the most strategic persona";
}

function getFocusedStage() {
  if (selectedFilters.stage !== "All stages") {
    return selectedFilters.stage;
  }

  return getLargestGapCluster()?.intent || "Decision";
}

function getFocusedCluster(stage = getFocusedStage(), persona = getFocusedPersona()) {
  const stageClusters = getFilteredClusters(persona, stage);
  const rankedClusters = stageClusters.length ? stageClusters : getFilteredClusters(persona, "All stages");

  return [...rankedClusters].sort(
    (left, right) => parseCoverageScore(left.score) - parseCoverageScore(right.score)
  )[0] || null;
}

function getActiveAiTask() {
  return dashboardData.aiTasks.find((task) => task.id === activeAiTaskId) || dashboardData.aiTasks[0] || null;
}

function extractAppData(text) {
  const match = String(text || "").match(/<app-data>\s*([\s\S]*?)\s*<\/app-data>/i);

  if (!match) {
    return { appData: null, displayText: String(text || "").trim() };
  }

  try {
    const appData = JSON.parse(match[1]);
    const displayText = String(text || "").replace(match[0], "").trim();
    return { appData, displayText };
  } catch {
    return { appData: null, displayText: String(text || "").trim() };
  }
}

function formatHistoryTime(value) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getHistoryPrompt(entry) {
  const savedPrompt = String(entry?.prompt || entry?.requestPrompt || "");
  const marker = "\n\nCurrent dashboard strategy snapshot:\n";
  return savedPrompt.includes(marker) ? savedPrompt.split(marker)[0] : savedPrompt;
}

function autoSizeTextPanel(element, maxHeight = 720) {
  if (!element) {
    return;
  }

  element.style.height = "auto";
  element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`;
  element.style.overflowY = element.scrollHeight > maxHeight ? "auto" : "hidden";
}

function syncTextPanels() {
  autoSizeTextPanel(promptOutput, 680);
  autoSizeTextPanel(aiResponse, 760);
}

function updateApplyState() {
  const canApply = Boolean(latestAiRun?.appData);
  applyAiButton.disabled = !canApply;
  applyAiNote.textContent = canApply
    ? `Ready to apply ${latestAiRun.title} to the dashboard.`
    : "The latest structured AI result can update personas, clusters, or content items.";
}

function saveAiHistoryEntry(entry) {
  dashboardData.aiHistory = [entry, ...(dashboardData.aiHistory || []).filter((item) => item.id !== entry.id)].slice(0, 8);
  saveState();
}

function findContentItem(title) {
  for (const [status, items] of Object.entries(dashboardData.pipeline)) {
    const index = items.findIndex((item) => normalizeLabel(item.title) === normalizeLabel(title));

    if (index >= 0) {
      return { status, index, item: items[index] };
    }
  }

  return null;
}

function upsertContentItem(itemData, fallbackPersona, fallbackStage) {
  const title = String(itemData?.title || "").trim();

  if (!title) {
    return false;
  }

  const nextStatus = itemData.status || "Brief";
  const existing = findContentItem(title);
  const existingItem = existing ? existing.item : null;
  const nextItem = normalizePipelineItem({
    id: existingItem?.id,
    title,
    persona: itemData.persona || fallbackPersona || getFocusedPersona(),
    stage: itemData.stage || fallbackStage || getFocusedStage(),
    format: itemData.format || existingItem?.format,
    channel: itemData.channel || existingItem?.channel,
    publishDate: itemData.publishDate || existingItem?.publishDate,
    briefContent: itemData.briefContent || existingItem?.briefContent
  });

  if (existing) {
    dashboardData.pipeline[existing.status].splice(existing.index, 1);
  }

  dashboardData.pipeline[nextStatus].unshift(nextItem);
  return true;
}

function upsertCluster(clusterData, fallbackStage, fallbackPersona) {
  const title = String(clusterData?.title || "").trim();
  const persona = String(clusterData?.persona || fallbackPersona || getFocusedPersona() || "").trim();

  if (!title || !persona) {
    return false;
  }

  const nextCluster = normalizeCluster({
    title,
    persona,
    score: clusterData.score || "AI draft",
    intent: clusterData.intent || fallbackStage || getFocusedStage(),
    summary: clusterData.summary || "AI-generated cluster summary.",
    subtopics: uniqueList(clusterData.subtopics)
  });

  const existingIndex = dashboardData.clusters.findIndex(
    (cluster) => normalizeLabel(cluster.title) === normalizeLabel(title)
      && normalizeLabel(cluster.persona) === normalizeLabel(persona)
      && cluster.intent === nextCluster.intent
  );

  if (existingIndex >= 0) {
    dashboardData.clusters.splice(existingIndex, 1);
  }

  dashboardData.clusters.unshift(nextCluster);
  return true;
}

function upsertPersona(personaData, fallbackName) {
  const name = String(personaData?.name || fallbackName || "").trim();

  if (!name) {
    return false;
  }

  const existingIndex = dashboardData.personas.findIndex(
    (persona) => normalizeLabel(persona.name) === normalizeLabel(name)
  );
  const existingPersona = existingIndex >= 0 ? dashboardData.personas[existingIndex] : null;
  const nextPersona = {
    id: slugify(name),
    name,
    role: personaData.role || existingPersona?.role || "AI-enriched persona profile",
    pains: uniqueList(personaData.pains || existingPersona?.pains),
    goals: uniqueList(personaData.goals || existingPersona?.goals),
    channels: uniqueList(personaData.channels || existingPersona?.channels)
  };

  if (existingIndex >= 0) {
    dashboardData.personas.splice(existingIndex, 1);
  }

  dashboardData.personas.unshift(nextPersona);
  return true;
}

function getNextStatus(currentStatus) {
  const index = STATUS_ORDER.indexOf(currentStatus);
  return index >= 0 && index < STATUS_ORDER.length - 1 ? STATUS_ORDER[index + 1] : null;
}

function findContentItemById(id) {
  for (const [status, items] of Object.entries(dashboardData.pipeline)) {
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      return { status, index, item: items[index] };
    }
  }
  return null;
}

function moveItemToStage(id, toStatus) {
  const found = findContentItemById(id);
  if (!found || found.status === toStatus) {
    return false;
  }
  const item = found.item;
  dashboardData.pipeline[found.status].splice(found.index, 1);
  dashboardData.pipeline[toStatus].unshift(item);
  return true;
}

function openBriefEditor(itemId) {
  const found = findContentItemById(itemId);
  if (!found) return;

  const item = found.item;
  activeBriefEdit = { id: itemId };

  briefModalTitle.value = item.title;

  briefPersonaSelect.innerHTML = dashboardData.personas
    .map((p) => `<option value="${p.name}"${p.name === item.persona ? " selected" : ""}>${p.name}</option>`)
    .join("");

  briefStageSelect.value = item.stage;
  briefStatusSelect.value = found.status;
  briefFormat.value = item.format || "";
  briefChannel.value = item.channel || "";
  briefPublishDate.value = item.publishDate || "";
  briefContentEditor.value = item.briefContent || "";

  const nextStatus = getNextStatus(found.status);
  advanceBriefButton.textContent = nextStatus ? `Advance to ${nextStatus}` : "Already published";
  advanceBriefButton.disabled = !nextStatus;

  briefModal.hidden = false;
  briefContentEditor.focus();
}

function closeBriefEditor() {
  briefModal.hidden = true;
  activeBriefEdit = null;
}

function saveBriefFromModal() {
  if (!activeBriefEdit) return;

  const found = findContentItemById(activeBriefEdit.id);
  if (!found) return;

  const newTitle = briefModalTitle.value.trim();
  const newPersona = briefPersonaSelect.value;
  const newStage = briefStageSelect.value;
  const newStatus = briefStatusSelect.value;

  if (newTitle) found.item.title = newTitle;
  found.item.persona = newPersona;
  found.item.stage = newStage;
  found.item.format = briefFormat.value;
  found.item.channel = briefChannel.value;
  found.item.publishDate = briefPublishDate.value;
  found.item.briefContent = briefContentEditor.value;

  // Move to different pipeline lane if status changed
  if (newStatus && newStatus !== found.status) {
    dashboardData.pipeline[found.status].splice(found.index, 1);
    dashboardData.pipeline[newStatus].unshift(found.item);
  }

  saveState();
  renderAll();
  setAiStatus("Brief saved", "success");
}

function advanceFromBriefModal() {
  if (!activeBriefEdit) return;

  saveBriefFromModal();

  const found = findContentItemById(activeBriefEdit.id);
  if (!found) return;

  const nextStatus = getNextStatus(found.status);
  if (!nextStatus) return;

  moveItemToStage(activeBriefEdit.id, nextStatus);
  saveState();
  renderAll();

  // Refresh status select and advance button
  briefStatusSelect.value = nextStatus;
  const nextNextStatus = getNextStatus(nextStatus);
  advanceBriefButton.textContent = nextNextStatus ? `Advance to ${nextNextStatus}` : "Already published";
  advanceBriefButton.disabled = !nextNextStatus;

  setAiStatus(`Moved to ${nextStatus}`, "success");
}

function scheduleFromBriefModal() {
  if (!activeBriefEdit) return;

  saveBriefFromModal();

  const found = findContentItemById(activeBriefEdit.id);
  if (!found) return;

  const item = found.item;
  const date = item.publishDate || new Date().toISOString().slice(0, 10);
  const channel = item.channel || "Blog";
  const currentTitle = briefModalTitle.value.trim() || item.title;

  const existingIndex = dashboardData.calendar.findIndex(
    (entry) => normalizeLabel(entry.title) === normalizeLabel(currentTitle)
  );

  if (existingIndex >= 0) {
    dashboardData.calendar[existingIndex].date = date;
    dashboardData.calendar[existingIndex].channel = channel;
    if (item.format) {
      dashboardData.calendar[existingIndex].note = `Format: ${item.format}`;
    }
  } else {
    dashboardData.calendar.unshift(normalizeCalendarEntry({
      title: currentTitle,
      date,
      channel,
      note: item.format ? `Format: ${item.format}` : "Scheduled from pipeline"
    }));
  }

  saveState();
  renderAll();
  setAiStatus("Added to publishing calendar", "success");
  closeBriefEditor();
  showSection("calendar");
}

function deleteContentItem(itemId) {
  for (const [status, items] of Object.entries(dashboardData.pipeline)) {
    const index = items.findIndex((item) => item.id === itemId);
    if (index >= 0) {
      dashboardData.pipeline[status].splice(index, 1);
      saveState();
      renderAll();
      setAiStatus("Item deleted", "success");
      return;
    }
  }
}

function deleteFromBriefModal() {
  if (!activeBriefEdit) return;
  const id = activeBriefEdit.id;
  closeBriefEditor();
  deleteContentItem(id);
}

function openEditPersona(personaId) {
  const persona = dashboardData.personas.find((p) => p.id === personaId);
  if (!persona) return;

  activeEditPersonaId = personaId;
  editPersonaModalTitle.textContent = persona.name;
  editPersonaIdInput.value = persona.id;
  editPersonaNameInput.value = persona.name;
  editPersonaRoleInput.value = persona.role;
  editPersonaPainsInput.value = persona.pains.join(", ");
  editPersonaGoalsInput.value = persona.goals.join(", ");
  editPersonaChannelsInput.value = persona.channels.join(", ");

  editPersonaModal.hidden = false;
}

function saveEditPersona(event) {
  event.preventDefault();

  if (!activeEditPersonaId) return;

  const index = dashboardData.personas.findIndex((p) => p.id === activeEditPersonaId);
  if (index < 0) return;

  const oldName = dashboardData.personas[index].name;
  const formData = new FormData(editPersonaForm);
  const newName = formData.get("name").toString().trim();

  dashboardData.personas[index] = {
    id: activeEditPersonaId,
    name: newName,
    role: formData.get("role").toString().trim(),
    pains: splitList(formData.get("pains").toString()),
    goals: splitList(formData.get("goals").toString()),
    channels: splitList(formData.get("channels").toString())
  };

  if (selectedFilters.persona === oldName) {
    selectedFilters.persona = newName;
  }

  saveState();
  renderAll();
  editPersonaModal.hidden = true;
  activeEditPersonaId = null;
  setAiStatus("Persona updated", "success");
  showSection("personas");
}

function addCalendarEntry(event) {
  event.preventDefault();
  const formData = new FormData(calendarForm);

  dashboardData.calendar.unshift(normalizeCalendarEntry({
    title: formData.get("title").toString().trim(),
    date: formData.get("date").toString(),
    channel: formData.get("channel").toString(),
    note: formData.get("note")?.toString().trim() || ""
  }));

  saveState();
  renderAll();
  calendarForm.reset();
}

function removeCalendarEntry(entryId) {
  dashboardData.calendar = dashboardData.calendar.filter((entry) => entry.id !== entryId);
  saveState();
  renderAll();
}

const PLATFORM_EMOJI = {
  Instagram: "📸",
  YouTube: "▶️",
  LinkedIn: "💼",
  TikTok: "🎵",
  Newsletter: "📧",
  Blog: "✍️",
  Facebook: "🔵",
  "X / Twitter": "✖️"
};

function getChannelLatest(channel) {
  if (!channel.snapshots.length) return null;
  return [...channel.snapshots].sort((a, b) => b.date.localeCompare(a.date))[0];
}

function getChannelPrev(channel) {
  const sorted = [...channel.snapshots].sort((a, b) => b.date.localeCompare(a.date));
  return sorted[1] || null;
}

function formatFollowers(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function addChannel(event) {
  event.preventDefault();
  const formData = new FormData(channelForm);
  dashboardData.channels.push(normalizeChannel({
    platform: formData.get("platform").toString(),
    handle: formData.get("handle").toString().trim(),
    url: formData.get("url").toString().trim(),
    apiKey: formData.get("apiKey").toString().trim(),
    channelId: formData.get("channelId").toString().trim(),
    snapshots: []
  }));
  saveState();
  renderAll();
  channelForm.reset();
}

function deleteChannel(channelId) {
  dashboardData.channels = dashboardData.channels.filter((c) => c.id !== channelId);
  saveState();
  renderAll();
  setAiStatus("Channel removed", "success");
}

function logChannelCount(channelId, count) {
  const channel = dashboardData.channels.find((c) => c.id === channelId);
  if (!channel) return;

  const today = new Date().toISOString().slice(0, 10);
  const existingToday = channel.snapshots.findIndex((s) => s.date === today);

  if (existingToday >= 0) {
    channel.snapshots[existingToday].count = count;
  } else {
    channel.snapshots.push({ date: today, count });
  }

  // Keep last 52 snapshots (1 year of weekly data)
  channel.snapshots = [...channel.snapshots]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-52);

  saveState();
  renderAll();
  setAiStatus(`${channel.platform} count updated`, "success");
}

async function fetchYouTubeStats(channelId) {
  const channel = dashboardData.channels.find((c) => c.id === channelId);
  if (!channel || !channel.apiKey || !channel.channelId) {
    setAiStatus("YouTube API key and Channel ID required", "error");
    return;
  }

  setAiStatus("Fetching YouTube stats…", "loading");

  try {
    const response = await fetch(
      `/api/youtube/stats?channelId=${encodeURIComponent(channel.channelId)}&apiKey=${encodeURIComponent(channel.apiKey)}`
    );
    const data = await response.json();

    if (!response.ok) {
      setAiStatus(data.error || "YouTube fetch failed", "error");
      return;
    }

    logChannelCount(channelId, data.subscriberCount);
    setAiStatus(`YouTube: ${formatFollowers(data.subscriberCount)} subscribers`, "success");
  } catch {
    setAiStatus("YouTube fetch failed — check connection", "error");
  }
}

function renderChannelSparkline(snapshots) {
  if (snapshots.length < 2) return "";

  const sorted = [...snapshots].sort((a, b) => a.date.localeCompare(b.date)).slice(-8);
  const max = Math.max(...sorted.map((s) => s.count));
  const min = Math.min(...sorted.map((s) => s.count));
  const range = max - min || 1;

  const bars = sorted.map((s) => {
    const pct = Math.round(((s.count - min) / range) * 100);
    return `<span class="spark-bar" style="--h:${Math.max(pct, 8)}%" title="${s.date}: ${formatFollowers(s.count)}"></span>`;
  }).join("");

  return `<div class="spark-chart">${bars}</div>`;
}

function renderChannels() {
  if (!channelGrid) return;

  if (!dashboardData.channels.length) {
    channelGrid.innerHTML = '<div class="empty-state">No channels tracked yet. Add your first distribution channel above.</div>';
    return;
  }

  channelGrid.innerHTML = dashboardData.channels.map((channel) => {
    const latest = getChannelLatest(channel);
    const prev = getChannelPrev(channel);
    const count = latest?.count ?? null;
    const delta = (latest && prev) ? latest.count - prev.count : null;
    const deltaText = delta === null
      ? ""
      : delta > 0
        ? `<span class="channel-delta channel-delta-up">+${formatFollowers(delta)}</span>`
        : delta < 0
          ? `<span class="channel-delta channel-delta-down">${formatFollowers(delta)}</span>`
          : `<span class="channel-delta channel-delta-flat">—</span>`;

    const emoji = PLATFORM_EMOJI[channel.platform] || "🌐";
    const isYouTube = channel.platform === "YouTube" && channel.apiKey && channel.channelId;

    return `
      <article class="channel-card">
        <div class="channel-card-head">
          <div class="channel-platform-icon">${emoji}</div>
          <div>
            <p class="card-label eyebrow">${channel.platform}</p>
            <h4 class="channel-handle">${channel.handle}</h4>
          </div>
          <div class="channel-count-block">
            ${count !== null
              ? `<strong class="channel-count">${formatFollowers(count)}</strong>${deltaText}`
              : `<span class="channel-count-empty">No data</span>`}
          </div>
        </div>
        ${renderChannelSparkline(channel.snapshots)}
        ${latest ? `<p class="channel-last-updated">Last logged ${latest.date}</p>` : ""}
        <div class="channel-card-actions">
          <div class="channel-log-row">
            <input class="channel-count-input" type="number" min="0" placeholder="Log today's count"
              id="count-input-${channel.id}" />
            <button class="ghost-button-sm" type="button" data-log-channel="${channel.id}">Log</button>
          </div>
          ${isYouTube
            ? `<button class="ghost-button-sm" type="button" data-fetch-youtube="${channel.id}">Auto-fetch ▶️</button>`
            : ""}
          ${channel.url ? `<a class="ghost-button-sm channel-link" href="${channel.url}" target="_blank" rel="noopener noreferrer">View profile ↗</a>` : ""}
          <button class="ghost-button-sm ghost-button-sm-danger" type="button" data-delete-channel="${channel.id}">Remove</button>
        </div>
      </article>
    `;
  }).join("");
}

function clusterKey(cluster) {
  return `${normalizeLabel(cluster.persona)}::${normalizeLabel(cluster.title)}::${cluster.intent}`;
}

function deleteCluster(key) {
  const index = dashboardData.clusters.findIndex((c) => clusterKey(c) === key);
  if (index >= 0) {
    dashboardData.clusters.splice(index, 1);
    saveState();
    renderAll();
    setAiStatus("Cluster deleted", "success");
  }
}

function openEditCluster(key) {
  const cluster = dashboardData.clusters.find((c) => clusterKey(c) === key);
  if (!cluster) return;

  activeEditClusterKey = key;
  editClusterModalTitle.textContent = cluster.title;
  editClusterKeyInput.value = key;
  editClusterTitleInput.value = cluster.title;

  editClusterPersonaSelect.innerHTML = dashboardData.personas
    .map((p) => `<option value="${p.name}"${p.name === cluster.persona ? " selected" : ""}>${p.name}</option>`)
    .join("");

  editClusterIntentSelect.value = cluster.intent;
  editClusterScoreInput.value = cluster.score;
  editClusterSummaryInput.value = cluster.summary;
  editClusterSubtopicsInput.value = cluster.subtopics.join(", ");

  editClusterModal.hidden = false;
}

function saveEditCluster(event) {
  event.preventDefault();
  if (!activeEditClusterKey) return;

  const oldIndex = dashboardData.clusters.findIndex((c) => clusterKey(c) === activeEditClusterKey);
  if (oldIndex < 0) return;

  const formData = new FormData(editClusterForm);
  dashboardData.clusters[oldIndex] = normalizeCluster({
    title: formData.get("title").toString().trim(),
    persona: editClusterPersonaSelect.value,
    intent: formData.get("intent").toString(),
    score: formData.get("score").toString().trim(),
    summary: formData.get("summary").toString().trim(),
    subtopics: splitList(formData.get("subtopics").toString())
  });

  saveState();
  renderAll();
  editClusterModal.hidden = false;
  editClusterModal.hidden = true;
  activeEditClusterKey = null;
  setAiStatus("Cluster updated", "success");
  showSection("clusters");
}

function openBriefFromCluster(key) {
  const cluster = dashboardData.clusters.find((c) => clusterKey(c) === key);
  if (!cluster) return;

  // Set filters to match cluster
  selectedFilters.persona = cluster.persona;
  selectedFilters.stage = cluster.intent;
  activeAiTaskId = "content-brief";

  renderAll();
  buildPrompt();
  showSection("ai");
  setAiStatus(`Brief prompt ready for: ${cluster.title}`, "success");
}

function applyAiRun() {
  const artifact = latestAiRun?.appData;

  if (!artifact) {
    setAiStatus("No structured AI result to apply", "error");
    return;
  }

  const persona = getFocusedPersona();
  const stage = getFocusedStage();
  const applied = [];

  if (artifact.type === "strategy-plan") {
    if (artifact.cluster && upsertCluster(artifact.cluster, stage, persona)) {
      applied.push("cluster");
    }

    if (artifact.contentItem && upsertContentItem(artifact.contentItem, persona, stage)) {
      applied.push("content item");
    }
  }

  if (artifact.type === "cluster-gaps") {
    if (artifact.cluster && upsertCluster(artifact.cluster, stage, persona)) {
      applied.push("cluster");
    }
  }

  if (artifact.type === "content-brief") {
    if (artifact.contentItem) {
      const enrichedItem = {
        ...artifact.contentItem,
        briefContent: latestAiRun?.displayText || ""
      };
      if (upsertContentItem(enrichedItem, persona, stage)) {
        applied.push("content item");
      }
    }
  }

  if (artifact.type === "persona-depth") {
    if (artifact.persona && upsertPersona(artifact.persona, persona)) {
      applied.push("persona");
    }
  }

  if (!applied.length) {
    setAiStatus("Nothing new to apply", "error");
    return;
  }

  saveState();
  renderAll();
  setAiStatus(`Applied ${applied.join(" and ")} to dashboard`, "success");
}

function loadAiHistoryEntry(entryId) {
  const entry = (dashboardData.aiHistory || []).find((item) => item.id === entryId);

  if (!entry) {
    return;
  }

  latestAiRun = entry;
  activeAiTaskId = entry.taskId;
  renderHints();
  buildPrompt();
  promptOutput.value = getHistoryPrompt(entry);
  aiResponse.value = entry.displayText;
  syncTextPanels();
  updateApplyState();
  showSection("ai");
  setAiStatus(`Loaded ${entry.title}`, "success");
}

function setAiStatus(text, mode = "idle") {
  aiStatus.textContent = text;
  aiStatus.classList.remove("is-loading", "is-success", "is-error");

  if (mode === "loading") {
    aiStatus.classList.add("is-loading");
  }

  if (mode === "success") {
    aiStatus.classList.add("is-success");
  }

  if (mode === "error") {
    aiStatus.classList.add("is-error");
  }
}

function buildFilters() {
  const personaOptions = ["All personas", ...dashboardData.personas.map((persona) => persona.name)];
  const stageOptions = ["All stages", ...dashboardData.journey.map((item) => item.stage)];

  personaFilter.innerHTML = personaOptions
    .map((option) => `<option value="${option}">${option}</option>`)
    .join("");
  personaFilter.value = selectedFilters.persona;

  stageFilter.innerHTML = stageOptions
    .map((option) => `<option value="${option}">${option}</option>`)
    .join("");
  stageFilter.value = selectedFilters.stage;

  contentPersona.innerHTML = dashboardData.personas
    .map((persona) => `<option value="${persona.name}">${persona.name}</option>`)
    .join("");

  clusterPersona.innerHTML = dashboardData.personas
    .map((persona) => `<option value="${persona.name}">${persona.name}</option>`)
    .join("");

  const defaultClusterPersona = selectedFilters.persona !== "All personas"
    ? selectedFilters.persona
    : dashboardData.personas[0]?.name || "";

  if (defaultClusterPersona) {
    clusterPersona.value = defaultClusterPersona;
  }
}

function getSectionStatuses() {
  const pipelineItems = Object.values(dashboardData.pipeline).flat();
  const productionItems = ["Brief", "Draft", "Review"]
    .flatMap((status) => dashboardData.pipeline[status] || []);
  const weakestCluster = getLargestGapCluster();
  const weakestScore = weakestCluster ? parseCoverageScore(weakestCluster.score) : 0;

  return {
    personas:
      dashboardData.personas.length === 0
        ? { label: "Start", tone: "alert" }
        : dashboardData.personas.length < 3
          ? { label: "Build", tone: "warn" }
          : { label: "Ready", tone: "ok" },
    journey:
      dashboardData.journey.length < 3
        ? { label: "Draft", tone: "warn" }
        : { label: "Ready", tone: "ok" },
    clusters:
      dashboardData.clusters.length === 0
        ? { label: "Start", tone: "alert" }
        : weakestScore < 60
          ? { label: "Weak gap", tone: "warn" }
          : { label: "Healthy", tone: "ok" },
    pipeline:
      productionItems.length === 0
        ? { label: "Idea-only", tone: "warn" }
        : { label: "Moving", tone: "ok" },
    calendar:
      dashboardData.calendar.length === 0
        ? { label: "Empty", tone: "alert" }
        : dashboardData.calendar.length < 3
          ? { label: "Light", tone: "warn" }
          : { label: "Scheduled", tone: "ok" },
    channels:
      dashboardData.channels.length === 0
        ? { label: "None", tone: "alert" }
        : dashboardData.channels.every((c) => !c.snapshots.length)
          ? { label: "No data", tone: "warn" }
          : { label: "Tracked", tone: "ok" },
    ai:
      dashboardData.personas.length === 0
        ? { label: "Blocked", tone: "alert" }
        : dashboardData.clusters.length === 0
          ? { label: "Prime", tone: "warn" }
          : { label: "Ready", tone: "ok" },
    learn: { label: "Guide", tone: "neutral" }
  };
}

function renderSectionStatuses() {
  const statuses = getSectionStatuses();

  navStatusTargets.forEach((target) => {
    const status = statuses[target.dataset.statusFor];

    if (!status) {
      target.textContent = "";
      target.dataset.tone = "neutral";
      return;
    }

    target.textContent = status.label;
    target.dataset.tone = status.tone;
  });
}

function isPersonaMatch(personaName) {
  return selectedFilters.persona === "All personas" || selectedFilters.persona === personaName;
}

function isStageMatch(stageName) {
  return selectedFilters.stage === "All stages" || selectedFilters.stage === stageName;
}

function renderOverview() {
  const allPipelineItems = Object.values(dashboardData.pipeline).flat();
  const filteredItems = allPipelineItems.filter(
    (item) => isPersonaMatch(item.persona) && isStageMatch(item.stage)
  );
  const focusedPersona = getFocusedPersona();
  const focusedStage = getFocusedStage();
  const weakestCluster = getLargestGapCluster() || getFocusedCluster(focusedStage);

  const metrics = [
    {
      label: "Active personas",
      value: dashboardData.personas.filter((persona) => isPersonaMatch(persona.name)).length,
      detail: "Audience segments currently in strategic focus."
    },
    {
      label: "Content items in flow",
      value: filteredItems.length,
      detail: "Ideas and assets that match the selected filters."
    },
    {
      label: "Topic clusters",
      value: getFilteredClusters().length,
      detail: "Clusters tied to the current persona and buyer intent filters."
    },
    {
      label: "Publishing this month",
      value: dashboardData.calendar.length,
      detail: "Planned releases across blog, newsletter, and social."
    }
  ];

  overviewMetrics.innerHTML = metrics
    .map(
      (metric) => `
        <article class="metric-card">
          <p class="metric-label">${metric.label}</p>
          <strong class="metric-value">${metric.value}</strong>
          <p class="metric-detail">${metric.detail}</p>
        </article>
      `
    )
    .join("");

  const steps = [
    {
      index: "01",
      title: "Calibrate the audience",
      detail: `Priority persona right now: ${focusedPersona}. Tighten the pains and goals before planning more assets.`,
      action: "Open Personas",
      section: "personas"
    },
    {
      index: "02",
      title: "Close the weakest topic gap",
      detail: weakestCluster
        ? `Weakest cluster: ${weakestCluster.title}. Use ${focusedStage.toLowerCase()} intent as your working stage.`
        : "Create the first strategic cluster so ideas have a clear home.",
      action: "Open Clusters",
      section: "clusters"
    },
    {
      index: "03",
      title: "Generate the next move",
      detail: `Once the audience and stage are clear, use AI Studio to draft the next ${focusedStage.toLowerCase()} action.`,
      action: "Open AI Studio",
      section: "ai"
    }
  ];

  workflowGuide.innerHTML = steps
    .map(
      (step) => `
        <article class="launchpad-card">
          <div class="launchpad-step">${step.index}</div>
          <div class="launchpad-content">
            <h4 class="launchpad-title">${step.title}</h4>
            <p class="launchpad-copy">${step.detail}</p>
          </div>
          <button class="ghost-button launchpad-button" type="button" data-jump-section="${step.section}">
            ${step.action}
          </button>
        </article>
      `
    )
    .join("");
}

function renderPersonas() {
  const personas = dashboardData.personas.filter((persona) => isPersonaMatch(persona.name));

  personaGrid.innerHTML = personas.length
    ? personas
        .map(
          (persona) => `
            <article class="persona-card">
              <div class="card-head card-head-split">
                <div>
                  <p class="card-label eyebrow">Persona</p>
                  <h4 class="persona-name">${persona.name}</h4>
                </div>
                <div class="card-actions-pair">
                  <button class="ghost-button card-action" type="button" data-edit-persona="${persona.id}">
                    Edit
                  </button>
                  <button class="ghost-button card-action" type="button" data-delete-persona="${persona.id}">
                    Delete
                  </button>
                </div>
              </div>
              <p class="persona-meta">${persona.role}</p>
              <div class="tag-row">
                ${persona.pains.map((pain) => `<span class="tag">Pain: ${pain}</span>`).join("")}
              </div>
              <div class="tag-row">
                ${persona.goals.map((goal) => `<span class="tag">Goal: ${goal}</span>`).join("")}
              </div>
              <div class="tag-row">
                ${persona.channels.map((channel) => `<span class="tag">${channel}</span>`).join("")}
              </div>
            </article>
          `
        )
        .join("")
    : '<div class="empty-state">No persona matches this filter yet. Clear the filter or add a new audience profile.</div>';
}

function renderJourney() {
  const stages = dashboardData.journey.filter((item) => isStageMatch(item.stage));
  const stageColors = {
    Awareness: "var(--awareness)",
    Consideration: "var(--consideration)",
    Decision: "var(--decision)"
  };

  journeyGrid.innerHTML = stages
    .map(
      (item) => `
        <article class="journey-card" style="--stage-color: ${stageColors[item.stage]};">
          <span class="stage-pill" data-stage="${item.stage}">${item.stage}</span>
          <h4 class="journey-title">${item.stage}</h4>
          <p class="journey-copy">${item.description}</p>
          <ul>
            ${item.focus.map((entry) => `<li>${entry}</li>`).join("")}
          </ul>
          <p class="journey-copy"><strong>Prompt cue:</strong> ${item.promptHint}</p>
        </article>
      `
    )
    .join("");
}

function renderClusters() {
  const visiblePersonas = dashboardData.personas.filter((persona) => isPersonaMatch(persona.name));
  const visibleStages = dashboardData.journey.filter((item) => isStageMatch(item.stage));
  const clusters = getFilteredClusters();

  clusterGrid.innerHTML = clusters.length
    ? visiblePersonas
        .map((persona) => {
          const personaClusters = getFilteredClusters(persona.name, selectedFilters.stage);

          if (!personaClusters.length && selectedFilters.persona === "All personas") {
            return "";
          }

          return `
            <article class="cluster-persona-board">
              <div class="cluster-persona-head">
                <div>
                  <p class="card-label eyebrow">Persona</p>
                  <h4 class="persona-name">${persona.name}</h4>
                </div>
              </div>
              <div class="cluster-stage-grid">
                ${visibleStages
                  .map((stage) => {
                    const stageClusters = getFilteredClusters(persona.name, stage.stage);

                    return `
                      <section class="cluster-stage-column">
                        <div class="cluster-stage-head">
                          <span class="stage-pill" data-stage="${stage.stage}">${stage.stage}</span>
                          <span class="pipeline-count">${stageClusters.length}</span>
                        </div>
                        <div class="cluster-stage-stack">
                          ${stageClusters.length
                            ? stageClusters
                                .map(
                                  (cluster) => {
                                    const key = clusterKey(cluster);
                                    return `
                                    <article class="cluster-card">
                                      <div class="cluster-head">
                                        <div>
                                          <h4 class="cluster-title">${cluster.title}</h4>
                                          <p class="topic-copy">${cluster.summary}</p>
                                        </div>
                                        <div class="cluster-score">
                                          <span class="card-label">coverage</span>
                                          <strong>${cluster.score}</strong>
                                        </div>
                                      </div>
                                      <ul>
                                        ${cluster.subtopics.map((topic) => `<li>${topic}</li>`).join("")}
                                      </ul>
                                      <div class="cluster-card-actions">
                                        <button class="ghost-button-sm" type="button" data-brief-cluster="${key}">Draft brief</button>
                                        <button class="ghost-button-sm" type="button" data-edit-cluster="${key}">Edit</button>
                                        <button class="ghost-button-sm ghost-button-sm-danger" type="button" data-delete-cluster="${key}">Delete</button>
                                      </div>
                                    </article>
                                  `;
                                  }
                                )
                                .join("")
                            : '<div class="empty-state empty-state-compact">No cluster for this persona-stage yet.</div>'}
                        </div>
                      </section>
                    `;
                  })
                  .join("")}
              </div>
            </article>
          `;
        })
        .filter(Boolean)
        .join("")
    : '<div class="empty-state">No topic clusters yet for this persona-stage view. Generate them from AI Studio or add one manually.</div>';
}

function renderPipeline() {
  const hasAnyPipelineItem = Object.values(dashboardData.pipeline).some((lane) => lane.length);
  const columns = Object.entries(dashboardData.pipeline)
    .map(([status, items]) => {
      const filtered = items.filter((item) => isPersonaMatch(item.persona) && isStageMatch(item.stage));
      const nextStatus = getNextStatus(status);
      const emptyMessage = hasAnyPipelineItem
        ? "Nothing in this lane."
        : "No content in production yet. Generate clusters and briefs in AI Studio, or add the first item manually.";

      return `
        <div class="pipeline-column">
          <div class="pipeline-header">
            <strong>${status}</strong>
            <span class="pipeline-count">${filtered.length}</span>
          </div>
          ${filtered.length
            ? filtered
                .map(
                  (item) => `
                    <article class="pipeline-card">
                      <div>
                        <div class="pipeline-card-top">
                          <span class="stage-pill" data-stage="${item.stage}">${item.stage}</span>
                          ${item.format ? `<span class="format-tag">${item.format}</span>` : ""}
                          ${item.briefContent ? `<span class="brief-filled-dot" title="Has content">●</span>` : ""}
                        </div>
                        <h4 class="pipeline-title">${item.title}</h4>
                        <p class="pipeline-copy">${item.persona}${item.channel ? ` · ${item.channel}` : ""}</p>
                        ${item.publishDate ? `<p class="pipeline-date">${item.publishDate}</p>` : ""}
                      </div>
                      <div class="pipeline-card-actions">
                        <button class="ghost-button-sm" type="button" data-open-brief="${item.id}">Open</button>
                        ${nextStatus ? `<button class="ghost-button-sm" type="button" data-advance-item="${item.id}">→ ${nextStatus}</button>` : ""}
                        <button class="ghost-button-sm ghost-button-sm-danger" type="button" data-delete-item="${item.id}">Delete</button>
                      </div>
                    </article>
                  `
                )
                .join("")
            : `<div class="empty-state">${emptyMessage}</div>`}
        </div>
      `;
    })
    .join("");

  pipelineBoard.innerHTML = columns;
}

function renderCalendar() {
  const sorted = [...dashboardData.calendar].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });

  calendarList.innerHTML = sorted.length
    ? sorted
        .map(
          (item) => `
            <article class="calendar-item">
              <div class="calendar-date">${item.date || "TBD"}</div>
              <div>
                <h4 class="calendar-title">${item.title}</h4>
                <p class="calendar-meta">${item.channel}</p>
                <p class="calendar-meta">${item.note}</p>
              </div>
              <button class="ghost-button-sm" type="button" data-remove-calendar="${item.id}">Remove</button>
            </article>
          `
        )
        .join("")
    : '<div class="empty-state">No publishing calendar yet. Add entries below, or use "Schedule for publishing" from a pipeline brief.</div>';

  const awarenessCount = Object.values(dashboardData.pipeline)
    .flat()
    .filter((item) => item.stage === "Awareness").length;
  const considerationCount = Object.values(dashboardData.pipeline)
    .flat()
    .filter((item) => item.stage === "Consideration").length;
  const decisionCount = Object.values(dashboardData.pipeline)
    .flat()
    .filter((item) => item.stage === "Decision").length;

  const coverageSignals = [
    `Awareness assets in flow: ${awarenessCount}.`,
    `Consideration assets in flow: ${considerationCount}.`,
    `Decision assets in flow: ${decisionCount}.`,
    `Tracked personas: ${dashboardData.personas.length}. Keep each cluster tied to at least one audience segment.`
  ];

  coverageList.innerHTML = coverageSignals.map((signal) => `<li>${signal}</li>`).join("");
}

function buildStrategySnapshot() {
  const filteredPipeline = Object.fromEntries(
    Object.entries(dashboardData.pipeline).map(([status, items]) => [
      status,
      items.filter((item) => isPersonaMatch(item.persona) && isStageMatch(item.stage))
    ])
  );

  return {
    filters: { ...selectedFilters },
    personas: dashboardData.personas.filter((persona) => isPersonaMatch(persona.name)),
    journey: dashboardData.journey.filter((item) => isStageMatch(item.stage)),
    clusters: getFilteredClusters(),
    pipeline: filteredPipeline,
    calendar: dashboardData.calendar
  };
}

function buildPrompt() {
  const task = getActiveAiTask();
  const persona = getFocusedPersona();
  const stage = getFocusedStage();
  const cluster = getFocusedCluster(stage, persona);
  const hasCluster = Boolean(cluster);
  const clusterTitle = cluster?.title || `the first ${stage.toLowerCase()} cluster for ${persona}`;
  const clusterSummary = cluster?.summary || "No saved cluster exists yet. Generate one from persona pains, goals, and channel behavior.";
  let promptLines = [];

  if (!task || task.id === "strategy-plan") {
    promptLines = [
      "You are a senior content strategist working for Art Flaneur.",
      "Develop the inbound content plan in English.",
      `Focus on persona: ${persona}.`,
      `Focus on stage: ${stage}.`,
      hasCluster
        ? `Use this priority cluster as context: ${clusterTitle}.`
        : "There are no saved clusters yet, so generate the first strategic cluster from the persona details in the dashboard.",
      "Return:",
      "1. Persona insight summary with pains, desired outcomes, and objections.",
      "2. One core topic cluster and six supporting subtopics.",
      "3. Three article ideas ranked by inbound impact.",
      "4. One content brief with title, promise, outline, CTA, and distribution notes.",
      "5. A short explanation of why this supports the inbound methodology.",
      "At the end, return one compact JSON object wrapped in <app-data></app-data> with no markdown fence.",
      `Use this exact shape: {"type":"strategy-plan","cluster":{"title":"${clusterTitle}","persona":"${persona}","summary":"...","intent":"${stage}","subtopics":["..."],"score":"AI draft"},"contentItem":{"title":"...","persona":"${persona}","stage":"${stage}","status":"Brief"}}`
    ];
    weeklyFocus.textContent = `Develop ${stage.toLowerCase()} opportunities for ${persona}.`;
    runAiButton.textContent = "Run strategic plan";
  }

  if (task?.id === "persona-depth") {
    promptLines = [
      "You are a senior inbound content strategist working for Art Flaneur.",
      "Expand one audience persona in English so it becomes usable for content planning.",
      `Focus on persona: ${persona}.`,
      `Reflect the current buying stage context: ${stage}.`,
      "Return:",
      "1. A concise persona summary in 3 sentences.",
      "2. Five pains or anxieties in plain language.",
      "3. Five desired outcomes.",
      "4. Five objections that block action.",
      "5. Four trusted channels, sources, or formats.",
      "6. Three messaging hooks Art Flaneur can use in content.",
      "7. Three content angles, one per buyer's journey stage.",
      "At the end, return one compact JSON object wrapped in <app-data></app-data> with no markdown fence.",
      `Use this exact shape: {"type":"persona-depth","persona":{"name":"${persona}","role":"...","pains":["..."],"goals":["..."],"channels":["..."]}}`
    ];
    weeklyFocus.textContent = `Sharpen the voice, objections, and message angles for ${persona}.`;
    runAiButton.textContent = "Run persona expansion";
  }

  if (task?.id === "cluster-gaps") {
    promptLines = [
      "You are a senior inbound content strategist working for Art Flaneur.",
      "Find topic cluster gaps and propose a stronger inbound structure in English.",
      `Focus on persona: ${persona}.`,
      `Focus on stage: ${stage}.`,
      hasCluster
        ? `Current weakest cluster: ${clusterTitle}.`
        : `No saved cluster exists yet. Propose the first core cluster for ${persona} at the ${stage} stage.`,
      `Cluster summary: ${clusterSummary}`,
      "Return:",
      "1. A short diagnosis of the current gap.",
      "2. One improved core cluster with a clear promise.",
      "3. Eight supporting subtopics with clear angles.",
      "4. Two conversion assets or lead magnets.",
      "5. Internal linking notes showing how awareness, consideration, and decision content should connect.",
      "At the end, return one compact JSON object wrapped in <app-data></app-data> with no markdown fence.",
      `Use this exact shape: {"type":"cluster-gaps","cluster":{"title":"${clusterTitle}","persona":"${persona}","summary":"...","intent":"${stage}","subtopics":["..."],"score":"AI draft"}}`
    ];
    weeklyFocus.textContent = `Close the topic gap around ${clusterTitle} for ${stage.toLowerCase()} intent.`;
    runAiButton.textContent = "Run cluster analysis";
  }

  if (task?.id === "content-brief") {
    promptLines = [
      "You are a senior inbound content strategist working for Art Flaneur.",
      "Create one publication-ready English content brief.",
      `Target persona: ${persona}.`,
      `Target stage: ${stage}.`,
      `Primary cluster: ${clusterTitle}.`,
      `Cluster summary: ${clusterSummary}`,
      "Return:",
      "1. Working title.",
      "2. Audience and search intent.",
      "3. Core promise.",
      "4. A detailed outline with 5 to 7 sections.",
      "5. CTA and conversion goal.",
      "6. Distribution plan across blog, newsletter, and one social surface.",
      "7. Suggested sources, interviews, or proof points to include.",
      "At the end, return one compact JSON object wrapped in <app-data></app-data> with no markdown fence.",
      `Use this exact shape: {"type":"content-brief","contentItem":{"title":"...","persona":"${persona}","stage":"${stage}","status":"Brief"}}`
    ];
    weeklyFocus.textContent = `Draft the next ${stage.toLowerCase()} brief around ${clusterTitle}.`;
    runAiButton.textContent = "Run content brief";
  }

  if (task?.id === "full-draft") {
    const existingBriefContent = Object.values(dashboardData.pipeline)
      .flat()
      .find((item) => isPersonaMatch(item.persona) && isStageMatch(item.stage) && item.briefContent)
      ?.briefContent || null;

    promptLines = [
      "You are a senior content writer working for Art Flaneur.",
      "Write a complete, publication-ready draft in English.",
      `Target persona: ${persona}.`,
      `Target stage: ${stage}.`,
      `Primary cluster: ${clusterTitle}.`,
      `Cluster summary: ${clusterSummary}`,
      existingBriefContent
        ? `Brief to expand into full prose:\n${existingBriefContent.slice(0, 1400)}`
        : "No saved brief yet. Build the draft directly from the cluster summary and persona context.",
      "Requirements:",
      "1. Write in complete, flowing prose — no bullet points or outlines.",
      "2. Open with a hook that addresses the persona's core pain or question.",
      "3. Include 4 to 6 substantive sections with clear subheadings.",
      "4. End with a strong CTA aligned to the buyer's journey stage.",
      "5. Keep length appropriate: 900–1200 words for articles, 200–280 for short social formats.",
      "At the end, return one compact JSON object wrapped in <app-data></app-data> with no markdown fence.",
      `Use this exact shape: {"type":"content-brief","contentItem":{"title":"...","persona":"${persona}","stage":"${stage}","status":"Draft"}}`
    ].filter(Boolean);

    weeklyFocus.textContent = `Write the full ${stage.toLowerCase()} draft for ${persona}.`;
    runAiButton.textContent = "Run full draft";
  }

  promptOutput.value = promptLines.join("\n");
  syncTextPanels();
}

function renderAiHistory() {
  const history = dashboardData.aiHistory || [];

  aiHistoryList.innerHTML = history.length
    ? history
        .map(
          (entry) => `
            <article class="history-item">
              <div>
                <p class="history-meta">${entry.taskTitle} · ${formatHistoryTime(entry.createdAt)}</p>
                <h4 class="history-title">${entry.title}</h4>
              </div>
              <button class="ghost-button history-button" type="button" data-history-id="${entry.id}">Load</button>
            </article>
          `
        )
        .join("")
    : '<div class="empty-state">No AI runs saved yet.</div>';
}

function renderHints() {
  learningGrid.innerHTML = dashboardData.hints
    .map(
      (hint) => `
        <article class="hint-card">
          <p class="card-label eyebrow">Hint</p>
          <h4 class="hint-title">${hint.title}</h4>
          <p class="hint-copy">${hint.body}</p>
        </article>
      `
    )
    .join("");

  aiTaskList.innerHTML = dashboardData.aiTasks
    .map(
      (task) => `
        <article class="stack-item ${task.id === activeAiTaskId ? "is-active" : ""}">
          <button class="stack-action" type="button" data-ai-task="${task.id}" aria-pressed="${task.id === activeAiTaskId}">
            <span class="card-label eyebrow">AI action</span>
            <span class="stack-title">${task.title}</span>
            <span class="stack-copy">${task.body}</span>
          </button>
        </article>
      `
    )
    .join("");
}

function renderAll() {
  buildFilters();
  renderSectionStatuses();
  renderOverview();
  renderPersonas();
  renderJourney();
  renderClusters();
  renderPipeline();
  renderCalendar();
  renderChannels();
  renderHints();
  renderAiHistory();
  buildPrompt();
  updateApplyState();
}

function showSection(sectionId) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.section === sectionId);
  });

  sections.forEach((section) => {
    const shouldShow = section.id === sectionId || section.id === "overview";
    if (section.id === "overview") {
      section.classList.add("is-visible");
      return;
    }

    section.classList.toggle("is-visible", shouldShow);
  });

  document.querySelector(`#${sectionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (sectionId === "ai") {
    window.requestAnimationFrame(() => {
      syncTextPanels();
      window.setTimeout(syncTextPanels, 120);
    });
  }
}

function addPersona(event) {
  event.preventDefault();
  const formData = new FormData(personaForm);
  const name = formData.get("name").toString().trim();

   if (dashboardData.personas.some((persona) => normalizeLabel(persona.name) === normalizeLabel(name))) {
    setAiStatus(`Persona ${name} already exists`, "error");
    return;
  }

  dashboardData.personas.unshift({
    id: slugify(name),
    name,
    role: formData.get("role").toString().trim(),
    pains: splitList(formData.get("pains").toString()),
    goals: splitList(formData.get("goals").toString()),
    channels: splitList(formData.get("channels").toString())
  });

  saveState();
  renderAll();
  personaForm.reset();
  showSection("personas");
}

function deletePersona(personaId) {
  const persona = dashboardData.personas.find((item) => item.id === personaId);

  if (!persona) {
    return;
  }

  dashboardData.personas = dashboardData.personas.filter((item) => item.id !== personaId);

  if (selectedFilters.persona === persona.name) {
    selectedFilters.persona = "All personas";
  }

  saveState();
  renderAll();
  showSection("personas");
}

function addCluster(event) {
  event.preventDefault();
  const formData = new FormData(clusterForm);

  dashboardData.clusters.unshift(normalizeCluster({
    title: formData.get("title").toString().trim(),
    persona: formData.get("persona").toString(),
    score: formData.get("score").toString().trim(),
    intent: formData.get("intent").toString(),
    summary: formData.get("summary").toString().trim(),
    subtopics: splitList(formData.get("subtopics").toString())
  }));

  saveState();
  renderAll();
  clusterForm.reset();
  showSection("clusters");
}

function addContentItem(event) {
  event.preventDefault();
  const formData = new FormData(contentForm);
  const status = formData.get("status").toString();

  dashboardData.pipeline[status].unshift(normalizePipelineItem({
    title: formData.get("title").toString().trim(),
    persona: formData.get("persona").toString(),
    stage: formData.get("stage").toString(),
    format: formData.get("format")?.toString() || "",
    channel: formData.get("channel")?.toString() || ""
  }));

  saveState();
  renderAll();
  contentForm.reset();
  showSection("pipeline");
}

async function runAiPlan() {
  const task = getActiveAiTask();
  const basePrompt = promptOutput.value;
  latestAiRun = null;
  runAiButton.disabled = true;
  setAiStatus("Generating", "loading");
  aiResponse.value = "";
  syncTextPanels();
  updateApplyState();

  const requestPrompt = [
    basePrompt,
    "",
    "Current dashboard strategy snapshot:",
    JSON.stringify(buildStrategySnapshot(), null, 2)
  ].join("\n");

  try {
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: requestPrompt })
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Model request failed.");
    }

    const parsed = extractAppData(payload.text || "");
    aiResponse.value = parsed.displayText || payload.text || "No text returned.";
    syncTextPanels();
    latestAiRun = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      taskId: task?.id || "strategy-plan",
      taskTitle: task?.title || "Task",
      title: `${task?.title || "Task"} result`,
      prompt: basePrompt,
      requestPrompt,
      rawText: payload.text || "",
      displayText: aiResponse.value,
      providerMode: payload.providerMode,
      appData: parsed.appData,
      createdAt: new Date().toISOString()
    };
    saveAiHistoryEntry(latestAiRun);
    renderAiHistory();
    updateApplyState();
    setAiStatus(`${task?.title || "Task"} via ${payload.providerMode}`, "success");
  } catch (error) {
    aiResponse.value = error.message.includes("Failed to fetch")
      ? "The dashboard is not being served through the local proxy yet. Start the Node server and open http://127.0.0.1:3000."
      : error.message;
    syncTextPanels();
    updateApplyState();
    setAiStatus("Request failed", "error");
  } finally {
    runAiButton.disabled = false;
  }
}

personaFilter.addEventListener("change", (event) => {
  selectedFilters.persona = event.target.value;
  renderAll();
});

stageFilter.addEventListener("change", (event) => {
  selectedFilters.stage = event.target.value;
  renderAll();
});

aiQuickAction.addEventListener("click", () => {
  activeAiTaskId = "strategy-plan";
  buildPrompt();
  showSection("ai");
  setAiStatus("Strategic plan ready");
});

document.querySelector("#refreshPrompt").addEventListener("click", () => {
  buildPrompt();
  setAiStatus(`${getActiveAiTask()?.title || "Prompt"} refreshed`);
});

aiTaskList.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-ai-task]");

  if (!trigger) {
    return;
  }

  activeAiTaskId = trigger.dataset.aiTask;
  buildPrompt();
  renderHints();
  showSection("ai");
  setAiStatus(`${getActiveAiTask()?.title || "Prompt"} ready`);
});

workflowGuide.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-jump-section]");

  if (!trigger) {
    return;
  }

  showSection(trigger.dataset.jumpSection);
});

aiHistoryList.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-history-id]");

  if (!trigger) {
    return;
  }

  loadAiHistoryEntry(trigger.dataset.historyId);
});

personaGrid.addEventListener("click", (event) => {
  const editTrigger = event.target.closest("[data-edit-persona]");
  if (editTrigger) {
    openEditPersona(editTrigger.dataset.editPersona);
    return;
  }

  const deleteTrigger = event.target.closest("[data-delete-persona]");
  if (deleteTrigger) {
    deletePersona(deleteTrigger.dataset.deletePersona);
  }
});

copyPromptButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(promptOutput.value);
    copyPromptButton.textContent = "Copied";
    window.setTimeout(() => {
      copyPromptButton.textContent = "Copy prompt";
    }, 1400);
  } catch {
    copyPromptButton.textContent = "Clipboard unavailable";
    window.setTimeout(() => {
      copyPromptButton.textContent = "Copy prompt";
    }, 1800);
  }
});

runAiButton.addEventListener("click", runAiPlan);
applyAiButton.addEventListener("click", applyAiRun);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    showSection(link.dataset.section);
  });
});

personaForm.addEventListener("submit", addPersona);
clusterForm.addEventListener("submit", addCluster);
contentForm.addEventListener("submit", addContentItem);
calendarForm.addEventListener("submit", addCalendarEntry);
channelForm.addEventListener("submit", addChannel);
editClusterForm.addEventListener("submit", saveEditCluster);

clusterGrid.addEventListener("click", (event) => {
  const briefTrigger = event.target.closest("[data-brief-cluster]");
  if (briefTrigger) {
    openBriefFromCluster(briefTrigger.dataset.briefCluster);
    return;
  }

  const editTrigger = event.target.closest("[data-edit-cluster]");
  if (editTrigger) {
    openEditCluster(editTrigger.dataset.editCluster);
    return;
  }

  const deleteTrigger = event.target.closest("[data-delete-cluster]");
  if (deleteTrigger) {
    deleteCluster(deleteTrigger.dataset.deleteCluster);
  }
});

closeEditClusterModalButton.addEventListener("click", () => {
  editClusterModal.hidden = true;
  activeEditClusterKey = null;
});
editClusterModal.addEventListener("click", (event) => {
  if (event.target === editClusterModal) {
    editClusterModal.hidden = true;
    activeEditClusterKey = null;
  }
});

pipelineBoard.addEventListener("click", (event) => {
  const openTrigger = event.target.closest("[data-open-brief]");
  if (openTrigger) {
    openBriefEditor(openTrigger.dataset.openBrief);
    return;
  }

  const advanceTrigger = event.target.closest("[data-advance-item]");
  if (advanceTrigger) {
    const found = findContentItemById(advanceTrigger.dataset.advanceItem);
    if (!found) return;
    const nextStatus = getNextStatus(found.status);
    if (!nextStatus) return;
    moveItemToStage(advanceTrigger.dataset.advanceItem, nextStatus);
    saveState();
    renderAll();
    setAiStatus(`Moved to ${nextStatus}`, "success");
    return;
  }

  const deleteTrigger = event.target.closest("[data-delete-item]");
  if (deleteTrigger) {
    deleteContentItem(deleteTrigger.dataset.deleteItem);
  }
});

calendarList.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-remove-calendar]");
  if (trigger) {
    removeCalendarEntry(trigger.dataset.removeCalendar);
  }
});

channelGrid.addEventListener("click", (event) => {
  const logTrigger = event.target.closest("[data-log-channel]");
  if (logTrigger) {
    const id = logTrigger.dataset.logChannel;
    const input = document.getElementById(`count-input-${id}`);
    const count = parseInt(input?.value, 10);
    if (!isNaN(count) && count >= 0) {
      logChannelCount(id, count);
      if (input) input.value = "";
    }
    return;
  }

  const fetchTrigger = event.target.closest("[data-fetch-youtube]");
  if (fetchTrigger) {
    fetchYouTubeStats(fetchTrigger.dataset.fetchYoutube);
    return;
  }

  const deleteTrigger = event.target.closest("[data-delete-channel]");
  if (deleteTrigger) {
    deleteChannel(deleteTrigger.dataset.deleteChannel);
  }
});

closeBriefModalButton.addEventListener("click", closeBriefEditor);
briefModal.addEventListener("click", (event) => {
  if (event.target === briefModal) closeBriefEditor();
});
saveBriefButton.addEventListener("click", saveBriefFromModal);
advanceBriefButton.addEventListener("click", advanceFromBriefModal);
scheduleBriefButton.addEventListener("click", scheduleFromBriefModal);
deleteBriefButton.addEventListener("click", deleteFromBriefModal);

closeEditPersonaModalButton.addEventListener("click", () => {
  editPersonaModal.hidden = true;
  activeEditPersonaId = null;
});
editPersonaModal.addEventListener("click", (event) => {
  if (event.target === editPersonaModal) {
    editPersonaModal.hidden = true;
    activeEditPersonaId = null;
  }
});
editPersonaForm.addEventListener("submit", saveEditPersona);

window.addEventListener("resize", syncTextPanels);

renderAll();
initServerSync();
setAiStatus("Ready");