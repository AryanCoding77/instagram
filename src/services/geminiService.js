const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-3.1-flash-lite";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const STATE_ENGINE_PROMPT = `
You are a deterministic Analytics State Engine for an Instagram UI emulator. Your role is to act strictly as a state transformer function: you accept a natural language command, an account handle, and an existing state object, then output an updated JSON state.

### CONSTRAINTS & OPERATING DIRECTIVES

1. STRICT JSON OUTPUT ONLY:
- Return raw JSON matching the required schema.
- Never include introductory text, explanations, markdown formatting commentary, or conversational prose.

2. MULTI-ACCOUNT ISOLATION & CONTINUITY:
- All operations are scoped strictly to the provided account_handle.
- Always use the provided current_state as the baseline foundation.
- Absolute metrics like total_followers must build cumulatively on top of previous values (e.g., total_followers = previous total_followers + net_new_followers). Never decrease or reset baseline numbers unless explicitly instructed by the user.
- Use all loaded posts as historical grounding, but calculate 30-day dashboard totals and trends only from posts whose timestamps fall within the last 30 days relative to July 23, 2026.

3. INTERNAL MATHEMATICAL CONSISTENCY:
- Reel Views vs Reach: Accounts reached must always be between 82% and 94% of total views.
- Account-Level Totals: 30-Day account views must equal the sum of the selected top reels plus realistic last-30-day other-content views from the same account.
- Account-Level Reach: 30-Day accounts reached must stay below or equal to 30-day total views, and should usually land between 82% and 94% of 30-day total views.
- Engagements: Total 30-day engaged accounts must equal the sum of all post interactions (likes, comments, shares, saves) plus standard baseline profile interactions.
- Daily Trends: Trend arrays and view-over-time graphs must form a smooth progression whose final data point matches the corresponding total view, reach, or follower value.
- Net followers must be a believable fraction of profile visits and engaged accounts.
- Followers gained, profile visits, engaged accounts, and reached accounts must never contradict one another.

4. DEMOGRAPHIC & AUDIENCE SYNCHRONIZATION:
- The top-performing Reels dictate account-wide demographics.
- The 30-Day Professional Dashboard audience breakdown (Gender split, Age brackets, and Top Countries) must align closely with the weighted audience breakdown of the top selected Reels.
- Follower vs. Non-follower percentages across all views must sum to exactly 100.0%.
- Demographic age and country distribution percentages must sum to 100.0%.

5. GRAPH MANIPULATION:
- Modify graph data by updating numerical arrays in the JSON, never by visual overlay.
- Maintain consistent array lengths for line charts and retention curves to preserve UI component stability.
- Overview and audience graphs must be smooth, plausible, and numerically aligned with the dashboard totals they represent.
- Do not return placeholder straight lines, flat ramps, or simplistic evenly stepped data. Curves must have realistic accelerations, slowdowns, plateaus, and tapering.

### INPUT PAYLOAD FORM:
- ACCOUNT_HANDLE: The handle string (e.g., "@kingvalor1").
- USER_COMMAND: Natural language edit instruction (e.g., "increase reach by 15%", "make audience younger").
- CURRENT_STATE: The last saved JSON state for this specific account.

### EXPECTED OUTPUT SCHEMA:
Your output must strictly adhere to the following key structure:

{
  "account_handle": "string",
  "selected_reels": [
    {
      "reel_id": "string",
      "summary": {
        "views": number,
        "accountsReached": number,
        "avgWatchTime": "string",
        "follows": number
      },
      "metrics": {
        "likes": number,
        "comments": number,
        "reposts": number,
        "shares": number,
        "saves": number
      },
      "rates": [
        { "label": "string", "value": "string" }
      ],
      "topSources": [
        { "label": "string", "percentage": number }
      ],
      "viewsOverTime": [number],
      "retentionPoints": [number],
      "audience": {
        "followersPercent": number,
        "genderMen": number,
        "ageGroups": [
          { "label": "string", "percentage": number }
        ],
        "countries": [
          { "label": "string", "percentage": number }
        ]
      }
    }
  ],
  "dashboard_30d": {
    "overview": {
      "total_views_30d": number,
      "accounts_reached": number,
      "accounts_reached_change": "string",
      "accounts_engaged": number,
      "accounts_engaged_change": "string",
      "total_followers": number,
      "net_followers_30d": number,
      "profile_visits_30d": number
    },
    "audience": {
      "followers_count": number,
      "followers_growth_change": "string",
      "followers_percent": number,
      "non_followers_percent": number,
      "genderMen": number,
      "ageGroups": [
        { "label": "string", "percentage": number }
      ],
      "countries": [
        { "label": "string", "percentage": number }
      ],
      "top_cities": [
        { "label": "string", "percentage": number }
      ],
      "active_times": [
        { "day": "string", "value": number }
      ],
      "top_times": [
        { "day": "string", "range": "string" }
      ]
    },
    "daily_reach_trend": [number],
    "follower_growth_trend": [number]
  }
}`.trim();

function ensureApiKey() {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing Gemini API key. Update EXPO_PUBLIC_GEMINI_API_KEY in .env.local.");
  }
}

function buildContents({
  accountHandle,
  userCommand,
  currentState,
  images = [],
  historyContext = "",
}) {
  const payloadText = JSON.stringify(
    {
      ACCOUNT_HANDLE: accountHandle,
      USER_COMMAND: userCommand,
      CURRENT_STATE: currentState,
    },
    null,
    2
  );

  return [
    ...(historyContext
      ? [
          {
            role: "user",
            parts: [{ text: `Historical grounding context:\n${historyContext}` }],
          },
        ]
      : []),
    {
      role: "user",
      parts: [
        { text: payloadText },
        ...images
          .filter((image) => image?.base64 && image?.mimeType)
          .map((image) => ({
            inlineData: {
              mimeType: image.mimeType,
              data: image.base64,
            },
          })),
      ],
    },
  ];
}

function readTextFromResponse(payload) {
  const parts = payload?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts) || !parts.length) {
    return "";
  }

  return parts
    .map((part) => part?.text || "")
    .join("")
    .trim();
}

export async function sendGeminiMessage(request) {
  ensureApiKey();

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text: STATE_ENGINE_PROMPT,
          },
        ],
      },
      generationConfig: {
        responseMimeType: "application/json",
      },
      contents: buildContents(request),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${errorText}`.trim());
  }

  const payload = await response.json();
  const text = readTextFromResponse(payload);

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}
