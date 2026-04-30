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

const STAGE_MODEL = {
  Awareness: {
    motion: "Attract",
    badge: "Awareness / Attract",
    description: "Audience is naming a problem or curiosity and needs a clear reason to pay attention.",
    focus: ["Problem framing", "Educational explainers", "Trust-building context"],
    marketerNote: "Use this stage to attract the right audience around a real problem before asking for action.",
    promptHint: "What would attract attention by clarifying the problem, stakes, or opportunity?",
    guidance: "educational, wide-reach — surface the problem, inform, build trust. Avoid sales language."
  },
  Consideration: {
    motion: "Engage",
    badge: "Consideration / Engage",
    description: "Audience is comparing approaches, structures, or partners and needs help evaluating options.",
    focus: ["Frameworks", "Comparisons", "Evaluation tools"],
    marketerNote: "Use this stage to engage serious prospects with sharper comparisons and clearer strategic tradeoffs.",
    promptHint: "What helps them compare approaches with confidence and stay engaged with the topic?",
    guidance: "comparison or framework — help the audience evaluate options and build confidence."
  },
  Decision: {
    motion: "Delight",
    badge: "Decision / Delight",
    description: "Audience is close to action and needs low-friction proof, clarity, and a confident next step.",
    focus: ["Proof", "Implementation clarity", "Next-step offers"],
    marketerNote: "Use this stage to delight the buyer with clarity, low friction, and a confident path forward.",
    promptHint: "What would remove friction now and make the next step feel clear, useful, and trustworthy?",
    guidance: "action-oriented — remove friction, speak directly to the decision, include a clear next step."
  }
};

// Maps each distribution channel to the content formats that work best on it
// Canonical channel keys — AI must use these exact strings when writing persona channels
const CHANNEL_FORMAT_MAP = {
  "Instagram":         ["Instagram carousel (10 slides)", "Instagram caption + visual hook", "Instagram Reel script (45–60 sec)"],
  "LinkedIn":          ["LinkedIn long-form article (800–1200 words)", "LinkedIn thought-leadership post (300–500 words)"],
  "YouTube":           ["YouTube video script (8–15 min)", "YouTube Shorts script (60–90 sec)"],
  "email newsletter":  ["nurture email (250–400 words)", "3-part email sequence"],
  "website article":   ["long-form blog article (1000–1500 words)", "pillar page section (400–600 words)"],
  "PDF / slides":      ["downloadable guide or e-book (1500–3000 words)", "slide deck (10–15 slides)"]
};

// For each stage: the tone/intent guidance the AI should apply to every format
const STAGE_FORMAT_GUIDANCE = Object.fromEntries(
  Object.entries(STAGE_MODEL).map(([stage, meta]) => [stage, meta.guidance])
);

// Maps legacy/vague channel names to canonical keys — handles old data.json values
const CHANNEL_ALIAS_MAP = {
  "email outreach":         "email newsletter",
  "industry newsletters":   "email newsletter",
  "newsletter":             "email newsletter",
  "email":                  "email newsletter",
  "cultural conferences":   "PDF / slides",
  "partner referrals":      "PDF / slides",
  "art fairs":              "PDF / slides",
  "gallery networks":       "email newsletter",
  "travel blogs":           "website article",
  "app stores":             "website article",
  "city guides":            "website article",
  "TikTok":                 "Instagram",
  "website":                "website article",
  "blog":                   "website article",
  "pdf":                    "PDF / slides",
  "slides":                 "PDF / slides",
  "youtube":                "YouTube"
};

const CHANNEL_META = {
  Instagram: {
    label: "Instagram",
    url: "https://www.instagram.com/artflaneur.art/",
    color: "#e4405f",
    buttonLabel: "Open Instagram"
  },
  LinkedIn: {
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/flaneurart/",
    color: "#0a66c2",
    buttonLabel: "Open LinkedIn"
  },
  YouTube: {
    label: "YouTube",
    url: "https://www.youtube.com/@ArtFlaneur",
    color: "#ff0033",
    buttonLabel: "Open YouTube"
  },
  Facebook: {
    label: "Facebook",
    url: "https://www.facebook.com/artflaneur.com.au",
    color: "#1877f2",
    buttonLabel: "Open Facebook"
  },
  "email newsletter": {
    label: "Newsletter",
    url: "https://subscribe-forms.beehiiv.com/a9dc714a-eb34-4b33-95fb-685829e6c477",
    color: "#b7791f",
    buttonLabel: "Open Newsletter"
  },
  "website article": {
    label: "Website",
    url: "https://www.artflaneur.art/stories",
    color: "#102b25",
    buttonLabel: "Open Website"
  },
  "PDF / slides": {
    label: "Slides",
    url: "https://www.artflaneur.art/",
    color: "#c7653a",
    buttonLabel: "Open Site"
  },
  TikTok: {
    label: "TikTok",
    url: null,
    color: "#111111",
    buttonLabel: "Open TikTok"
  },
  "X / Twitter": {
    label: "X / Twitter",
    url: null,
    color: "#111111",
    buttonLabel: "Open X"
  }
};

const CHANNEL_META_ALIAS_MAP = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  facebook: "Facebook",
  tiktok: "TikTok",
  twitter: "X / Twitter",
  "x / twitter": "X / Twitter",
  newsletter: "email newsletter",
  "email newsletter": "email newsletter",
  email: "email newsletter",
  blog: "website article",
  website: "website article",
  "website article": "website article",
  "pdf / slides": "PDF / slides",
  pdf: "PDF / slides",
  slides: "PDF / slides"
};

// Normalise a raw channel list to canonical CHANNEL_FORMAT_MAP keys; fall back to all channels
function normaliseChannels(channels) {
  const canonical = Object.keys(CHANNEL_FORMAT_MAP);
  const mapped = [...new Set(
    channels.map((c) => CHANNEL_ALIAS_MAP[c] || c)
  )].filter((c) => CHANNEL_FORMAT_MAP[c]);
  // If nothing matched after normalisation, return ALL channels (safe fallback)
  return mapped.length ? mapped : canonical;
}

function getChannelMeta(channel) {
  const raw = String(channel || "").trim();
  if (!raw) return null;

  const normalized = CHANNEL_META_ALIAS_MAP[normalizeLabel(raw)] || CHANNEL_ALIAS_MAP[raw] || raw;
  const meta = CHANNEL_META[normalized];

  return meta
    ? { ...meta, key: normalized, raw }
    : null;
}

function renderChannelLogo(channel, className = "") {
  const meta = typeof channel === "string" ? getChannelMeta(channel) : channel;
  if (!meta) {
    return "";
  }

  let icon = "";

  switch (meta.key) {
    case "Instagram":
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"></circle></svg>`;
      break;
    case "LinkedIn":
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="4"></rect><path d="M8 10.5V16"></path><path d="M8 8.1h.01"></path><path d="M12 16v-3.2c0-1.6.9-2.5 2.2-2.5 1.4 0 2 .9 2 2.5V16"></path></svg>`;
      break;
    case "YouTube":
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6" width="19" height="12" rx="4"></rect><path d="M10 9.2 15 12l-5 2.8V9.2z" fill="currentColor" stroke="none"></path></svg>`;
      break;
    case "Facebook":
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="4"></rect><path d="M13.5 20V13h2.2l.3-2.5h-2.5V9.3c0-.8.3-1.4 1.4-1.4H16V6h-1.8c-2.1 0-3.2 1.2-3.2 3.3v1.2H9v2.5h2.2V20"></path></svg>`;
      break;
    case "email newsletter":
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"></rect><path d="M5.5 8l6.5 5 6.5-5"></path></svg>`;
      break;
    case "website article":
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"></circle><path d="M3.8 12h16.4"></path><path d="M12 3.5c2.4 2.2 3.9 5.3 3.9 8.5 0 3.2-1.5 6.3-3.9 8.5"></path><path d="M12 3.5c-2.4 2.2-3.9 5.3-3.9 8.5 0 3.2 1.5 6.3 3.9 8.5"></path></svg>`;
      break;
    case "PDF / slides":
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 5.5h12v9H6z"></path><path d="M9 18.5h6"></path><path d="M12 14.5v4"></path></svg>`;
      break;
    case "TikTok":
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v8.2a3.8 3.8 0 1 1-2.7-3.6"></path><path d="M14 4c.6 1.8 2 3 4 3.2"></path></svg>`;
      break;
    case "X / Twitter":
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5l14 14"></path><path d="M19 5 5 19"></path></svg>`;
      break;
    default:
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"></circle></svg>`;
  }

  return `<span class="channel-logo ${className}" style="--channel-color: ${escapeHtml(meta.color)};" aria-hidden="true">${icon}</span>`;
}

function renderChannelPill(channel, options = {}) {
  const meta = getChannelMeta(channel);
  const href = sanitizeUrl(Object.prototype.hasOwnProperty.call(options, "href") ? options.href : meta?.url);
  const label = escapeHtml(meta?.label || String(channel || "").trim());
  const className = ["channel-pill", options.className].filter(Boolean).join(" ");
  const icon = meta ? renderChannelLogo(meta) : "";
  const body = `${icon}${options.iconOnly ? "" : `<span class="channel-pill-text">${label}</span>`}`;

  if (href) {
    return `<a class="${className}" style="--channel-color: ${escapeHtml(meta?.color || "#102b25")};" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${body}</a>`;
  }

  return `<span class="${className}" style="--channel-color: ${escapeHtml(meta?.color || "#102b25")};">${body}</span>`;
}

function renderChannelActionLink(channel, className = "ghost-button-sm ghost-button-sm-social") {
  const meta = getChannelMeta(channel);
  const href = sanitizeUrl(meta?.url);
  if (!href) {
    return "";
  }

  return `<a class="${className}" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${renderChannelLogo(meta)}<span>${escapeHtml(meta.buttonLabel || `Open ${meta.label}`)}</span></a>`;
}

// Returns a multi-line string listing every channel and all its formats for a persona
function getPersonaFormatsText(channels) {
  return normaliseChannels(channels)
    .map((c) => `  - ${c}: ${CHANNEL_FORMAT_MAP[c].join(" | ")}`)
    .join("\n");
}

// Returns a flat list of all {channel, format} pairs for a persona (used for JSON shape building)
function getPersonaFormatPairs(channels) {
  return normaliseChannels(channels)
    .flatMap((c) => CHANNEL_FORMAT_MAP[c].map((f) => ({ channel: c, format: f })));
}

function formatPairKey(pair) {
  return `${pair.channel}::${pair.format}`;
}

function getStageMeta(stage) {
  return STAGE_MODEL[stage] || STAGE_MODEL.Awareness;
}

function getStageBadge(stage) {
  return getStageMeta(stage).badge;
}

function getStageMotion(stage) {
  return getStageMeta(stage).motion;
}

function normalizeProductFoundation(foundation) {
  const goldenCircle = foundation?.goldenCircle || {};

  return {
    description: String(foundation?.description || "").trim(),
    mission: String(foundation?.mission || "").trim(),
    valueProposition: String(foundation?.valueProposition || "").trim(),
    proofPoints: uniqueList(foundation?.proofPoints),
    goldenCircle: {
      why: String(goldenCircle.why || "").trim(),
      how: String(goldenCircle.how || "").trim(),
      what: String(goldenCircle.what || "").trim()
    }
  };
}

function getProductFoundationPromptLines() {
  const foundation = normalizeProductFoundation(dashboardData.productFoundation || initialData.productFoundation);
  const proofPoints = foundation.proofPoints.length ? foundation.proofPoints.join("; ") : "";

  return [
    "Art Flaneur product foundation:",
    foundation.description ? `- Product description: ${foundation.description}` : "",
    foundation.mission ? `- Mission: ${foundation.mission}` : "",
    foundation.valueProposition ? `- Value proposition: ${foundation.valueProposition}` : "",
    foundation.goldenCircle.why ? `- Golden Circle / Why: ${foundation.goldenCircle.why}` : "",
    foundation.goldenCircle.how ? `- Golden Circle / How: ${foundation.goldenCircle.how}` : "",
    foundation.goldenCircle.what ? `- Golden Circle / What: ${foundation.goldenCircle.what}` : "",
    proofPoints ? `- Proof points: ${proofPoints}` : ""
  ].filter(Boolean);
}

function isFormatScopedAiTask(taskId) {
  return taskId === "content-brief" || taskId === "full-draft";
}

function getAiTargetPersona() {
  return activeAiPersona || getFocusedPersona();
}

function getAiTargetStage() {
  return activeAiStage || getFocusedStage();
}

function getAiFormatContext(personaName = getAiTargetPersona(), taskId = activeAiTaskId) {
  const personaObj = dashboardData.personas.find((p) => p.name === personaName);
  const rawChannels = personaObj?.channels || [];
  const personaChannels = rawChannels.length ? normaliseChannels(rawChannels) : Object.keys(CHANNEL_FORMAT_MAP);
  const formatPairs = getPersonaFormatPairs(personaChannels);

  if (!isFormatScopedAiTask(taskId)) {
    activeAiFormatKey = null;
    return {
      personaChannels,
      channelList: personaChannels.join(", "),
      formatsText: getPersonaFormatsText(personaChannels),
      formatPairs,
      selectedFormatPair: null
    };
  }

  const hasSelectedPair = formatPairs.some((pair) => formatPairKey(pair) === activeAiFormatKey);
  if (!hasSelectedPair) {
    activeAiFormatKey = formatPairs[0] ? formatPairKey(formatPairs[0]) : null;
  }

  return {
    personaChannels,
    channelList: personaChannels.join(", "),
    formatsText: getPersonaFormatsText(personaChannels),
    formatPairs,
    selectedFormatPair: formatPairs.find((pair) => formatPairKey(pair) === activeAiFormatKey) || null
  };
}

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
      channels: ["LinkedIn", "email newsletter", "website article", "PDF / slides"]
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
      channels: ["Instagram", "LinkedIn", "email newsletter", "PDF / slides"]
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
      channels: ["Instagram", "YouTube", "website article"]
    }
  ],
  journey: [
    {
      stage: "Awareness",
      description: STAGE_MODEL.Awareness.description,
      focus: STAGE_MODEL.Awareness.focus,
      promptHint: STAGE_MODEL.Awareness.promptHint
    },
    {
      stage: "Consideration",
      description: STAGE_MODEL.Consideration.description,
      focus: STAGE_MODEL.Consideration.focus,
      promptHint: STAGE_MODEL.Consideration.promptHint
    },
    {
      stage: "Decision",
      description: STAGE_MODEL.Decision.description,
      focus: STAGE_MODEL.Decision.focus,
      promptHint: STAGE_MODEL.Decision.promptHint
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
  productFoundation: {
    description: "Art Flaneur is a cultural discovery and marketing platform that helps people find meaningful art experiences and helps galleries and festivals make those experiences easier to discover, navigate, and convert.",
    mission: "Make contemporary art easier to discover, navigate, and act on for audiences and cultural organizers.",
    valueProposition: "Art Flaneur connects cultural audiences with relevant art experiences while giving galleries and festivals clearer discoverability, visitor-flow, and growth tools.",
    proofPoints: [
      "city-level art discovery and route logic",
      "discoverability-focused content strategy",
      "support for galleries, biennales, and cultural tourists",
      "AI-assisted editorial planning and production"
    ],
    goldenCircle: {
      why: "Because art becomes more valuable when more people can confidently find, understand, and move through it.",
      how: "By combining curated discovery, route thinking, cultural context, and marketer-friendly content systems in one workflow.",
      what: "A platform and editorial operating layer for art discovery, audience growth, and cultural experience planning."
    }
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
      body: "A strong cluster is one core topic, and every supporting idea below it should stay nested as a subtopic inside that topic."
    },
    {
      title: "Match content to buyer intent",
      body: "Awareness attracts, Consideration engages, and Decision delights by making the next step feel clear and low-friction."
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
      id: "question-mining",
      title: "Mine persona questions",
      body: "Extract real AI-chatbot questions for one cluster and stage." 
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
const brandFoundationForm = document.querySelector("#brandFoundationForm");
const productDescriptionInput = document.querySelector("#productDescription");
const productMissionInput = document.querySelector("#productMission");
const productValuePropInput = document.querySelector("#productValueProp");
const goldenCircleWhyInput = document.querySelector("#goldenCircleWhy");
const goldenCircleHowInput = document.querySelector("#goldenCircleHow");
const goldenCircleWhatInput = document.querySelector("#goldenCircleWhat");
const productProofPointsInput = document.querySelector("#productProofPoints");
const personaGrid = document.querySelector("#personaGrid");
const journeyGrid = document.querySelector("#journeyGrid");
const clusterGrid = document.querySelector("#clusterGrid");
const pipelineBoard = document.querySelector("#pipelineBoard");
const calendarList = document.querySelector("#calendarList");
const coverageList = document.querySelector("#coverageList");
const learningGrid = document.querySelector("#learningGrid");
const aiTaskList = document.querySelector("#aiTaskList");
const aiFormatPanel = document.querySelector("#aiFormatPanel");
const aiFormatList = document.querySelector("#aiFormatList");
const aiFormatSelect = document.querySelector("#aiFormatSelect");
const aiFormatSep = document.querySelector("#aiFormatSep");
const promptOutput = document.querySelector("#promptOutput");
const aiContextTask = document.querySelector("#aiContextTask");
const aiResponse = document.querySelector("#aiResponse");
const aiStatus = document.querySelector("#aiStatus");
const runAiButton = document.querySelector("#runAi");
const applyAiButton = document.querySelector("#applyAi");
const applyAiNote = document.querySelector("#applyAiNote");

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
const briefFormatBadge = document.querySelector("#briefFormatBadge");
const briefPersonaSelect = document.querySelector("#briefPersona");
const briefStageSelect = document.querySelector("#briefStage");
const briefStatusSelect = document.querySelector("#briefStatus");
const briefFormat = document.querySelector("#briefFormat");
const briefChannel = document.querySelector("#briefChannel");
const briefPublishDate = document.querySelector("#briefPublishDate");
const briefContentEditor = document.querySelector("#briefContentEditor");
const briefChannelActions = document.querySelector("#briefChannelActions");
const briefSummaryPanel = document.querySelector("#briefSummaryPanel");
const openBriefInAiButton = document.querySelector("#openBriefInAi");
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
const editClusterQuestionsInput = document.querySelector("#editClusterQuestions");
const closeEditClusterModalButton = document.querySelector("#closeEditClusterModal");

const selectedFilters = {
  persona: "All personas",
  stage: "All stages"
};

let activeAiTaskId = "strategy-plan";
let activeAiFormatKey = null;
let activeAiSourceItemId = null;
let activeAiPersona = null;
let activeAiStage = null;
let activeAiClusterKey = null;
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

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  try {
    const parsed = new URL(raw);
    const protocol = parsed.protocol.toLowerCase();
    return protocol === "http:" || protocol === "https:" || protocol === "mailto:"
      ? parsed.toString()
      : "";
  } catch {
    return "";
  }
}

function renderOption(value, label, selected = false) {
  return `<option value="${escapeHtml(value)}"${selected ? " selected" : ""}>${escapeHtml(label)}</option>`;
}

async function readJsonResponse(response) {
  const raw = await response.text();

  if (!raw.trim()) {
    const error = new Error(`Empty response from server (${response.status}).`);
    error.statusCode = response.status;
    throw error;
  }

  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error(`Server returned invalid JSON (${response.status}).`);
    error.statusCode = response.status;
    error.responseText = raw.slice(0, 300);
    throw error;
  }
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
    subtopics: uniqueList(cluster?.subtopics),
    questions: uniqueList(cluster?.questions)
  };
}

function getClusterSubtopics(cluster) {
  return uniqueList(cluster?.subtopics);
}

function getClusterQuestions(cluster) {
  return uniqueList(cluster?.questions);
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
      journey: clone(initialData.journey),
      hints: clone(initialData.hints),
      aiTasks: clone(initialData.aiTasks),
      personas,
      productFoundation: normalizeProductFoundation(parsed.productFoundation || initialData.productFoundation),
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
      journey: clone(initialData.journey),
      hints: clone(initialData.hints),
      aiTasks: clone(initialData.aiTasks),
      personas,
      productFoundation: normalizeProductFoundation(serverData.productFoundation || initialData.productFoundation),
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

function splitQuestionList(value) {
  return String(value)
    .split(/\r?\n/)
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

function getAiTargetCluster(stage = getAiTargetStage(), persona = getAiTargetPersona()) {
  if (activeAiClusterKey) {
    const exactCluster = dashboardData.clusters.find((cluster) => clusterKey(cluster) === activeAiClusterKey) || null;
    if (exactCluster) {
      return exactCluster;
    }

    activeAiClusterKey = null;
  }

  return getFocusedCluster(stage, persona);
}

function getActiveAiTask() {
  return dashboardData.aiTasks.find((task) => task.id === activeAiTaskId) || dashboardData.aiTasks[0] || null;
}

function normalizeAiTypography(text) {
  return String(text || "")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2212]/g, "-");
}

function normalizeAiArtifact(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeAiArtifact(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, normalizeAiArtifact(entry)])
    );
  }

  return typeof value === "string" ? normalizeAiTypography(value) : value;
}

function getBalancedJsonCandidate(text) {
  const source = String(text || "").trim();
  const startIndex = source.search(/[\[{]/);

  if (startIndex < 0) {
    return "";
  }

  const stack = [];
  let inString = false;
  let isEscaped = false;

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
        continue;
      }

      if (char === "\\") {
        isEscaped = true;
        continue;
      }

      if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{" || char === "[") {
      stack.push(char);
      continue;
    }

    if (char === "}" || char === "]") {
      const expected = char === "}" ? "{" : "[";
      if (stack[stack.length - 1] !== expected) {
        return "";
      }

      stack.pop();

      if (!stack.length) {
        return source.slice(startIndex, index + 1);
      }
    }
  }

  return "";
}

function parseStructuredAppData(rawText) {
  const raw = String(rawText || "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  const candidates = [raw, getBalancedJsonCandidate(raw)].filter(Boolean);
  let lastError = null;

  for (const candidate of candidates) {
    try {
      return {
        appData: normalizeAiArtifact(JSON.parse(candidate)),
        repaired: candidate !== raw
      };
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error("No JSON candidate found inside <app-data>.");
}

function extractAppData(text) {
  // Unescape HTML entities in case the text went through JSON serialisation
  const normalized = String(text || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
  const sanitized = normalizeAiTypography(normalized);

  const match = sanitized.match(/<app-data>\s*([\s\S]*?)\s*<\/app-data>/i);

  if (!match) {
    return { appData: null, displayText: normalizeAiTypography(text).trim() };
  }

  try {
    const parsed = parseStructuredAppData(match[1]);
    const displayText = sanitized.replace(match[0], "").trim();
    if (parsed.repaired) {
      console.warn("[extractAppData] Recovered malformed JSON inside <app-data> by trimming trailing content.");
    }

    return { appData: parsed.appData, displayText };
  } catch (err) {
    console.warn("[extractAppData] JSON parse failed:", err.message, "\nRaw:", match[1].slice(0, 200));
    return { appData: null, displayText: normalizeAiTypography(text).trim() };
  }
}

function getStructuredAiDisplayText(appData, fallbackText = "") {
  if (!appData) {
    return String(fallbackText || "").trim();
  }

  const items = Array.isArray(appData.contentItems) && appData.contentItems.length
    ? appData.contentItems
    : (appData.contentItem ? [appData.contentItem] : []);

  if ((appData.type === "content-brief" || appData.type === "full-draft") && items.length) {
    const renderedItems = items
      .map((item, index) => {
        const content = String(item?.briefContent || "").trim();
        if (!content) {
          return "";
        }

        if (items.length === 1) {
          return content;
        }

        const formatLabel = [item?.format, item?.channel].filter(Boolean).join(" - ");
        const heading = formatLabel || `Item ${index + 1}`;
        return [`### ${heading}`, content].join("\n\n");
      })
      .filter(Boolean);

    if (renderedItems.length) {
      return renderedItems.join("\n\n===\n\n");
    }
  }

  return String(fallbackText || "").trim();
}

function parseMarkdownSections(text) {
  const sections = [];
  let current = null;

  String(text || "")
    .split(/\r?\n/)
    .forEach((line) => {
      const headingMatch = line.match(/^#{1,3}\s+(.+)$/);
      if (headingMatch) {
        current = { heading: headingMatch[1].trim(), content: [] };
        sections.push(current);
        return;
      }

      if (current) {
        current.content.push(line);
      }
    });

  return sections.map((section) => ({
    heading: section.heading,
    content: section.content.join("\n").trim()
  }));
}

function getBriefSectionContent(text, headingStarts) {
  const sections = parseMarkdownSections(text);
  const match = sections.find((section) =>
    headingStarts.some((heading) => normalizeLabel(section.heading).startsWith(normalizeLabel(heading)))
  );

  return match?.content || "";
}

function renderBriefSummary(item) {
  if (!briefSummaryPanel) {
    return;
  }

  const content = String(briefContentEditor?.value || item?.briefContent || "").trim();
  const formatLabel = [briefFormat?.value || item?.format, briefChannel?.value || item?.channel].filter(Boolean).join(" - ");
  const summaryItems = [
    formatLabel ? { label: "Format", value: formatLabel } : null,
    { label: "Objective", value: getBriefSectionContent(content, ["Objective"]) },
    { label: "Core Angle", value: getBriefSectionContent(content, ["Core Angle", "Core Angle / Thesis"]) },
    { label: "CTA", value: getBriefSectionContent(content, ["CTA"]) },
    { label: "Success Signal", value: getBriefSectionContent(content, ["Success Signal"]) },
    { label: "Target Length", value: getBriefSectionContent(content, ["Target Length"]) }
  ].filter((entry) => entry && entry.value);

  briefSummaryPanel.innerHTML = summaryItems.length
    ? summaryItems
      .map(
        (entry) => `
          <article class="brief-summary-item">
            <span class="field-label">${escapeHtml(entry.label)}</span>
            <p class="brief-summary-value">${escapeHtml(entry.value)}</p>
          </article>
        `
      )
      .join("")
    : '<p class="brief-summary-empty">No structured headings yet. Save or paste a brief with sections like Objective, Core Angle, CTA, and Success Signal.</p>';

  if (openBriefInAiButton) {
    openBriefInAiButton.disabled = !content;
  }
}

function renderBriefChannelActions(item) {
  if (!briefChannelActions) {
    return;
  }

  const channel = String(briefChannel?.value || item?.channel || "").trim();
  const action = channel ? renderChannelActionLink(channel, "ghost-button-sm ghost-button-sm-social brief-channel-action") : "";

  if (action) {
    briefChannelActions.innerHTML = action;
    briefChannelActions.hidden = false;
    return;
  }

  briefChannelActions.innerHTML = "";
  briefChannelActions.hidden = true;
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
    ? `Ready to apply “${latestAiRun.title}” to the dashboard.`
    : "Run an AI task first — the button enables after the model returns a structured result.";
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
    subtopics: uniqueList(clusterData.subtopics),
    questions: uniqueList(clusterData.questions)
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

function upsertClusterResearch(clusterData, fallbackStage, fallbackPersona) {
  const fallbackCluster = activeAiClusterKey
    ? dashboardData.clusters.find((cluster) => clusterKey(cluster) === activeAiClusterKey) || null
    : null;
  const title = String(clusterData?.title || fallbackCluster?.title || "").trim();
  const persona = String(clusterData?.persona || fallbackPersona || fallbackCluster?.persona || getFocusedPersona() || "").trim();
  const intent = String(clusterData?.intent || fallbackStage || fallbackCluster?.intent || getFocusedStage() || "Awareness").trim();

  if (!title || !persona) {
    return false;
  }

  const existingIndex = dashboardData.clusters.findIndex((cluster) => {
    if (activeAiClusterKey && clusterKey(cluster) === activeAiClusterKey) {
      return true;
    }

    return normalizeLabel(cluster.title) === normalizeLabel(title)
      && normalizeLabel(cluster.persona) === normalizeLabel(persona)
      && cluster.intent === intent;
  });
  const existingCluster = existingIndex >= 0 ? dashboardData.clusters[existingIndex] : null;
  const nextCluster = normalizeCluster({
    ...existingCluster,
    title,
    persona,
    intent,
    score: clusterData?.score || existingCluster?.score || "AI draft",
    summary: clusterData?.summary || existingCluster?.summary || "AI-generated cluster summary.",
    subtopics: Array.isArray(clusterData?.subtopics) && clusterData.subtopics.length
      ? clusterData.subtopics
      : existingCluster?.subtopics,
    questions: Array.isArray(clusterData?.questions) && clusterData.questions.length
      ? clusterData.questions
      : existingCluster?.questions
  });

  if (existingIndex >= 0) {
    dashboardData.clusters.splice(existingIndex, 1, nextCluster);
  } else {
    dashboardData.clusters.unshift(nextCluster);
  }

  activeAiClusterKey = clusterKey(nextCluster);
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
    .map((p) => renderOption(p.name, p.name, p.name === item.persona))
    .join("");

  briefStageSelect.value = item.stage;
  briefStatusSelect.value = found.status;
  briefFormat.value = item.format || "";
  briefChannel.value = item.channel || "";
  briefPublishDate.value = item.publishDate || "";
  briefContentEditor.value = item.briefContent || "";

  // Show format/channel badge
  if (briefFormatBadge) {
    const formatText = item.format ? `<span class="brief-format-text">${escapeHtml(item.format)}</span>` : "";
    const channelBadge = item.channel ? renderChannelPill(item.channel, { className: "channel-pill--inline channel-pill--badge", link: false, href: null }) : "";
    if (formatText || channelBadge) {
      briefFormatBadge.innerHTML = [formatText, channelBadge].filter(Boolean).join('<span class="brief-badge-sep">·</span>');
      briefFormatBadge.hidden = false;
    } else {
      briefFormatBadge.hidden = true;
    }
  }

  const nextStatus = getNextStatus(found.status);
  advanceBriefButton.textContent = nextStatus ? `Advance to ${nextStatus}` : "Already published";
  advanceBriefButton.disabled = !nextStatus;
  renderBriefSummary(item);
  renderBriefChannelActions(item);

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

function setAiDraftContextFromItem(item) {
  if (!item) return;

  activeAiSourceItemId = item.id;
  activeAiPersona = item.persona || null;
  activeAiStage = item.stage || null;
  activeAiClusterKey = null;
  activeAiTaskId = "full-draft";
  activeAiFormatKey = item.format && item.channel
    ? formatPairKey({ format: item.format, channel: item.channel })
    : null;

  renderAll();
  showSection("ai");
  setAiStatus(`Draft prompt ready from brief: ${item.title}`, "success");
}

function openBriefInAiStudio() {
  if (!activeBriefEdit) return;

  saveBriefFromModal();

  const found = findContentItemById(activeBriefEdit.id);
  if (!found) return;

  closeBriefEditor();
  setAiDraftContextFromItem(found.item);
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

  if (activeAiPersona === oldName) {
    activeAiPersona = newName;
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
    const response = await fetch("/api/youtube/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        channelId: channel.channelId,
        apiKey: channel.apiKey
      })
    });
    const data = await readJsonResponse(response);

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
    return `<span class="spark-bar" style="--h:${Math.max(pct, 8)}%" title="${escapeHtml(s.date)}: ${formatFollowers(s.count)}"></span>`;
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

    const meta = getChannelMeta(channel.platform);
    const isYouTube = channel.platform === "YouTube" && channel.apiKey && channel.channelId;
    const profileUrl = sanitizeUrl(channel.url || meta?.url || "");

    return `
      <article class="channel-card">
        <div class="channel-card-head">
          <div class="channel-platform-icon" style="--channel-color: ${escapeHtml(meta?.color || "#102b25")};">${meta ? renderChannelLogo(meta) : renderChannelPill(channel.platform, { iconOnly: true, href: null })}</div>
          <div>
            <p class="card-label eyebrow">${escapeHtml(channel.platform)}</p>
            <h4 class="channel-handle">${escapeHtml(channel.handle)}</h4>
          </div>
          <div class="channel-count-block">
            ${count !== null
              ? `<strong class="channel-count">${formatFollowers(count)}</strong>${deltaText}`
              : `<span class="channel-count-empty">No data</span>`}
          </div>
        </div>
        ${renderChannelSparkline(channel.snapshots)}
        ${latest ? `<p class="channel-last-updated">Last logged ${escapeHtml(latest.date)}</p>` : ""}
        <div class="channel-card-actions">
          <div class="channel-log-row">
            <input class="channel-count-input" type="number" min="0" placeholder="Log today's count"
              id="count-input-${escapeHtml(channel.id)}" />
            <button class="ghost-button-sm" type="button" data-log-channel="${escapeHtml(channel.id)}">Log</button>
          </div>
          ${isYouTube
            ? `<button class="ghost-button-sm" type="button" data-fetch-youtube="${escapeHtml(channel.id)}">Auto-fetch ▶️</button>`
            : ""}
          ${profileUrl ? `<a class="ghost-button-sm channel-link ghost-button-sm-social" href="${escapeHtml(profileUrl)}" target="_blank" rel="noopener noreferrer">${meta ? renderChannelLogo(meta) : ""}<span>${escapeHtml(meta?.buttonLabel || "View profile")}</span></a>` : ""}
          <button class="ghost-button-sm ghost-button-sm-danger" type="button" data-delete-channel="${escapeHtml(channel.id)}">Remove</button>
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
    .map((p) => renderOption(p.name, p.name, p.name === cluster.persona))
    .join("");

  editClusterIntentSelect.value = cluster.intent;
  editClusterScoreInput.value = cluster.score;
  editClusterSummaryInput.value = cluster.summary;
  editClusterSubtopicsInput.value = cluster.subtopics.join(", ");
  editClusterQuestionsInput.value = getClusterQuestions(cluster).join("\n");

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
    subtopics: splitList(formData.get("subtopics").toString()),
    questions: splitQuestionList(formData.get("questions"))
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

  activeAiPersona = cluster.persona || null;
  activeAiStage = cluster.intent || null;
  activeAiClusterKey = key;
  activeAiTaskId = "content-brief";
  activeAiSourceItemId = null;

  renderAll();
  buildPrompt();
  showSection("ai");
  setAiStatus(`Brief prompt ready for: ${cluster.title}`, "success");
}

function openQuestionMiningFromCluster(key) {
  const cluster = dashboardData.clusters.find((c) => clusterKey(c) === key);
  if (!cluster) return;

  activeAiPersona = cluster.persona || null;
  activeAiStage = cluster.intent || null;
  activeAiClusterKey = key;
  activeAiTaskId = "question-mining";
  activeAiSourceItemId = null;

  renderAll();
  buildPrompt();
  showSection("ai");
  setAiStatus(`Question mining prompt ready for: ${cluster.title}`, "success");
}

function applyAiRun() {
  const artifact = latestAiRun?.appData;

  if (!artifact) {
    setAiStatus("No structured AI result to apply", "error");
    return;
  }

  const persona = getAiTargetPersona();
  const stage = getAiTargetStage();
  const applied = [];

  if (artifact.type === "strategy-plan") {
    if (artifact.cluster && upsertCluster(artifact.cluster, stage, persona)) {
      applied.push("cluster");
    }

    // Support both contentItems[] and legacy contentItem
    const stratItems = Array.isArray(artifact.contentItems) && artifact.contentItems.length
      ? artifact.contentItems
      : (artifact.contentItem ? [artifact.contentItem] : []);
    stratItems.forEach((item) => {
      if (upsertContentItem(item, persona, stage)) {
        applied.push("content item");
      }
    });
  }

  if (artifact.type === "cluster-gaps") {
    if (artifact.cluster && upsertCluster(artifact.cluster, stage, persona)) {
      applied.push("cluster");
    }
  }

  if (artifact.type === "question-mining") {
    if (artifact.cluster && upsertClusterResearch(artifact.cluster, stage, persona)) {
      applied.push("cluster questions");
    }
  }

  if (artifact.type === "content-brief") {
    // Support both contentItems[] (new multi-format) and legacy contentItem (single)
    const items = Array.isArray(artifact.contentItems) && artifact.contentItems.length
      ? artifact.contentItems
      : (artifact.contentItem ? [artifact.contentItem] : []);

    if (items.length) {
      const fullText = latestAiRun?.displayText || "";

      // Preferred path: content is stored directly in structured JSON per item.
      // Legacy fallback remains for earlier runs that only returned prose sections.
      const rawSections = fullText.split(/\n===\n/).map((s) => s.trim()).filter(Boolean);
      const sections = rawSections.length >= items.length ? rawSections : null;

      items.forEach((item, index) => {
        const structuredContent = String(item?.briefContent || "").trim();
        const legacyContent = (sections && sections[index]) ? sections[index] : fullText;
        const enrichedItem = {
          ...item,
          briefContent: structuredContent || String(legacyContent || "").trim()
        };
        if (upsertContentItem(enrichedItem, persona, stage)) {
          applied.push(item.format || item.title || "content item");
        }
      });
    }
  }

  if (artifact.type === "persona-depth") {
    if (artifact.persona) {
      // Merge fragment items: join consecutive items that look like sentence fragments
      const mergeFragments = (arr) => {
        if (!Array.isArray(arr)) return arr;
        const out = [];
        for (const item of arr) {
          const trimmed = item.trim();
          const isFragment = /^(and |but |or |wayfinding|,)/i.test(trimmed) || trimmed.length < 12;
          if (isFragment && out.length) {
            out[out.length - 1] = out[out.length - 1].replace(/[,\s]+$/, "") + ", " + trimmed.replace(/^,\s*/, "");
          } else {
            out.push(trimmed);
          }
        }
        return out;
      };
      artifact.persona.pains = mergeFragments(artifact.persona.pains);
      artifact.persona.goals = mergeFragments(artifact.persona.goals);
      // Normalise channels to canonical keys
      if (Array.isArray(artifact.persona.channels)) {
        artifact.persona.channels = normaliseChannels(artifact.persona.channels);
      }
      if (upsertPersona(artifact.persona, persona)) {
        applied.push("persona");
      }
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
  activeAiSourceItemId = null;
  activeAiPersona = null;
  activeAiStage = null;
  activeAiClusterKey = null;
  renderHints();
  buildPrompt();
  promptOutput.value = getHistoryPrompt(entry);
  aiResponse.value = getStructuredAiDisplayText(entry.appData, entry.displayText || entry.rawText);
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
  const personaFilterValue = activeAiPersona || selectedFilters.persona;
  const stageFilterValue = activeAiStage || selectedFilters.stage;

  personaFilter.innerHTML = personaOptions
    .map((option) => renderOption(option, option))
    .join("");
  personaFilter.value = personaFilterValue;

  stageFilter.innerHTML = stageOptions
    .map((option) => renderOption(option, option === "All stages" ? option : getStageBadge(option)))
    .join("");
  stageFilter.value = stageFilterValue;

  contentPersona.innerHTML = dashboardData.personas
    .map((persona) => renderOption(persona.name, persona.name))
    .join("");

  clusterPersona.innerHTML = dashboardData.personas
    .map((persona) => renderOption(persona.name, persona.name))
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
  const foundation = normalizeProductFoundation(dashboardData.productFoundation || initialData.productFoundation);

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
          <p class="metric-label">${escapeHtml(metric.label)}</p>
          <strong class="metric-value">${metric.value}</strong>
          <p class="metric-detail">${escapeHtml(metric.detail)}</p>
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
            <h4 class="launchpad-title">${escapeHtml(step.title)}</h4>
            <p class="launchpad-copy">${escapeHtml(step.detail)}</p>
          </div>
          <button class="ghost-button launchpad-button" type="button" data-jump-section="${escapeHtml(step.section)}">
            ${escapeHtml(step.action)}
          </button>
        </article>
      `
    )
    .join("");

  if (brandFoundationForm) {
    productDescriptionInput.value = foundation.description;
    productMissionInput.value = foundation.mission;
    productValuePropInput.value = foundation.valueProposition;
    goldenCircleWhyInput.value = foundation.goldenCircle.why;
    goldenCircleHowInput.value = foundation.goldenCircle.how;
    goldenCircleWhatInput.value = foundation.goldenCircle.what;
    productProofPointsInput.value = foundation.proofPoints.join(", ");
  }
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
                  <h4 class="persona-name">${escapeHtml(persona.name)}</h4>
                </div>
                <div class="card-actions-pair">
                  <button class="ghost-button card-action" type="button" data-edit-persona="${escapeHtml(persona.id)}">
                    Edit
                  </button>
                  <button class="ghost-button card-action" type="button" data-delete-persona="${escapeHtml(persona.id)}">
                    Delete
                  </button>
                </div>
              </div>
              <p class="persona-meta">${escapeHtml(persona.role)}</p>
              <div class="tag-row">
                ${persona.pains.map((pain) => `<span class="tag">Pain: ${escapeHtml(pain)}</span>`).join("")}
              </div>
              <div class="tag-row">
                ${persona.goals.map((goal) => `<span class="tag">Goal: ${escapeHtml(goal)}</span>`).join("")}
              </div>
              <div class="tag-row">
                ${persona.channels.map((channel) => renderChannelPill(channel, { className: "tag tag--channel" })).join("")}
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
          <span class="stage-pill" data-stage="${escapeHtml(item.stage)}">${getStageBadge(item.stage)}</span>
          <h4 class="journey-title">${escapeHtml(item.stage)}</h4>
          <p class="journey-copy">${escapeHtml(item.description)}</p>
          <p class="journey-bridge"><strong>Inbound motion:</strong> ${getStageMotion(item.stage)}.</p>
          <ul>
            ${item.focus.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}
          </ul>
          <p class="journey-copy"><strong>For marketers:</strong> ${getStageMeta(item.stage).marketerNote}</p>
          <p class="journey-copy"><strong>Prompt cue:</strong> ${escapeHtml(item.promptHint)}</p>
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
                  <h4 class="persona-name">${escapeHtml(persona.name)}</h4>
                </div>
              </div>
              <div class="cluster-stage-grid">
                ${visibleStages
                  .map((stage) => {
                    const stageClusters = getFilteredClusters(persona.name, stage.stage);

                    return `
                      <section class="cluster-stage-column">
                        <div class="cluster-stage-head">
                          <span class="stage-pill" data-stage="${escapeHtml(stage.stage)}">${getStageBadge(stage.stage)}</span>
                          <span class="pipeline-count">${stageClusters.length}</span>
                        </div>
                        <div class="cluster-stage-stack">
                          ${stageClusters.length
                            ? stageClusters
                                .map(
                                  (cluster) => {
                                    const key = clusterKey(cluster);
                                    const subtopics = getClusterSubtopics(cluster);
                                    const questions = getClusterQuestions(cluster);
                                    return `
                                    <article class="cluster-card">
                                      <div class="cluster-head">
                                        <div>
                                          <p class="cluster-structure-kicker">Topic</p>
                                          <h4 class="cluster-title">${escapeHtml(cluster.title)}</h4>
                                          <p class="topic-copy">${escapeHtml(cluster.summary)}</p>
                                        </div>
                                        <div class="cluster-score">
                                          <span class="card-label">coverage</span>
                                          <strong>${escapeHtml(cluster.score)}</strong>
                                        </div>
                                      </div>
                                      <div class="cluster-taxonomy-bar">
                                        <span class="cluster-taxonomy-pill">1 topic</span>
                                        <span class="cluster-taxonomy-arrow">→</span>
                                        <span class="cluster-taxonomy-pill">${subtopics.length} subtopics</span>
                                        <span class="cluster-taxonomy-pill">${questions.length} AI questions</span>
                                      </div>
                                      <p class="cluster-structure-copy">This card is the top-level topic. Every item below belongs under it as a supporting subtopic.</p>
                                      <div class="subtopic-block">
                                        <p class="cluster-structure-kicker">Subtopic cluster</p>
                                        <ul class="subtopic-list">
                                          ${subtopics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join("")}
                                        </ul>
                                      </div>
                                      ${questions.length
                                        ? `<div class="question-block">
                                        <p class="cluster-structure-kicker">Persona questions asked in AI chatbots</p>
                                        <ul class="question-list">
                                          ${questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}
                                        </ul>
                                      </div>`
                                        : ""}
                                      <div class="cluster-card-actions">
                                        <button class="ghost-button-sm" type="button" data-mine-cluster="${escapeHtml(key)}">Mine questions</button>
                                        <button class="ghost-button-sm" type="button" data-brief-cluster="${escapeHtml(key)}">Draft brief</button>
                                        <button class="ghost-button-sm" type="button" data-edit-cluster="${escapeHtml(key)}">Edit</button>
                                        <button class="ghost-button-sm ghost-button-sm-danger" type="button" data-delete-cluster="${escapeHtml(key)}">Delete</button>
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
            <strong>${escapeHtml(status)}</strong>
            <span class="pipeline-count">${filtered.length}</span>
          </div>
          ${filtered.length
            ? filtered
                .map(
                  (item) => `
                    <article class="pipeline-card">
                      <div>
                        <div class="pipeline-card-top">
                          <span class="stage-pill" data-stage="${escapeHtml(item.stage)}">${getStageBadge(item.stage)}</span>
                          ${item.format ? `<span class="format-tag${item.briefContent ? " format-tag--filled" : ""}">${escapeHtml(item.format)}</span>` : ""}
                        </div>
                        <h4 class="pipeline-title">${escapeHtml(item.title)}</h4>
                        <div class="pipeline-meta-row">
                          <p class="pipeline-copy pipeline-copy-persona">${escapeHtml(item.persona)}</p>
                          ${item.channel ? renderChannelPill(item.channel, { className: "channel-pill--inline channel-pill--pipeline" }) : ""}
                        </div>
                        ${item.publishDate ? `<p class="pipeline-date">${escapeHtml(item.publishDate)}</p>` : ""}
                      </div>
                      <div class="pipeline-card-actions">
                        <button class="ghost-button-sm" type="button" data-open-brief="${escapeHtml(item.id)}">Open</button>
                        ${item.briefContent ? `<button class="ghost-button-sm ghost-button-sm-accent" type="button" data-draft-from-brief="${escapeHtml(item.id)}">AI Draft</button>` : ""}
                        ${nextStatus ? `<button class="ghost-button-sm" type="button" data-advance-item="${escapeHtml(item.id)}">→ ${escapeHtml(nextStatus)}</button>` : ""}
                        <button class="ghost-button-sm ghost-button-sm-danger" type="button" data-delete-item="${escapeHtml(item.id)}">Delete</button>
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
              <div class="calendar-date">${escapeHtml(item.date || "TBD")}</div>
              <div>
                <h4 class="calendar-title">${escapeHtml(item.title)}</h4>
                ${item.channel ? `<div class="calendar-meta-row">${renderChannelPill(item.channel, { className: "channel-pill--inline channel-pill--calendar" })}</div>` : ""}
                <p class="calendar-meta">${escapeHtml(item.note)}</p>
              </div>
              <button class="ghost-button-sm" type="button" data-remove-calendar="${escapeHtml(item.id)}">Remove</button>
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
    `${getStageBadge("Awareness")} assets in flow: ${awarenessCount}.`,
    `${getStageBadge("Consideration")} assets in flow: ${considerationCount}.`,
    `${getStageBadge("Decision")} assets in flow: ${decisionCount}.`,
    `Tracked personas: ${dashboardData.personas.length}. Keep every cluster as one topic with subtopics nested under it.`
  ];

  coverageList.innerHTML = coverageSignals.map((signal) => `<li>${escapeHtml(signal)}</li>`).join("");
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
    productFoundation: normalizeProductFoundation(dashboardData.productFoundation || initialData.productFoundation),
    personas: dashboardData.personas.filter((persona) => isPersonaMatch(persona.name)),
    journey: dashboardData.journey.filter((item) => isStageMatch(item.stage)),
    clusters: getFilteredClusters(),
    pipeline: filteredPipeline,
    calendar: dashboardData.calendar
  };
}

function buildPrompt() {
  const task = getActiveAiTask();
  const persona = getAiTargetPersona();
  const stage = getAiTargetStage();
  const cluster = getAiTargetCluster(stage, persona);
  const personaObj = dashboardData.personas.find((item) => item.name === persona) || null;
  const hasCluster = Boolean(cluster);
  const clusterTitle = cluster?.title || `the first ${stage.toLowerCase()} cluster for ${persona}`;
  const clusterSummary = cluster?.summary || "No saved cluster exists yet. Generate one from persona pains, goals, and channel behavior.";
  const clusterSubtopics = getClusterSubtopics(cluster);
  const clusterQuestions = getClusterQuestions(cluster);
  const stageBadge = getStageBadge(stage);
  const stageMotion = getStageMotion(stage);
  const punctuationRule = "Never use em dashes or en dashes anywhere in the response. Use a plain hyphen - or rewrite the sentence.";

  // Pull the live persona object to get their channels
  const { personaChannels, channelList, formatsText, formatPairs, selectedFormatPair } = getAiFormatContext(persona, task?.id);
  const stageGuidance = STAGE_FORMAT_GUIDANCE[stage] || STAGE_FORMAT_GUIDANCE["Awareness"];
  const productFoundationLines = getProductFoundationPromptLines();
  const personaPromptLines = [
    personaObj?.role ? `Persona role / operating context: ${personaObj.role}.` : "",
    Array.isArray(personaObj?.pains) && personaObj.pains.length
      ? `Persona pains to address in the brief: ${personaObj.pains.join("; ")}.`
      : "",
    Array.isArray(personaObj?.goals) && personaObj.goals.length
      ? `Persona desired outcomes: ${personaObj.goals.join("; ")}.`
      : "",
    personaChannels.length ? `Persona distribution channels: ${channelList}.` : ""
  ].filter(Boolean);
  const clusterPromptLines = [
    `Primary cluster: ${clusterTitle}.`,
    `Cluster summary: ${clusterSummary}`,
    clusterSubtopics.length
      ? `Saved subtopics nested under this topic: ${clusterSubtopics.join("; ")}.`
      : "No saved subtopics yet. If you need a supporting angle, derive it from the cluster summary and persona pains without changing the core topic.",
    clusterQuestions.length
      ? `Saved persona questions asked in AI chatbots: ${clusterQuestions.join("; ")}.`
      : "No saved persona AI-chatbot questions yet. If useful, derive natural-language questions this persona would ask ChatGPT, Perplexity, Claude, or Gemini while researching this topic."
  ].filter(Boolean);

  let promptLines = [];

  if (!task || task.id === "strategy-plan") {
    promptLines = [
      "You are a senior content strategist working for Art Flaneur.",
      "Develop the inbound content plan in English.",
      punctuationRule,
      ...productFoundationLines,
      `Focus on persona: ${persona}.`,
      `Focus on stage: ${stageBadge}.`,
      "Use this methodology mapping in the plan: Awareness = Attract, Consideration = Engage, Decision = Delight.",
      personaChannels.length ? `Persona's distribution channels: ${channelList}.` : "",
      formatsText ? `Content formats available for this persona:\n${formatsText}` : "",
      hasCluster
        ? `Use this priority cluster as context: ${clusterTitle}.`
        : "There are no saved clusters yet, so generate the first strategic cluster from the persona details in the dashboard.",
      "Topic cluster rule: treat each cluster as ONE top-level topic, and place every supporting angle beneath it as a subtopic inside that topic cluster.",
      "Question mining rule: every cluster must also include natural-language questions this persona would ask inside AI chatbots while researching the topic.",
      `IMPORTANT: Before writing anything else, output this JSON on the very first line, wrapped in <app-data></app-data> — fill in the real values as you write: <app-data>${JSON.stringify({type:"strategy-plan",cluster:{title:clusterTitle,persona,summary:"...",intent:stage,subtopics:["..."],questions:["..."],score:"AI draft"},contentItem:{title:"...",persona,stage,status:"Brief"}})}</app-data>`,
      "Then write the full plan below.",
      "Return:",
      "1. Persona insight summary with pains, desired outcomes, and objections.",
      "2. One core topic cluster, six supporting subtopics nested under that topic, and six persona questions phrased as natural AI-chatbot searches.",
      "3. Three article ideas ranked by inbound impact — each with a specific format and channel from the list above.",
      "4. One content brief with title, promise, outline, CTA, and distribution notes (include the format and channel).",
      "5. A short explanation of why this supports the inbound methodology."
    ].filter(Boolean);
    weeklyFocus.textContent = `Develop ${stage.toLowerCase()} opportunities for ${persona}.`;
    runAiButton.textContent = "Run strategic plan";
  }

  if (task?.id === "persona-depth") {
    promptLines = [
      "You are a senior inbound content strategist working for Art Flaneur.",
      "Expand one audience persona in English so it becomes usable for content planning.",
      punctuationRule,
      ...productFoundationLines,
      `Focus on persona: ${persona}.`,
      `Reflect the current buying stage context: ${stageBadge}.`,
      "Use this methodology mapping when framing the answer: Awareness = Attract, Consideration = Engage, Decision = Delight.",
      `IMPORTANT: Before writing anything else, output this JSON on the very first line, wrapped in <app-data></app-data> — fill in real values: <app-data>${JSON.stringify({type:"persona-depth",persona:{name:persona,role:"...",pains:["complete sentence"],goals:["complete sentence"],channels:["ExactChannelName"]}})}</app-data>`,
      "Then write the full expansion below.",
      "Return:",
      "1. A concise persona summary in 3 sentences.",
      "2. Five pains or anxieties in plain language.",
      "3. Five desired outcomes.",
      "4. Five objections that block action.",
      "5. Up to 4 channels this persona uses (choose only from this exact list, use exact spelling):",
      "   Instagram | LinkedIn | YouTube | email newsletter | website article | PDF / slides",
      "6. Three messaging hooks Art Flaneur can use in content.",
      "7. Three content angles, one per buyer's journey stage.",
      "CRITICAL JSON RULES — violating these will break the dashboard:",
      "  - Each array item (pain, goal, channel) must be ONE complete self-contained sentence or phrase.",
      "  - Never split a sentence across two array items. If a thought has a comma in the middle, keep it in one string.",
      "  - No item may start with 'and', 'but', 'or', 'wayfinding', or any fragment.",
      "  - Each pain and goal must make sense on its own without reading other items.",
      "  - channels array: use ONLY the exact strings listed above — no descriptions, no paraphrasing."
    ];
    weeklyFocus.textContent = `Sharpen the voice, objections, and message angles for ${persona}.`;
    runAiButton.textContent = "Run persona expansion";
  }

  if (task?.id === "cluster-gaps") {
    promptLines = [
      "You are a senior inbound content strategist working for Art Flaneur.",
      "Find topic cluster gaps and propose a stronger inbound structure in English.",
      punctuationRule,
      ...productFoundationLines,
      `Focus on persona: ${persona}.`,
      `Focus on stage: ${stageBadge}.`,
      "Use this methodology mapping in the analysis: Awareness = Attract, Consideration = Engage, Decision = Delight.",
      hasCluster
        ? `Current weakest cluster: ${clusterTitle}.`
        : `No saved cluster exists yet. Propose the first core cluster for ${persona} at the ${stage} stage.`,
      `Cluster summary: ${clusterSummary}`,
      "Topic cluster rule: return one top-level topic and keep every supporting idea nested beneath it as a subtopic, not as a separate peer cluster.",
      "Question mining rule: add natural-language questions this persona would ask in AI chatbots when trying to understand, compare, or solve this topic.",
      `IMPORTANT: Before writing anything else, output this JSON on the very first line, wrapped in <app-data></app-data> — fill in real values: <app-data>${JSON.stringify({type:"cluster-gaps",cluster:{title:clusterTitle,persona,summary:"...",intent:stage,subtopics:["..."],questions:["..."],score:"AI draft"}})}</app-data>`,
      "Then write the full analysis below.",
      "Return:",
      "1. A short diagnosis of the current gap.",
      "2. One improved core cluster with a clear promise.",
      "3. Eight supporting subtopics nested beneath that topic with clear angles.",
      "4. Six persona questions phrased exactly like AI-chatbot searches or prompts.",
      "5. Two conversion assets or lead magnets.",
      "6. Internal linking notes showing how awareness, consideration, and decision content should connect."
    ];
    weeklyFocus.textContent = `Close the topic gap around ${clusterTitle} for ${stage.toLowerCase()} intent.`;
    runAiButton.textContent = "Run cluster analysis";
  }

  if (task?.id === "question-mining") {
    promptLines = [
      "You are a senior inbound content strategist working for Art Flaneur.",
      "Mine the real questions this persona would ask AI chatbots while researching one cluster in English.",
      punctuationRule,
      ...productFoundationLines,
      `Focus on persona: ${persona}.`,
      ...personaPromptLines,
      `Focus on stage: ${stageBadge}.`,
      `Methodology mapping for this request: ${stage} = ${stageMotion}.`,
      ...clusterPromptLines,
      hasCluster
        ? `Mine questions for this exact cluster: ${clusterTitle}. Do not rename it or replace it with a different topic.`
        : `No saved cluster exists yet. Generate the first cluster and its AI-chatbot questions for ${persona} at the ${stage} stage.`,
      "Question mining rule: return natural-language prompts exactly as the persona would type them into ChatGPT, Perplexity, Claude, or Gemini.",
      "Intent rule: include a mix of discovery, comparison, objection, and action-oriented questions without drifting away from the saved cluster.",
      `IMPORTANT: Before writing anything else, output this JSON on the very first line, wrapped in <app-data></app-data> - fill in real values: <app-data>${JSON.stringify({type:"question-mining",cluster:{title:clusterTitle,persona,summary:"...",intent:stage,questions:["..."],score:"AI draft"}})}</app-data>`,
      "Then write the full analysis below.",
      "Return:",
      "1. A short diagnosis of what the persona is trying to learn or unblock inside this cluster.",
      "2. Ten persona questions phrased exactly like AI-chatbot searches or prompts.",
      "3. A quick grouping of those questions by intent: discovery, comparison, objection, action.",
      "4. Two notes on how these questions should change the cluster's future briefs and drafts."
    ].filter(Boolean);
    weeklyFocus.textContent = `Mine persona questions for ${clusterTitle}.`;
    runAiButton.textContent = "Run question mining";
  }

  if (task?.id === "content-brief") {
    const targetFormat = selectedFormatPair || formatPairs[0] || null;
    const selectedFormatLabel = targetFormat ? `${targetFormat.format} - ${targetFormat.channel}` : "";
    const siblingFormatsText = targetFormat
      ? formatPairs
        .filter((pair) => formatPairKey(pair) !== formatPairKey(targetFormat))
        .map((pair) => `${pair.format} - ${pair.channel}`)
        .join(" | ")
      : "";
    const jsonItems = targetFormat
      ? `{"title":"...","persona":"${persona}","stage":"${stage}","status":"Brief","format":"${targetFormat.format}","channel":"${targetFormat.channel}","briefContent":"FULL BRIEF IN MARKDOWN WITH ESCAPED NEWLINES"}`
      : "";

    promptLines = [
      "You are a senior inbound content strategist working for Art Flaneur.",
      "Write a marketer-grade content brief for a human strategist and writer. Do not write the final article, post, email, or script.",
      punctuationRule,
      ...productFoundationLines,
      `Target persona: ${persona}.`,
      ...personaPromptLines,
      `Target buyer's journey stage: ${stageBadge}.`,
      `Methodology mapping for this request: ${stage} = ${stageMotion}.`,
      ...clusterPromptLines,
      "Cluster structure rule: the primary cluster is the top-level topic, and all saved subtopics sit beneath that topic as supporting angles.",
      `Stage tone for every brief: ${stageGuidance}`,
      formatsText ? `Content formats available for this persona:\n${formatsText}` : "",
      selectedFormatLabel ? `Selected format for this brief: ${selectedFormatLabel}.` : "",
      siblingFormatsText ? `Other formats available for this same persona and stage: ${siblingFormatsText}.` : "",
      `IMPORTANT: Start your response with ONLY this JSON line (fill in real titles), wrapped in <app-data></app-data> — do NOT omit it even if the response is long:`,
      `<app-data>{"type":"content-brief","contentItems":[\n    ${jsonItems}\n  ]}</app-data>`,
      "CRITICAL JSON RULE: Write the FULL brief inside briefContent as a JSON string. Escape line breaks as \\n and escape any quotes inside the content.",
      targetFormat ? `Write one content brief for this format only: ${targetFormat.format} — ${targetFormat.channel}.` : "No format selected.",
      "The brief must clearly depend on the context above. Do not invent a different audience, product, offer, or topic.",
      "Use the product foundation to shape positioning and proof, use the persona pains/goals to shape the angle, and use the cluster plus subtopics to shape the topic and supporting points.",
      "Use any saved persona AI-chatbot questions to mirror the real wording, intent, and objections the audience brings into discovery.",
      "Remember that this asset is one format inside a wider multi-format plan for the same persona and stage. Build the brief so it has a clear job relative to the other available formats instead of trying to do everything at once.",
      "Do not merge multiple formats into one asset. Keep the message system aligned with the wider stage plan, but make the execution native to the selected format and channel.",
      "Pick one primary angle inside the cluster for this specific asset. The other saved subtopics may appear only as supporting proof, objections, internal-link opportunities, or follow-up angles.",
      "Each briefContent value must include:",
      "  - Format name and channel (heading)",
      "  - Working title",
      "  - Role of this format in the wider stage plan: why this format exists alongside the other available formats for this persona and stage",
      "  - Objective: what business or audience movement this asset should create at this stage",
      "  - Persona insight: which pain, tension, or desired outcome this asset is built around",
      "  - Core angle / thesis: the one claim or framing this piece should own",
      "  - Why this fits Art Flaneur: 2-3 lines using the product foundation above",
      "  - Key message hierarchy: one primary message and three supporting messages",
      "  - Proof / evidence / examples to include",
      "  - Structure / outline (carousel = slide-by-slide; article = headings; email = subject + body; script = timed beats)",
      "  - CTA appropriate to the stage",
      "  - Distribution notes for the selected channel and format",
      "  - What to avoid so the writer does not drift off-persona, off-stage, or off-topic",
      "  - Success signal: what a marketer would watch to judge whether the asset worked",
      "  - Target length or duration",
      "After the JSON line, write only a 1-2 sentence summary of what was generated. Do NOT repeat the full briefs outside the JSON. The dashboard will use briefContent from the JSON as the source of truth."
    ].filter(Boolean);
    weeklyFocus.textContent = targetFormat
      ? `Draft a ${stage.toLowerCase()} brief for ${targetFormat.format}.`
      : `Draft a ${stage.toLowerCase()} brief for ${persona}.`;
    runAiButton.textContent = targetFormat ? `Run brief for ${targetFormat.channel}` : "Run content brief";
  }

  if (task?.id === "full-draft") {
    const sourceItem = activeAiSourceItemId ? findContentItemById(activeAiSourceItemId)?.item || null : null;
    const existingBriefContent = sourceItem?.briefContent || Object.values(dashboardData.pipeline)
      .flat()
      .find((item) => isPersonaMatch(item.persona) && isStageMatch(item.stage) && item.briefContent)
      ?.briefContent || null;

    const targetFormat = selectedFormatPair || formatPairs[0] || null;
    const selectedFormatLabel = targetFormat ? `${targetFormat.format} - ${targetFormat.channel}` : "";
    const siblingFormatsText = targetFormat
      ? formatPairs
        .filter((pair) => formatPairKey(pair) !== formatPairKey(targetFormat))
        .map((pair) => `${pair.format} - ${pair.channel}`)
        .join(" | ")
      : "";
    const jsonItems = targetFormat
      ? `{"title":"...","persona":"${persona}","stage":"${stage}","status":"Draft","format":"${targetFormat.format}","channel":"${targetFormat.channel}","briefContent":"FULL DRAFT IN MARKDOWN WITH ESCAPED NEWLINES"}`
      : "";

    promptLines = [
      "You are a senior content writer working for Art Flaneur.",
      punctuationRule,
      ...productFoundationLines,
      `Target persona: ${persona}.`,
      `Target buyer's journey stage: ${stageBadge}.`,
      `Methodology mapping for this request: ${stage} = ${stageMotion}.`,
      `Primary cluster: ${clusterTitle}.`,
      `Cluster summary: ${clusterSummary}`,
      "Cluster structure rule: the cluster title is the topic, and the saved subtopics are supporting angles under that topic.",
      ...personaPromptLines,
      ...clusterPromptLines,
      formatsText ? `Content formats available for this persona:\n${formatsText}` : "",
      selectedFormatLabel ? `Selected format for this draft: ${selectedFormatLabel}.` : "",
      siblingFormatsText ? `Other formats available for this same persona and stage: ${siblingFormatsText}.` : "",
      sourceItem ? `Source pipeline brief: ${sourceItem.title}. Use this exact brief as the drafting source.` : "",
      existingBriefContent
        ? `Brief to expand:\n${existingBriefContent.slice(0, 1400)}`
        : "No saved brief yet. Build each draft directly from the cluster summary and persona context.",
      `Stage tone for every draft: ${stageGuidance}`,
      `IMPORTANT: Start your response with ONLY this JSON line (fill in real titles), wrapped in <app-data></app-data> — do NOT omit it:`,
      `<app-data>{"type":"content-brief","contentItems":[\n    ${jsonItems}\n  ]}</app-data>`,
      "CRITICAL JSON RULE: For each contentItems entry, write the FULL draft inside briefContent as a JSON string. Escape line breaks as \\n and escape any quotes inside the content.",
      targetFormat ? `Write one complete publication-ready draft for this format only: ${targetFormat.format} — ${targetFormat.channel}.` : "No format selected.",
      "This draft must stay native to the selected format and channel while remaining consistent with the broader multi-format stage plan for this persona.",
      "Do not collapse the jobs of the sibling formats into this one draft. Let the selected format do its own job well.",
      "Structural rules per format type:",
      "  - Instagram carousel (10 slides): Slide 1 = hook/title, Slides 2–9 = one point each (max 30 words), Slide 10 = CTA.",
      "  - Instagram caption: strong first line, body 150–220 words, 3–5 hashtags.",
      "  - Instagram Reel script: hook (first 3 sec), 3 points (10–15 sec each), close with CTA. 60–90 sec total.",
      "  - LinkedIn long-form article: introduction, 4–6 section headings, 900–1200 words, CTA at end.",
      "  - LinkedIn post: strong opener, short paragraphs, 300–500 words, closing question or CTA.",
      "  - Nurture email: subject line, preheader, greeting, hook, 2–3 body paragraphs, CTA button label, sign-off.",
      "  - 3-part email sequence: label each email (Email 1 / 2 / 3), subject line + body for each.",
      "  - Blog article: engaging opening, 4–6 sections, 1000–1500 words, practical CTA.",
      "  - Pillar page section: 400–600 words, clear subheading, internal link notes.",
      "  - Downloadable guide / e-book: chapter headings, intro, 3–5 main sections, conclusion + CTA.",
      "  - Slide deck: title slide, agenda, 8–12 content slides (one point each), closing CTA slide.",
      "  - YouTube video script: intro hook, 4–6 segments with timestamps, outro CTA.",
      "  - YouTube Shorts script: hook (0–3s), 3 beats (10s each), CTA (last 5s).",
      "  - All formats: adapt to the persona's world; every section addresses a specific pain or goal.",
      "After the JSON line, write only a 1-2 sentence summary of what was generated. Do NOT repeat the full drafts outside the JSON. The dashboard will use briefContent from the JSON as the source of truth."
    ].filter(Boolean);

    weeklyFocus.textContent = targetFormat
      ? `Write a ${stage.toLowerCase()} draft for ${targetFormat.format}.`
      : `Write a ${stage.toLowerCase()} draft for ${persona}.`;
    runAiButton.textContent = targetFormat ? `Run draft for ${targetFormat.channel}` : "Run full draft";
  }

  promptOutput.value = promptLines.join("\n");
  syncTextPanels();

  // Update task chip in context bar
  if (aiContextTask) aiContextTask.textContent = task?.title || "Strategic plan";
}

function renderAiFormats() {
  const task = getActiveAiTask();
  const { formatPairs, selectedFormatPair } = getAiFormatContext(getAiTargetPersona(), task?.id);

  if (!aiFormatPanel || !aiFormatList) {
    return;
  }

  const shouldShow = isFormatScopedAiTask(task?.id) && formatPairs.length > 0;
  aiFormatPanel.hidden = !shouldShow;

  if (aiFormatSelect && aiFormatSep) {
    aiFormatSelect.hidden = !shouldShow;
    aiFormatSep.hidden = !shouldShow;
  }

  if (!shouldShow) {
    aiFormatList.innerHTML = "";
    if (aiFormatSelect) {
      aiFormatSelect.innerHTML = "";
    }
    return;
  }

  const selectedKey = selectedFormatPair ? formatPairKey(selectedFormatPair) : "";

  if (aiFormatSelect) {
    aiFormatSelect.innerHTML = formatPairs
      .map((pair) => renderOption(formatPairKey(pair), `${pair.format} - ${pair.channel}`))
      .join("");
    aiFormatSelect.value = selectedKey;
  }

  aiFormatList.innerHTML = formatPairs
    .map((pair) => {
      const key = formatPairKey(pair);
      const isActive = selectedFormatPair && formatPairKey(selectedFormatPair) === key;
      return `
        <article class="stack-item ${isActive ? "is-active" : ""}">
          <button class="stack-action" type="button" data-ai-format-key="${escapeHtml(key)}" aria-pressed="${isActive}">
            ${renderChannelPill(pair.channel, { className: "channel-pill--inline channel-pill--stack", href: null })}
            <span class="stack-title">${escapeHtml(pair.format)}</span>
            <span class="stack-copy">${escapeHtml(isActive ? "Selected for the next AI run." : "Click to target only this format.")}</span>
          </button>
        </article>
      `;
    })
    .join("");
}

function renderHints() {
  learningGrid.innerHTML = dashboardData.hints
    .map(
      (hint) => `
        <article class="hint-card">
          <p class="card-label eyebrow">Hint</p>
          <h4 class="hint-title">${escapeHtml(hint.title)}</h4>
          <p class="hint-copy">${escapeHtml(hint.body)}</p>
        </article>
      `
    )
    .join("");

  aiTaskList.innerHTML = dashboardData.aiTasks
    .map(
      (task) => `
        <article class="stack-item ${task.id === activeAiTaskId ? "is-active" : ""}">
          <button class="stack-action" type="button" data-ai-task="${escapeHtml(task.id)}" aria-pressed="${task.id === activeAiTaskId}">
            <span class="card-label eyebrow">AI action</span>
            <span class="stack-title">${escapeHtml(task.title)}</span>
            <span class="stack-copy">${escapeHtml(task.body)}</span>
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
  renderAiFormats();
  buildPrompt();
  updateApplyState();
}

function showSection(sectionId) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.section === sectionId);
  });

  sections.forEach((section) => {
    const shouldShow = section.id === sectionId;
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

  if (activeAiPersona === persona.name) {
    activeAiPersona = null;
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
    subtopics: splitList(formData.get("subtopics").toString()),
    questions: splitQuestionList(formData.get("questions"))
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

function saveBrandFoundation(event) {
  event.preventDefault();

  dashboardData.productFoundation = normalizeProductFoundation({
    description: productDescriptionInput.value,
    mission: productMissionInput.value,
    valueProposition: productValuePropInput.value,
    proofPoints: splitList(productProofPointsInput.value),
    goldenCircle: {
      why: goldenCircleWhyInput.value,
      how: goldenCircleHowInput.value,
      what: goldenCircleWhatInput.value
    }
  });

  saveState();
  renderAll();
  setAiStatus("Brand foundations saved", "success");
  showSection("overview");
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

    const payload = await readJsonResponse(response);

    if (!response.ok) {
      throw new Error(payload.error || "Model request failed.");
    }

    const parsed = extractAppData(payload.text || "");
    aiResponse.value = getStructuredAiDisplayText(parsed.appData, parsed.displayText || payload.text || "No text returned.");
    syncTextPanels();

    // Diagnose why appData might be null
    const rawText = payload.text || "";
    const hasTag = /<app-data>/i.test(rawText);
    const hasCloseTag = /<\/app-data>/i.test(rawText);
    if (hasTag && hasCloseTag && !parsed.appData) {
      const rawMatch = rawText.match(/<app-data>\s*([\s\S]*?)\s*<\/app-data>/i);
      console.warn("[extractAppData] Parse failed. Raw inside tags:", rawMatch?.[1]?.slice(0, 400));
      setAiStatus("JSON inside <app-data> could not be parsed — check console", "error");
    } else if (!hasTag) {
      console.warn("[runAiPlan] No <app-data> tag in response. First 300 chars:", rawText.slice(0, 300));
      setAiStatus("Model returned text but no <app-data> tag — prompt may need re-running", "error");
    }

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
    updateApplyState();
    if (parsed.appData) {
      setAiStatus(`${task?.title || "Task"} via ${payload.providerMode}`, "success");
    } else {
      setAiStatus("Model returned text, but structured result could not be parsed", "error");
    }
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
  activeAiSourceItemId = null;
  activeAiPersona = null;
  activeAiClusterKey = null;
  renderAll();
});

stageFilter.addEventListener("change", (event) => {
  selectedFilters.stage = event.target.value;
  activeAiSourceItemId = null;
  activeAiStage = null;
  activeAiClusterKey = null;
  renderAll();
});

aiQuickAction?.addEventListener("click", () => {
  activeAiTaskId = "strategy-plan";
  activeAiSourceItemId = null;
  activeAiPersona = null;
  activeAiStage = null;
  activeAiClusterKey = null;
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
  activeAiSourceItemId = null;
  activeAiClusterKey = null;
  renderHints();
  renderAiFormats();
  buildPrompt();
  showSection("ai");
  setAiStatus(`${getActiveAiTask()?.title || "Prompt"} ready`);
});

aiFormatList?.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-ai-format-key]");

  if (!trigger) {
    return;
  }

  activeAiFormatKey = trigger.dataset.aiFormatKey;
  renderAiFormats();
  buildPrompt();
  showSection("ai");
  setAiStatus("Format target updated", "success");
});

aiFormatSelect?.addEventListener("change", (event) => {
  activeAiFormatKey = event.target.value;
  renderAiFormats();
  buildPrompt();
  showSection("ai");
  setAiStatus("Format target updated", "success");
});

workflowGuide.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-jump-section]");

  if (!trigger) {
    return;
  }

  showSection(trigger.dataset.jumpSection);
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
brandFoundationForm?.addEventListener("submit", saveBrandFoundation);
calendarForm.addEventListener("submit", addCalendarEntry);
channelForm.addEventListener("submit", addChannel);
editClusterForm.addEventListener("submit", saveEditCluster);

clusterGrid.addEventListener("click", (event) => {
  const mineTrigger = event.target.closest("[data-mine-cluster]");
  if (mineTrigger) {
    openQuestionMiningFromCluster(mineTrigger.dataset.mineCluster);
    return;
  }

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

  const draftTrigger = event.target.closest("[data-draft-from-brief]");
  if (draftTrigger) {
    const found = findContentItemById(draftTrigger.dataset.draftFromBrief);
    if (!found) return;
    setAiDraftContextFromItem(found.item);
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
openBriefInAiButton?.addEventListener("click", openBriefInAiStudio);
briefContentEditor?.addEventListener("input", () => {
  const found = activeBriefEdit ? findContentItemById(activeBriefEdit.id) : null;
  renderBriefSummary(found?.item || null);
});
briefFormat?.addEventListener("input", () => {
  const found = activeBriefEdit ? findContentItemById(activeBriefEdit.id) : null;
  renderBriefSummary(found?.item || null);
});
briefChannel?.addEventListener("input", () => {
  const found = activeBriefEdit ? findContentItemById(activeBriefEdit.id) : null;
  renderBriefSummary(found?.item || null);
  renderBriefChannelActions(found?.item || null);
});

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