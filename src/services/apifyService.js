import { ACTORS, APIFY_BASE, APIFY_TOKEN } from "../constants/apify";

function pickFirst(source, keys) {
  for (const key of keys) {
    const value = key.includes(".")
      ? key.split(".").reduce((acc, part) => acc?.[part], source)
      : source?.[key];
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
}

function parseCountValue(value) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "object") {
    const nested = pickFirst(value, ["count", "value", "views", "playCount", "videoPlayCount"]);
    return parseCountValue(nested);
  }

  const raw = String(value).trim().replace(/,/g, "");
  if (!raw) return 0;

  const suffix = raw.slice(-1).toUpperCase();
  const numeric = parseFloat(raw.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(numeric)) return 0;

  if (suffix === "K") return Math.round(numeric * 1000);
  if (suffix === "M") return Math.round(numeric * 1000000);
  if (suffix === "B") return Math.round(numeric * 1000000000);
  return Math.round(numeric);
}

function pickCount(source, keys) {
  const value = pickFirst(source, keys);
  return parseCountValue(value);
}

function normalizePosts(posts = []) {
  return posts
    .filter(Boolean)
    .map((item, idx) => {
      const displayUrl =
        pickFirst(item, ["displayUrl", "thumbnailSrc", "thumbnailUrl", "imageUrl", "mediaUrl"]) || "";
      const videoUrl = pickFirst(item, ["videoUrl", "video_url", "mediaUrl"]) || null;
      const isVideo =
        Boolean(videoUrl) ||
        ["video", "reel", "GraphVideo"].includes(String(pickFirst(item, ["type", "post_type", "mediaType"])).toLowerCase());

      return {
        id: pickFirst(item, ["id", "shortCode", "shortcode"]) || String(idx),
        thumbnailUri: displayUrl || videoUrl || "",
        videoUrl: isVideo ? videoUrl || displayUrl || null : null,
        viewCount: pickCount(item, [
          "videoViewCount",
          "video_view_count",
          "views",
          "videoViews",
          "video_views",
          "viewsCount",
          "views_count",
          "playCount",
          "play_count",
          "ig_play_count",
          "videoPlayCount",
          "video_play_count",
          "view_count",
          "viewCount",
        ]),
        likesCount: pickCount(item, ["likesCount", "likeCount", "like_count"]),
        commentsCount: pickCount(item, ["commentsCount", "commentCount", "comment_count"]),
        caption: pickFirst(item, ["caption", "description"]) || "",
        shortCode: pickFirst(item, ["shortCode", "shortcode"]) || "",
        timestamp: pickFirst(item, ["timestamp", "taken_at", "takenAt", "pub_date"]) || "",
        username: pickFirst(item, ["ownerUsername", "owner_username", "username"]) || "",
        displayName: pickFirst(item, ["ownerFullName", "owner_full_name", "fullName"]) || "",
      };
    })
    .filter((item) => item.thumbnailUri);
}

function normalizeHighlights(highlights = []) {
  return highlights
    .filter(Boolean)
    .map((item, idx) => ({
      id: pickFirst(item, ["id", "highlightId", "storyId"]) || String(idx),
      title: pickFirst(item, ["title", "highlightTitle", "name"]) || "",
      coverUrl: pickFirst(item, ["coverUrl", "thumbnailUrl", "mediaUrl", "displayUrl"]) || "",
    }))
    .filter((item) => item.coverUrl);
}

function ensureToken() {
  if (!APIFY_TOKEN || APIFY_TOKEN.includes("YOUR_APIFY_API_TOKEN_HERE")) {
    throw new Error("Invalid Apify token. Update EXPO_PUBLIC_APIFY_TOKEN in .env.local.");
  }
}

async function runAndWait(actorId, input, maxWaitMs = 120000, pollIntervalMs = 3000) {
  ensureToken();
  console.log("[Apify] start actor", { actorId, input, maxWaitMs, pollIntervalMs });

  const startRes = await fetch(`${APIFY_BASE}/acts/${actorId}/runs?token=${APIFY_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!startRes.ok) {
    console.log("[Apify] failed to start actor", { actorId, status: startRes.status });
    throw new Error(`Failed to start actor: ${startRes.status}`);
  }

  const startData = await startRes.json();
  const runId = startData?.data?.id;
  if (!runId) {
    console.log("[Apify] actor returned no run id", { actorId, startData });
    throw new Error("Actor did not return a run id.");
  }

  console.log("[Apify] actor started", { actorId, runId });
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));

    const statusRes = await fetch(`${APIFY_BASE}/actor-runs/${runId}?token=${APIFY_TOKEN}`);
    if (!statusRes.ok) {
      console.log("[Apify] failed to check actor status", { actorId, runId, status: statusRes.status });
      throw new Error(`Failed to check actor status: ${statusRes.status}`);
    }

    const statusData = await statusRes.json();
    const status = statusData?.data?.status;
    console.log("[Apify] actor status", { actorId, runId, status });

    if (status === "SUCCEEDED") {
      const datasetId = statusData?.data?.defaultDatasetId;
      if (!datasetId) {
        console.log("[Apify] actor succeeded without dataset", { actorId, runId });
        return [];
      }

      const itemsRes = await fetch(
        `${APIFY_BASE}/datasets/${datasetId}/items?token=${APIFY_TOKEN}&format=json`
      );
      if (!itemsRes.ok) {
        console.log("[Apify] failed to fetch dataset items", {
          actorId,
          runId,
          datasetId,
          status: itemsRes.status,
        });
        throw new Error(`Failed to fetch dataset items: ${itemsRes.status}`);
      }
      const items = await itemsRes.json();
      console.log("[Apify] dataset loaded", { actorId, runId, datasetId, count: items.length });
      return items;
    }

    if (status === "FAILED" || status === "ABORTED" || status === "TIMED-OUT") {
      console.log("[Apify] actor ended unsuccessfully", { actorId, runId, status });
      throw new Error(`Actor run ${status.toLowerCase()} for ${actorId}`);
    }
  }

  console.log("[Apify] actor timed out", { actorId, maxWaitMs });
  throw new Error(`Actor timed out after ${maxWaitMs}ms`);
}

export async function fetchInstagramProfile(username) {
  const items = await runAndWait(ACTORS.profile, { usernames: [username] });
  if (!items.length) {
    throw new Error("No profile data returned");
  }

  const profile = items[0];
  const latestPosts = normalizePosts(
    pickFirst(profile, ["latestPosts", "latest_posts", "recent_posts", "recentPosts"]) || []
  );
  const highlights = normalizeHighlights(pickFirst(profile, ["highlights", "highlightReels"]) || []);
  const noteText = pickFirst(profile, [
    "noteText",
    "note",
    "profileNote",
    "profile_note",
    "threadsNote",
  ]);
  const threadsLabel = pickFirst(profile, [
    "threadsLabel",
    "threadsUsername",
    "threads_handle",
    "threadsHandle",
    "threads",
  ]);

  return {
    profilePicUrl: profile.profilePicUrl || profile.profilePicUrlHD || "",
    fullName: profile.fullName || username,
    biography: profile.biography || "",
    followersCount: profile.followersCount || 0,
    followsCount: profile.followsCount || 0,
    postsCount: profile.postsCount || 0,
    externalUrl: profile.externalUrl || "",
    verified: profile.verified || false,
    noteText: typeof noteText === "string" ? noteText : "",
    threadsLabel: typeof threadsLabel === "string" ? threadsLabel : "",
    latestPosts,
    highlights,
  };
}

export async function fetchInstagramReels(username) {
  const items = await runAndWait(ACTORS.reels, {
    dataDetailLevel: "detailedData",
    resultsLimit: 12,
    skipPinnedPosts: false,
    username: [username],
  });

  return items.map((item, idx) => ({
    id: item.id || item.shortCode || String(idx),
    thumbnailUri: item.displayUrl || item.thumbnailUrl || item.videoUrl || "",
    videoUrl: item.videoUrl || null,
    viewCount: pickCount(item, [
      "videoPlayCount",
      "video_play_count",
      "videoViewCount",
      "video_view_count",
      "views",
      "videoViews",
      "video_views",
      "viewsCount",
      "views_count",
      "playCount",
      "play_count",
      "ig_play_count",
      "view_count",
      "viewCount",
    ]),
    likesCount: pickCount(item, ["likesCount", "likeCount", "like_count"]),
    commentsCount: pickCount(item, ["commentsCount", "commentCount", "comment_count"]),
    caption: item.caption || "",
    shortCode: item.shortCode || "",
    timestamp: item.timestamp || "",
    username: item.ownerUsername || item.username || "",
    displayName: item.ownerFullName || item.fullName || "",
  }));
}
