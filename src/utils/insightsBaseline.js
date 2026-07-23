function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

const ANALYTICS_REFERENCE_NOW = new Date("2026-07-23T12:00:00Z");
const THIRTY_DAY_MS = 30 * 24 * 60 * 60 * 1000;

function average(values) {
  const nums = values.filter((value) => Number.isFinite(Number(value))).map(Number);
  if (!nums.length) return 0;
  return nums.reduce((sum, value) => sum + value, 0) / nums.length;
}

function formatChartLabel(baseDate, offsetDays) {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + offsetDays);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

function buildViewsOverTime(finalViews, typicalViews, timestamp) {
  const reelTarget = Math.max(0, Math.round(finalViews || 0));
  const typicalTarget = Math.max(0, Math.round(typicalViews || 0));
  const baseDate = timestamp ? new Date(timestamp) : new Date("2026-06-28T00:00:00Z");
  const reelFractions = [0.02, 0.08, 0.19, 0.37, 0.59, 0.81, 1];
  const typicalFractions = [0.06, 0.16, 0.29, 0.45, 0.62, 0.79, 1];

  return reelFractions.map((fraction, index) => ({
    label: formatChartLabel(baseDate, -12 + index * 2),
    thisReel: Math.round(reelTarget * fraction),
    typicalReel: Math.round(typicalTarget * typicalFractions[index]),
  }));
}

function buildRetentionCurve({ videoDuration, viralityRatio, likeRate }) {
  const base = [100, 87, 74, 64, 56, 48, 40, 31, 23, 15, 8];
  const retentionBoost = clamp((viralityRatio - 1) * 6 + likeRate * 120, -8, 12);
  const durationPenalty = clamp((videoDuration - 18) * 0.35, -4, 7);

  return base.map((value, index) => {
    const taperedBoost = retentionBoost - index * 0.9 - durationPenalty;
    const adjusted = index === 0 ? 100 : Math.round(clamp(value + taperedBoost, 2, 98));
    return index === 0 ? 100 : Math.min(adjusted, base[index - 1] + 2);
  });
}

function buildEngagementCurve({ viralityRatio, commentRate }) {
  const base = [
    11.4, 10.6, 9.2, 8.1, 7.3, 6.8, 6.2, 5.7, 5.2, 4.8, 4.3, 3.9,
    3.6, 3.3, 3.0, 2.7, 2.5, 2.3, 2.1, 1.9, 1.7, 1.5, 1.3, 1.1,
  ];
  const spike = clamp((viralityRatio - 1) * 1.6 + commentRate * 260, -1.2, 3.2);

  return base.map((value, index) => {
    const weightedSpike = spike * Math.max(0, 1 - index / 10);
    return Number(clamp(value + weightedSpike, 0.2, 20).toFixed(1));
  });
}

function parseTimestamp(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function filterReelsWithinLast30Days(sourceReels = [], referenceDate = ANALYTICS_REFERENCE_NOW) {
  const reels = Array.isArray(sourceReels) ? sourceReels.filter(Boolean) : [];
  return reels.filter((item) => {
    const timestamp = parseTimestamp(item?.timestamp);
    if (!timestamp) {
      return false;
    }
    const delta = referenceDate.getTime() - timestamp.getTime();
    return delta >= 0 && delta <= THIRTY_DAY_MS;
  });
}

export function summarizeReels(sourceReels = []) {
  const reels = Array.isArray(sourceReels) ? sourceReels.filter(Boolean) : [];
  const totals = reels.reduce(
    (acc, item) => {
      acc.views += Number(item?.viewCount || item?.views || 0) || 0;
      acc.likes += Number(item?.likesCount || item?.likes || 0) || 0;
      acc.comments += Number(item?.commentsCount || item?.comments || 0) || 0;
      acc.shares += Number(item?.sharesCount || item?.shares || 0) || 0;
      acc.saves += Number(item?.savesCount || item?.saves || 0) || 0;
      return acc;
    },
    { views: 0, likes: 0, comments: 0, shares: 0, saves: 0 }
  );

  const sorted = [...reels].sort(
    (a, b) => (Number(b?.viewCount || b?.views || 0) || 0) - (Number(a?.viewCount || a?.views || 0) || 0)
  );
  const top3Views = sorted
    .slice(0, 3)
    .reduce((sum, item) => sum + (Number(item?.viewCount || item?.views || 0) || 0), 0);

  return {
    count: reels.length,
    ...totals,
    top3Views,
    top3Reels: sorted.slice(0, 3),
  };
}

export function buildHistoricalInsightsBaseline(selectedPost, sourceReels = []) {
  const reels = Array.isArray(sourceReels) ? sourceReels.filter(Boolean) : [];
  const selectedId = selectedPost?.id || selectedPost?.shortCode || selectedPost?.thumbnailUri || null;
  const peerReels = reels.filter((item) => {
    const itemId = item?.id || item?.shortCode || item?.thumbnailUri || null;
    return itemId !== selectedId;
  });
  const history = peerReels.length ? peerReels : reels;

  const selectedViews = Number(selectedPost?.views ?? selectedPost?.viewCount) || 0;
  const selectedLikes = Number(selectedPost?.likes ?? selectedPost?.likesCount) || 0;
  const selectedComments = Number(selectedPost?.comments ?? selectedPost?.commentsCount) || 0;
  const videoDuration = clamp(Math.round(Number(selectedPost?.videoDuration) || 18), 6, 45);

  const avgViews = average(history.map((item) => item?.viewCount || item?.views || 0)) || Math.max(selectedViews, 1);
  const avgLikes = average(history.map((item) => item?.likesCount || item?.likes || 0)) || Math.max(selectedLikes, 1);
  const avgComments = average(history.map((item) => item?.commentsCount || item?.comments || 0)) || Math.max(selectedComments, 1);

  const viralityRatio = clamp(selectedViews / Math.max(avgViews, 1), 0.55, 2.8);
  const likeRate = selectedLikes / Math.max(selectedViews, 1);
  const commentRate = selectedComments / Math.max(selectedViews, 1);

  const saveRate = viralityRatio > 1.2 ? 0.0105 : 0.0052;
  const saves = Math.max(1, Math.round(selectedViews * (saveRate + Math.min(likeRate, 0.04) * 0.18)));
  const sharesMultiplier = clamp(1.08 + Math.min(viralityRatio, 2.2) * 0.18, 1.1, 1.48);
  const shares = Math.max(1, Math.round(saves * sharesMultiplier));
  const engagedAccounts = selectedLikes + selectedComments + saves + shares;
  const accountsReached = Math.max(
    engagedAccounts + 1,
    Math.min(selectedViews - 1, Math.round(selectedViews * clamp(0.86 + viralityRatio * 0.025, 0.86, 0.93)))
  );
  const profileVisits = Math.max(0, Math.round(shares * 1.2 + saves * 0.8));
  const follows = Math.max(0, Math.round(profileVisits * clamp(0.055 + (viralityRatio - 1) * 0.02, 0.05, 0.12)));
  const followersPercent = Number(clamp(22 - (viralityRatio - 1) * 18, 1.2, 24.5).toFixed(1));

  const topSources =
    viralityRatio > 1.25
      ? [
          { name: "Reels tab", value: 77.4 },
          { name: "Feed", value: 11.8 },
          { name: "Explore", value: 8.1 },
          { name: "Other", value: 2.7 },
        ]
      : [
          { name: "Reels tab", value: 71.6 },
          { name: "Feed", value: 14.3 },
          { name: "Explore", value: 8.4 },
          { name: "Other", value: 5.7 },
        ];

  return {
    thumbnailUri: selectedPost?.thumbnailUri || selectedPost?.videoUrl || null,
    views: selectedViews,
    likes: selectedLikes,
    comments: selectedComments,
    reposts: 0,
    saves,
    shares,
    accountsReached,
    follows,
    profileVisits,
    avgWatchTime: `${clamp(Math.round(videoDuration * clamp(0.34 + viralityRatio * 0.08, 0.28, 0.58)), 4, videoDuration)}s`,
    followersPercent,
    topSources,
    viewsOverTime: buildViewsOverTime(selectedViews, Math.max(avgViews, selectedViews * 0.58), selectedPost?.timestamp),
    retentionPoints: buildRetentionCurve({ videoDuration, viralityRatio, likeRate }),
    engagementPoints: buildEngagementCurve({ viralityRatio, commentRate }),
    videoDuration,
    historySummary: {
      reelsAnalyzed: history.length,
      avgViews: Math.round(avgViews),
      avgLikes: Math.round(avgLikes),
      avgComments: Math.round(avgComments),
      selectedViews,
      selectedLikes,
      selectedComments,
      viralityRatio: Number(viralityRatio.toFixed(2)),
    },
  };
}

export function buildHistoricalPromptContext(profile, selectedPost, sourceReels = []) {
  const history = buildHistoricalInsightsBaseline(selectedPost, sourceReels);
  const caption = selectedPost?.caption || "";
  const loadedReels = Array.isArray(sourceReels) ? sourceReels.filter(Boolean) : [];
  const recent30DayReels = filterReelsWithinLast30Days(loadedReels);
  const loadedSummary = summarizeReels(loadedReels);
  const recentSummary = summarizeReels(recent30DayReels);

  return [
    `Loaded account: @${profile?.username || selectedPost?.username || "unknown"}`,
    `Reference date for 30-day analytics: 2026-07-23`,
    `Current dashboard views card: ${profile?.dashboardViews || 0}`,
    `Loaded all-post count: ${loadedSummary.count}`,
    `Loaded all-post total views: ${loadedSummary.views}`,
    `Loaded all-post total likes: ${loadedSummary.likes}`,
    `Loaded all-post total comments: ${loadedSummary.comments}`,
    `Loaded last-30-day post count: ${recentSummary.count}`,
    `Loaded last-30-day total views: ${recentSummary.views}`,
    `Loaded last-30-day total likes: ${recentSummary.likes}`,
    `Loaded last-30-day total comments: ${recentSummary.comments}`,
    `Loaded last-30-day top 3 reel views: ${recentSummary.top3Views}`,
    `Selected reel views: ${history.historySummary.selectedViews}`,
    `Selected reel likes: ${history.historySummary.selectedLikes}`,
    `Selected reel comments: ${history.historySummary.selectedComments}`,
    `Historical reels analyzed: ${history.historySummary.reelsAnalyzed}`,
    `Historical avg views: ${history.historySummary.avgViews}`,
    `Historical avg likes: ${history.historySummary.avgLikes}`,
    `Historical avg comments: ${history.historySummary.avgComments}`,
    `Virality ratio vs history: ${history.historySummary.viralityRatio}`,
    caption ? `Selected reel caption: ${caption}` : "",
    `Use ALL loaded posts as account grounding.`,
    `Use ONLY posts within the last 30 days when generating 30-day dashboard totals and trends.`,
    `Make dashboard reach, engagement, followers split, and graphs internally consistent with the last-30-day post set.`,
  ]
    .filter(Boolean)
    .join("\n");
}
