import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { buildHistoricalInsightsBaseline } from "../utils/insightsBaseline";
import { publishSelectedPostSync } from "../utils/reelSyncBus";

const STORAGE_KEY = "@reelInsights:data";

export const DEFAULT_DATA = {
  currentScreen: "home",
  screenHistory: [],
  selectedPostUri: null,
  selectedPostIndex: 0,
  selectedPostData: null,
  isEditing: false,
  thumbnailUri: null,
  likes: 662,
  comments: 15,
  reposts: 22,
  shares: 921,
  saves: 53,
  views: 11891,
  followersCount: 6960,
  followersGrowthChange: "+5.9%",
  netFollowers: 386,
  interactions: 50109,
  accountsReached: 9601,
  contentTypeBreakdown: [
    { label: "Reels", value: 101 },
    { label: "Stories", value: 28 },
    { label: "Posts", value: 0 },
    { label: "Live videos", value: 0 },
  ],
  profileActivity: [
    { label: "Profile visits", value: 74 },
    { label: "Bio link taps", value: 342 },
    { label: "Business address taps", value: 0 },
  ],
  avgWatchTime: "10s",
  follows: 10,
  viewsOverTime: [
    { label: "14 Jun", thisReel: 0, typicalReel: 0 },
    { label: "16 Jun", thisReel: 3200, typicalReel: 4800 },
    { label: "18 Jun", thisReel: 5500, typicalReel: 6000 },
    { label: "20 Jun", thisReel: 7000, typicalReel: 6500 },
    { label: "21 Jun", thisReel: 8800, typicalReel: 7000 },
    { label: "24 Jun", thisReel: 9200, typicalReel: 7200 },
    { label: "28 Jun", thisReel: 9400, typicalReel: 7500 },
  ],
  rates: [
    { key: "skip", icon: "clock", label: "Skip rate", value: 34.9 },
    { key: "share", icon: "send", label: "Share rate", value: 9.3 },
    { key: "like", icon: "heart", label: "Like rate", value: 6.7 },
    { key: "save", icon: "bookmark", label: "Save rate", value: 0.5 },
    { key: "repost", icon: "repeat-2", label: "Repost rate", value: 0.2 },
    { key: "comment", icon: "message-circle", label: "Comment rate", value: 0.2 },
  ],
  retentionPoints: [100, 88, 72, 62, 55, 50, 42, 33, 24, 14, 4],
  videoDuration: 23, // seconds
  engagementPoints: [
    11.0, 10.4, 5.6, 3.6, 4.4, 3.6, 5.0, 13.0, 9.4, 6.4, 5.6, 4.4,
    3.6, 3.0, 2.4, 2.0, 1.8, 2.2, 1.6, 1.2, 1.4, 1.0, 1.8, 2.0,
  ],
  topSources: [
    { name: "Reels tab", value: 70.1 },
    { name: "Feed", value: 14.1 },
    { name: "Explore", value: 8.7 },
  ],
  audienceGrowthPoints: [
    18, 10, 16, 12, 17, 15, 16, 23, 11, 13, 27, 12, 2, -8, 18, 32, 15, 8, 3, 1, 2, 1, 29, 9, 4, -11, 14,
  ],
  profileVisits: 74,
  followersPercent: 16.8,
  ageGroups: [
    { label: "13-17", value: 51.6 },
    { label: "18-24", value: 21.5 },
    { label: "25-34", value: 12.4 },
    { label: "35-44", value: 10.2 },
    { label: "45-54", value: 3.1 },
    { label: "55-64", value: 0.5 },
    { label: "65+", value: 0.6 },
  ],
  countries: [
    { name: "India", value: 94.0 },
    { name: "Brazil", value: 0.9 },
    { name: "Bangladesh", value: 0.8 },
    { name: "Pakistan", value: 0.7 },
    { name: "Türkiye", value: 0.5 },
  ],
  activeTimes: [
    { day: "Su", value: 1 },
    { day: "M", value: 48 },
    { day: "Tu", value: 72 },
    { day: "W", value: 88 },
    { day: "Th", value: 82 },
    { day: "F", value: 96 },
    { day: "Sa", value: 74 },
    { day: "Su", value: 62 },
  ],
  topTimes: [
    { day: "Wednesdays", range: "15-18" },
    { day: "Thursdays", range: "15-18" },
    { day: "Saturdays", range: "15-18" },
  ],
  topCities: [
    { name: "Lahore", value: 18.4 },
    { name: "Karachi", value: 12.7 },
    { name: "Mumbai", value: 8.9 },
    { name: "Johannesburg", value: 6.1 },
    { name: "Cape Town", value: 4.8 },
  ],
  genderMen: 96.6,
  genderWomen: 14.4,
  selectedReelsInsights: [],
};

const ReelDataContext = createContext(null);

function calculateDerivedRates(baseState) {
  const accountsReached = Number(baseState.accountsReached) || 0;
  const views = Number(baseState.views) || 0;
  const likes = Number(baseState.likes) || 0;
  const comments = Number(baseState.comments) || 0;
  const reposts = Number(baseState.reposts) || 0;
  const shares = Number(baseState.shares) || 0;
  const saves = Number(baseState.saves) || 0;

  const calculateRate = (count) => {
    if (accountsReached > 0) {
      return parseFloat(((count / accountsReached) * 100).toFixed(1));
    }
    return 0;
  };

  const calculateSkipRate = () => {
    if (accountsReached > 0 && views > 0) {
      const skipped = accountsReached - views;
      if (skipped > 0) {
        return parseFloat(((skipped / accountsReached) * 100).toFixed(1));
      }
    }
    return 0;
  };

  const currentRates = Array.isArray(baseState.rates) && baseState.rates.length ? baseState.rates : DEFAULT_DATA.rates;
  return currentRates.map((rate) => {
    switch (rate.key) {
      case "skip":
        return { ...rate, value: calculateSkipRate() };
      case "like":
        return { ...rate, value: calculateRate(likes) };
      case "comment":
        return { ...rate, value: calculateRate(comments) };
      case "repost":
        return { ...rate, value: calculateRate(reposts) };
      case "share":
        return { ...rate, value: calculateRate(shares) };
      case "save":
        return { ...rate, value: calculateRate(saves) };
      default:
        return rate;
    }
  });
}

function toFiniteNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeLabelValueRows(rows, labelKey, valueKey) {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows
    .map((item) => ({
      label: String(item?.[labelKey] ?? item?.label ?? item?.name ?? "").trim(),
      value: toFiniteNumber(item?.[valueKey] ?? item?.value ?? item?.percent ?? item?.percentage, 0),
    }))
    .filter((item) => item.label);
}

function normalizeSelectedReelInsight(item, index, fallbackAgeGroups) {
  const summary = item?.summary || {};
  const metricsRow = item?.metrics_row || item?.metricsRow || {};
  const audience = item?.audience || {};
  const graphs = item?.graphs || {};

  const ageGroups = Array.isArray(audience.ageGroups)
    ? normalizeLabelValueRows(audience.ageGroups, "label", "percentage")
    : Array.isArray(audience.age_groups)
      ? normalizeLabelValueRows(audience.age_groups, "label", "percentage")
      : fallbackAgeGroups;

  return {
    reelId: String(item?.reel_id ?? item?.reelId ?? item?.id ?? index),
    isTopPerformer: Boolean(item?.is_top_performer ?? item?.isTopPerformer),
    summary: {
      views: toFiniteNumber(summary.views ?? summary.viewCount ?? summary.thisReel, 0),
      accountsReached: toFiniteNumber(summary.accountsReached ?? summary.accounts_reached ?? summary.reach, 0),
      follows: toFiniteNumber(summary.follows ?? summary.follows_gained ?? summary.followsGained, 0),
    },
    metricsRow: {
      likes: toFiniteNumber(metricsRow.likes ?? metricsRow.likeCount, 0),
      comments: toFiniteNumber(metricsRow.comments ?? metricsRow.commentCount, 0),
      shares: toFiniteNumber(metricsRow.shares ?? metricsRow.shareCount, 0),
      saves: toFiniteNumber(metricsRow.saves ?? metricsRow.saveCount, 0),
    },
    audience: {
      genderMen: toFiniteNumber(
        audience.genderMen ?? audience.gender_percent?.male ?? audience.gender_percent?.men,
        0
      ),
      genderWomen: toFiniteNumber(
        audience.genderWomen ?? audience.gender_percent?.female ?? audience.gender_percent?.women,
        0
      ),
      ageGroups,
    },
    graphs: {
      viewsOverTime: Array.isArray(graphs.views_over_time) ? graphs.views_over_time : [],
      retentionCurvePercent: Array.isArray(graphs.retention_curve_percent) ? graphs.retention_curve_percent : [],
      engagementCurvePercent: Array.isArray(graphs.engagement_curve_percent) ? graphs.engagement_curve_percent : [],
    },
  };
}

function sumSelectedReels(selectedReels, fieldPath) {
  return selectedReels.reduce((sum, item) => {
    if (fieldPath === "summary.views") {
      return sum + toFiniteNumber(item?.summary?.views, 0);
    }
    if (fieldPath === "summary.accountsReached") {
      return sum + toFiniteNumber(item?.summary?.accountsReached, 0);
    }
    if (fieldPath === "summary.follows") {
      return sum + toFiniteNumber(item?.summary?.follows, 0);
    }
    return sum + toFiniteNumber(item?.metricsRow?.[fieldPath] ?? item?.metrics_row?.[fieldPath], 0);
  }, 0);
}

function normalizeGraphSeries(series, fallback, mapper) {
  const source = Array.isArray(series) && series.length ? series : fallback;
  if (!Array.isArray(source) || !source.length) {
    return fallback;
  }
  return source.map(mapper);
}

function applyGeminiPayloadToState(state, payload) {
  const dashboardState = payload?.dashboard_30d || null;
  const dashboardSummary = payload?.dashboard_30d_summary || {};
  const dashboardOverview = dashboardState?.overview || dashboardSummary?.overview || {};
  const dashboardAudience = dashboardState?.audience || dashboardSummary?.audience_blended_30d || {};
  const dashboardSources = dashboardSummary?.top_sources_percent || {};
  const dashboardGraphs = dashboardSummary?.graphs || {};
  const topLevelMetrics = payload?.metrics || {};
  const audienceSplit = payload?.audience_split || {};
  const trafficSources = payload?.traffic_sources_percent || {};
  const demographics = payload?.demographics || {};
  const genderPercent = demographics?.gender_percent || {};
  const ageGroupsPercent = demographics?.age_groups_percent || {};
  const countriesPercent = payload?.tier_1_countries_percent || {};
  const chartPoints = Array.isArray(payload?.views_over_time) ? payload.views_over_time : [];
  const retentionCurve = Array.isArray(payload?.retention_curve_percent) ? payload.retention_curve_percent : [];
  const engagementCurve = Array.isArray(payload?.engagement_curve_percent) ? payload.engagement_curve_percent : [];
  const selectedReelsInsights = Array.isArray(payload?.selected_reels)
    ? payload.selected_reels.slice(0, 3).map((item, index) => ({
        reelId: String(item?.reel_id ?? item?.reelId ?? item?.id ?? index),
        isTopPerformer: index === 0,
        summary: {
          views: toFiniteNumber(item?.summary?.views, 0),
          accountsReached: toFiniteNumber(item?.summary?.accountsReached ?? item?.summary?.accounts_reached, 0),
          follows: toFiniteNumber(item?.summary?.follows, 0),
        },
        metricsRow: {
          likes: toFiniteNumber(item?.metrics?.likes, 0),
          comments: toFiniteNumber(item?.metrics?.comments, 0),
          shares: toFiniteNumber(item?.metrics?.shares, 0),
          saves: toFiniteNumber(item?.metrics?.saves, 0),
        },
        audience: {
          genderMen: toFiniteNumber(item?.audience?.genderMen, state.genderMen),
          genderWomen: toFiniteNumber(100 - toFiniteNumber(item?.audience?.genderMen, state.genderMen), state.genderWomen),
          ageGroups: normalizeLabelValueRows(item?.audience?.ageGroups, "label", "percentage"),
        },
        graphs: {
          viewsOverTime: Array.isArray(item?.viewsOverTime)
            ? item.viewsOverTime.map((value, pointIndex) => ({
                label: state.viewsOverTime?.[pointIndex]?.label || `Point ${pointIndex + 1}`,
                thisReel: toFiniteNumber(value, 0),
                typicalReel: toFiniteNumber(
                  state.viewsOverTime?.[pointIndex]?.typicalReel,
                  Math.round(toFiniteNumber(value, 0) * 0.82)
                ),
              }))
            : [],
          retentionCurvePercent: Array.isArray(item?.retentionPoints) ? item.retentionPoints : [],
          engagementCurvePercent: Array.isArray(item?.rates)
            ? state.engagementPoints
            : Array.isArray(item?.engagementPoints)
              ? item.engagementPoints
              : [],
        },
        topSources: normalizeLabelValueRows(item?.topSources, "label", "percentage"),
      }))
    : Array.isArray(payload?.selected_reels_insights)
      ? payload.selected_reels_insights
          .slice(0, 3)
          .map((item, index) => normalizeSelectedReelInsight(item, index, state.ageGroups))
      : [];
  const primarySelectedInsight = selectedReelsInsights[0] || null;

  const dashboardTop3Views = toFiniteNumber(
    dashboardOverview.top_3_reels_total_views,
    selectedReelsInsights.reduce((sum, item) => sum + toFiniteNumber(item?.summary?.views, 0), 0)
  );
  const dashboardOtherViews = toFiniteNumber(dashboardOverview.other_content_estimated_views, 0);
  const derivedTotalViews = dashboardTop3Views + dashboardOtherViews;
  const views = toFiniteNumber(dashboardOverview.total_30d_views, derivedTotalViews || topLevelMetrics.views || dashboardTop3Views);
  const accountsReached = toFiniteNumber(
    dashboardOverview.accounts_reached ?? dashboardOverview.total_30d_accounts_reached,
    toFiniteNumber(topLevelMetrics.reach, state.accountsReached)
  );
  const likes = toFiniteNumber(
    dashboardOverview.total_30d_likes,
    selectedReelsInsights.length ? sumSelectedReels(selectedReelsInsights, "likes") : topLevelMetrics.likes
  );
  const comments = toFiniteNumber(
    dashboardOverview.total_30d_comments,
    selectedReelsInsights.length ? sumSelectedReels(selectedReelsInsights, "comments") : topLevelMetrics.comments
  );
  const shares = toFiniteNumber(
    dashboardOverview.total_30d_shares,
    selectedReelsInsights.length ? sumSelectedReels(selectedReelsInsights, "shares") : topLevelMetrics.shares
  );
  const saves = toFiniteNumber(
    dashboardOverview.total_30d_saves,
    selectedReelsInsights.length ? sumSelectedReels(selectedReelsInsights, "saves") : topLevelMetrics.saves
  );
  const follows = toFiniteNumber(
    dashboardOverview.net_followers_30d ?? dashboardOverview.total_30d_follows_gained,
    selectedReelsInsights.length ? sumSelectedReels(selectedReelsInsights, "summary.follows") : topLevelMetrics.follows_gained
  );
  const profileVisits = toFiniteNumber(
    dashboardOverview.profile_visits_30d ?? dashboardOverview.total_30d_profile_visits,
    topLevelMetrics.profile_visits
  );
  const engagedAccounts = toFiniteNumber(
    dashboardOverview.accounts_engaged ?? dashboardOverview.total_30d_engaged_accounts,
    likes + comments + saves + shares
  );
  const netFollowers = toFiniteNumber(
    dashboardOverview.net_followers_30d ?? dashboardOverview.total_30d_follows_gained,
    toFiniteNumber(topLevelMetrics.follows_gained, state.netFollowers)
  );
  const followersPercent = toFiniteNumber(
    dashboardAudience.followers_percent,
    toFiniteNumber(audienceSplit.followers_percent, state.followersPercent)
  );
  const nonFollowersPercent = toFiniteNumber(
    dashboardAudience.non_followers_percent,
    toFiniteNumber(audienceSplit.non_followers_percent, 100 - followersPercent)
  );
  const genderMen = toFiniteNumber(
    dashboardAudience.genderMen ?? dashboardAudience.gender_percent?.male,
    toFiniteNumber(genderPercent.male, state.genderMen)
  );
  const genderWomen = toFiniteNumber(
    dashboardAudience.genderWomen ?? dashboardAudience.gender_percent?.female ?? 100 - genderMen,
    toFiniteNumber(genderPercent.female, state.genderWomen)
  );
  const videoDuration = toFiniteNumber(payload?.video_duration_seconds, state.videoDuration);
  const followersCount = toFiniteNumber(
    dashboardAudience.followers_count ?? dashboardOverview.total_followers,
    toFiniteNumber(state.followersCount, 0)
  );
  const followersGrowthChange = String(
    dashboardAudience.followers_growth_change ?? state.followersGrowthChange ?? "+0%"
  );

  const overviewGraphPoints =
    Array.isArray(dashboardGraphs.views_over_time) && dashboardGraphs.views_over_time.length
      ? dashboardGraphs.views_over_time
      : Array.isArray(primarySelectedInsight?.graphs?.viewsOverTime) && primarySelectedInsight.graphs.viewsOverTime.length
        ? primarySelectedInsight.graphs.viewsOverTime
      : chartPoints;

  const nextViews = normalizeGraphSeries(overviewGraphPoints, state.viewsOverTime, (point, index) => ({
    label: point?.label || state.viewsOverTime?.[index]?.label || `Point ${index + 1}`,
    thisReel: toFiniteNumber(point?.thisReel ?? point?.this_reel ?? point?.views, 0),
    typicalReel: toFiniteNumber(point?.typicalReel ?? point?.typical_reel ?? point?.benchmark, 0),
  }));

  const nextRetention = normalizeGraphSeries(
    Array.isArray(primarySelectedInsight?.graphs?.retentionCurvePercent) && primarySelectedInsight.graphs.retentionCurvePercent.length > 0
      ? primarySelectedInsight.graphs.retentionCurvePercent
      : retentionCurve,
    state.retentionPoints,
    (value) => Math.max(0, Math.min(100, Math.round(toFiniteNumber(value, 0))))
  );

  const nextEngagement = normalizeGraphSeries(
    Array.isArray(primarySelectedInsight?.graphs?.engagementCurvePercent) && primarySelectedInsight.graphs.engagementCurvePercent.length > 0
      ? primarySelectedInsight.graphs.engagementCurvePercent
      : engagementCurve,
    state.engagementPoints,
    (value) => {
      const num = toFiniteNumber(value, 0);
      return Math.max(0, Math.min(20, Number(num.toFixed(1))));
    }
  );

  const nextState = {
    ...state,
    likes,
    comments,
    interactions: engagedAccounts,
    reposts: toFiniteNumber(topLevelMetrics.reposts ?? topLevelMetrics.reposts_count, state.reposts),
    shares,
    saves,
    views,
    accountsReached,
    avgWatchTime: dashboardOverview.avg_watch_time || topLevelMetrics.avg_watch_time || topLevelMetrics.avgWatchTime || state.avgWatchTime,
    follows,
    netFollowers,
    followersCount,
    followersGrowthChange,
    profileVisits,
    followersPercent,
    genderMen,
    genderWomen,
    topSources: [
      { name: "Reels tab", value: toFiniteNumber(primarySelectedInsight?.topSources?.[0]?.value, toFiniteNumber(dashboardSources.reels_tab, toFiniteNumber(trafficSources.reels_tab, state.topSources?.[0]?.value || 0))) },
      { name: "Feed", value: toFiniteNumber(primarySelectedInsight?.topSources?.[1]?.value, toFiniteNumber(dashboardSources.feed, toFiniteNumber(trafficSources.feed, state.topSources?.[1]?.value || 0))) },
      { name: "Explore", value: toFiniteNumber(primarySelectedInsight?.topSources?.[2]?.value, toFiniteNumber(dashboardSources.explore, toFiniteNumber(trafficSources.explore, state.topSources?.[2]?.value || 0))) },
      { name: "Other", value: toFiniteNumber(primarySelectedInsight?.topSources?.[3]?.value, toFiniteNumber(dashboardSources.other, toFiniteNumber(trafficSources.other, state.topSources?.[3]?.value || 0))) },
    ],
    ageGroups: [
      { label: "13-17", value: toFiniteNumber(dashboardAudience.age_groups_percent?.["13_17"], toFiniteNumber(dashboardAudience.ageGroups?.find?.((item) => item?.label === "13-17")?.percentage, toFiniteNumber(ageGroupsPercent["13_17"], state.ageGroups?.[0]?.value || 0))) },
      { label: "18-24", value: toFiniteNumber(dashboardAudience.age_groups_percent?.["18_24"], toFiniteNumber(dashboardAudience.ageGroups?.find?.((item) => item?.label === "18-24")?.percentage, toFiniteNumber(ageGroupsPercent["18_24"], state.ageGroups?.[1]?.value || 0))) },
      { label: "25-34", value: toFiniteNumber(dashboardAudience.age_groups_percent?.["25_34"], toFiniteNumber(dashboardAudience.ageGroups?.find?.((item) => item?.label === "25-34")?.percentage, toFiniteNumber(ageGroupsPercent["25_34"], state.ageGroups?.[2]?.value || 0))) },
      { label: "35+", value: toFiniteNumber(dashboardAudience.age_groups_percent?.["35_plus"], toFiniteNumber(dashboardAudience.ageGroups?.find?.((item) => item?.label === "35+")?.percentage, toFiniteNumber(ageGroupsPercent["35_plus"], state.ageGroups?.[3]?.value || 0))) },
    ],
    countries: [
      { name: "United States", value: toFiniteNumber(dashboardAudience.tier_1_countries_percent?.united_states, toFiniteNumber(dashboardAudience.countries?.find?.((item) => item?.label === "United States")?.percentage, toFiniteNumber(countriesPercent.united_states, state.countries?.[0]?.value || 0))) },
      { name: "United Kingdom", value: toFiniteNumber(dashboardAudience.tier_1_countries_percent?.united_kingdom, toFiniteNumber(dashboardAudience.countries?.find?.((item) => item?.label === "United Kingdom")?.percentage, toFiniteNumber(countriesPercent.united_kingdom, state.countries?.[1]?.value || 0))) },
      { name: "Canada", value: toFiniteNumber(dashboardAudience.tier_1_countries_percent?.canada, toFiniteNumber(dashboardAudience.countries?.find?.((item) => item?.label === "Canada")?.percentage, toFiniteNumber(countriesPercent.canada, state.countries?.[2]?.value || 0))) },
      { name: "Australia", value: toFiniteNumber(dashboardAudience.tier_1_countries_percent?.australia, toFiniteNumber(dashboardAudience.countries?.find?.((item) => item?.label === "Australia")?.percentage, toFiniteNumber(countriesPercent.australia, state.countries?.[3]?.value || 0))) },
    ],
    viewsOverTime: nextViews,
    retentionPoints: nextRetention,
    engagementPoints: nextEngagement,
    videoDuration: Number.isFinite(videoDuration) && videoDuration > 0 ? Math.max(1, Math.min(180, Math.round(videoDuration))) : state.videoDuration,
    selectedReelsInsights,
    audienceGrowthPoints: normalizeGraphSeries(
      Array.isArray(payload?.dashboard_30d?.follower_growth_trend)
        ? payload.dashboard_30d.follower_growth_trend
        : Array.isArray(payload?.dashboard_30d?.daily_reach_trend)
          ? payload.dashboard_30d.daily_reach_trend
          : dashboardGraphs.audience_growth_points,
      state.audienceGrowthPoints,
      (value) => Math.round(toFiniteNumber(value, 0))
    ),
    topCities: Array.isArray(dashboardAudience.top_cities) && dashboardAudience.top_cities.length
      ? dashboardAudience.top_cities.map((city) => ({
          name: city.label || city.name || "Unknown",
          value: toFiniteNumber(city.percentage ?? city.value, 0),
        }))
      : state.topCities,
    activeTimes: Array.isArray(dashboardAudience.active_times) && dashboardAudience.active_times.length
      ? dashboardAudience.active_times.map((item) => ({
          day: String(item.day ?? ""),
          value: Math.max(0, Math.round(toFiniteNumber(item.value, 0))),
        }))
      : state.activeTimes,
    topTimes: Array.isArray(dashboardAudience.top_times) && dashboardAudience.top_times.length
      ? dashboardAudience.top_times.map((item) => ({
          day: String(item.day ?? ""),
          range: String(item.range ?? ""),
        }))
      : state.topTimes,
  };

  nextState.selectedPostData = state.selectedPostData
    ? {
        ...state.selectedPostData,
        likes: selectedReelsInsights.length ? selectedReelsInsights[0].metricsRow.likes : nextState.likes,
        likesCount: selectedReelsInsights.length ? selectedReelsInsights[0].metricsRow.likes : nextState.likes,
        comments: selectedReelsInsights.length ? selectedReelsInsights[0].metricsRow.comments : nextState.comments,
        commentsCount: selectedReelsInsights.length ? selectedReelsInsights[0].metricsRow.comments : nextState.comments,
        reposts: nextState.reposts,
        repostsCount: nextState.reposts,
        shares: selectedReelsInsights.length ? selectedReelsInsights[0].metricsRow.shares : nextState.shares,
        sharesCount: selectedReelsInsights.length ? selectedReelsInsights[0].metricsRow.shares : nextState.shares,
        saves: selectedReelsInsights.length ? selectedReelsInsights[0].metricsRow.saves : nextState.saves,
        savesCount: selectedReelsInsights.length ? selectedReelsInsights[0].metricsRow.saves : nextState.saves,
        views: selectedReelsInsights.length ? selectedReelsInsights[0].summary.views : nextState.views,
        viewCount: selectedReelsInsights.length ? selectedReelsInsights[0].summary.views : nextState.views,
      }
    : null;
  nextState.rates = calculateDerivedRates(nextState);

  return nextState;
}

function reelDataReducer(state, action) {
  const safeArray = (value, fallback) => {
    if (Array.isArray(value) && value.length) {
      return value;
    }
    return fallback;
  };

  const syncSelectedPost = (post, field, value) => {
    if (!post) {
      return post;
    }

    const next = { ...post };
    switch (field) {
      case "views":
        next.views = value;
        next.viewCount = value;
        break;
      case "likes":
        next.likes = value;
        next.likesCount = value;
        break;
      case "comments":
        next.comments = value;
        next.commentsCount = value;
        break;
      case "reposts":
        next.reposts = value;
        next.repostsCount = value;
        break;
      case "shares":
        next.shares = value;
        next.sharesCount = value;
        break;
      case "saves":
        next.saves = value;
        next.savesCount = value;
        break;
      case "thumbnailUri":
        next.thumbnailUri = value;
        break;
      case "videoDuration":
        next.videoDuration = value;
        break;
      default:
        next[field] = value;
        break;
    }
    return next;
  };

  switch (action.type) {
    case "SET_SCREEN":
      if (!action.value || action.value === state.currentScreen) {
        return state;
      }
      return {
        ...state,
        currentScreen: action.value,
        screenHistory: [...(Array.isArray(state.screenHistory) ? state.screenHistory : []), state.currentScreen],
      };

    case "GO_BACK": {
      const history = Array.isArray(state.screenHistory) ? state.screenHistory : [];
      if (!history.length) {
        if (state.currentScreen === "home") {
          return state;
        }
        return {
          ...state,
          currentScreen: "home",
          screenHistory: [],
        };
      }
      const previousScreen = history[history.length - 1];
      return {
        ...state,
        currentScreen: previousScreen,
        screenHistory: history.slice(0, -1),
      };
    }

    case "SET_SELECTED_POST_URI":
      return { ...state, selectedPostUri: action.uri };

    case "SET_SELECTED_POST_INDEX":
      return { ...state, selectedPostIndex: action.index };

    case "SET_SELECTED_POST_DATA":
      return { ...state, selectedPostData: action.data || null };

    case "SET_EDITING":
      return { ...state, isEditing: action.value };

    case "SET_THUMBNAIL":
      return { ...state, thumbnailUri: action.uri };

    case "APPLY_HISTORICAL_BASELINE":
      if (!action.selectedPost) {
        return state;
      }

      const baseline = buildHistoricalInsightsBaseline(action.selectedPost, action.sourceReels || []);
      const baselineState = {
        ...state,
        thumbnailUri: baseline.thumbnailUri || state.thumbnailUri,
        views: baseline.views,
        likes: baseline.likes,
        comments: baseline.comments,
        reposts: baseline.reposts,
        shares: baseline.shares,
        saves: baseline.saves,
        accountsReached: baseline.accountsReached,
        follows: baseline.follows,
        profileVisits: baseline.profileVisits,
        avgWatchTime: baseline.avgWatchTime,
        followersPercent: baseline.followersPercent,
        topSources: baseline.topSources,
        viewsOverTime: baseline.viewsOverTime,
        retentionPoints: baseline.retentionPoints,
        engagementPoints: baseline.engagementPoints,
        videoDuration: baseline.videoDuration,
      };
      baselineState.selectedPostData = syncSelectedPost(state.selectedPostData, "views", baseline.views);
      baselineState.selectedPostData = syncSelectedPost(baselineState.selectedPostData, "likes", baseline.likes);
      baselineState.selectedPostData = syncSelectedPost(baselineState.selectedPostData, "comments", baseline.comments);
      baselineState.selectedPostData = syncSelectedPost(baselineState.selectedPostData, "shares", baseline.shares);
      baselineState.selectedPostData = syncSelectedPost(baselineState.selectedPostData, "saves", baseline.saves);
      baselineState.selectedPostData = syncSelectedPost(baselineState.selectedPostData, "videoDuration", baseline.videoDuration);
      baselineState.rates = calculateDerivedRates(baselineState);
      return baselineState;

    case "UPDATE_FIELD":
      const newState = { ...state, [action.field]: action.value };
      newState.selectedPostData = syncSelectedPost(state.selectedPostData, action.field, action.value);
      
      // Auto-calculate rates when relevant fields change
      if (action.field === "accountsReached" || 
          action.field === "likes" || 
          action.field === "comments" || 
          action.field === "reposts" || 
          action.field === "shares" || 
          action.field === "saves" ||
          action.field === "views") {
        
        newState.rates = calculateDerivedRates(newState);
      }
      
      return newState;

    case "APPLY_GEMINI_PAYLOAD":
      return applyGeminiPayloadToState(state, action.payload);

    case "UPDATE_VIEWS_OVER_TIME":
      return { ...state, viewsOverTime: action.data };

    case "UPDATE_RETENTION":
      return { ...state, retentionPoints: action.data, videoDuration: action.duration };

    case "UPDATE_ENGAGEMENT":
      return { ...state, engagementPoints: action.data, videoDuration: action.duration };

    case "UPDATE_RATE":
      return {
        ...state,
        rates: safeArray(state.rates, DEFAULT_DATA.rates).map((r, i) =>
          i === action.index ? { ...r, ...action.updates } : r
        ),
      };

    case "UPDATE_TOP_SOURCE":
      return {
        ...state,
        topSources: safeArray(state.topSources, DEFAULT_DATA.topSources).map((s, i) =>
          i === action.index ? { ...s, ...action.updates } : s
        ),
      };

    case "UPDATE_AUDIENCE_GROWTH":
      return {
        ...state,
        audienceGrowthPoints: safeArray(state.audienceGrowthPoints, DEFAULT_DATA.audienceGrowthPoints).map((value, index) =>
          index === action.index ? action.value : value
        ),
      };

    case "RESET_AUDIENCE_GROWTH":
      return {
        ...state,
        audienceGrowthPoints: [...DEFAULT_DATA.audienceGrowthPoints],
      };

    case "UPDATE_CONTENT_TYPE":
      return {
        ...state,
        contentTypeBreakdown: safeArray(state.contentTypeBreakdown, DEFAULT_DATA.contentTypeBreakdown).map((row, i) =>
          i === action.index
            ? {
                label: action.updates.label !== undefined ? action.updates.label : row.label,
                value: action.updates.value !== undefined ? action.updates.value : row.value,
              }
            : row
        ),
      };

    case "ADD_CONTENT_TYPE":
      return {
        ...state,
        contentTypeBreakdown: [...safeArray(state.contentTypeBreakdown, DEFAULT_DATA.contentTypeBreakdown), { label: "New type", value: 0 }],
      };

    case "DELETE_CONTENT_TYPE":
      return {
        ...state,
        contentTypeBreakdown: safeArray(state.contentTypeBreakdown, DEFAULT_DATA.contentTypeBreakdown).filter((_, i) => i !== action.index),
      };

    case "UPDATE_PROFILE_ACTIVITY":
      return {
        ...state,
        profileActivity: safeArray(state.profileActivity, DEFAULT_DATA.profileActivity).map((row, i) =>
          i === action.index
            ? {
                label: action.updates.label !== undefined ? action.updates.label : row.label,
                value: action.updates.value !== undefined ? action.updates.value : row.value,
              }
            : row
        ),
      };

    case "RANDOMIZE_AGE_GROUPS":
      return {
        ...state,
        ageGroups: (() => {
          const current = safeArray(state.ageGroups, DEFAULT_DATA.ageGroups);
          const weights = current.map((_, index) => {
            const base = index === 0 ? 2.2 : index === 1 ? 1.8 : 0.6;
            return base + Math.random() * (index < 2 ? 3.2 : 1.8);
          });
          const sum = weights.reduce((acc, value) => acc + value, 0) || 1;
          return current.map((group, index) => {
            const value = (weights[index] / sum) * 100;
            return {
              ...group,
              value: Number(value.toFixed(1)),
            };
          });
        })(),
      };

    case "RANDOMIZE_ACTIVE_TIMES":
      return {
        ...state,
        activeTimes: (() => {
          const current = safeArray(state.activeTimes, DEFAULT_DATA.activeTimes);
          const weights = current.map((_, index) => {
            const peak = index === 5 ? 90 : index === 4 ? 72 : 20;
            return peak + Math.random() * (index === 5 ? 18 : 60);
          });
          return current.map((item, index) => ({
            ...item,
            value: Math.round(weights[index]),
          }));
        })(),
      };

    case "RANDOMIZE_GENDER":
      const nextWomen = Number((12 + Math.random() * 33).toFixed(1));
      return {
        ...state,
        genderWomen: nextWomen,
        genderMen: Number((100 - nextWomen).toFixed(1)),
      };

    case "RANDOMIZE_AUDIENCE_GROWTH":
      return {
        ...state,
        audienceGrowthPoints: safeArray(state.audienceGrowthPoints, DEFAULT_DATA.audienceGrowthPoints).map((value, index, list) => {
          const anchor = index === 0 ? value : list[index - 1];
          const noise = (Math.random() - 0.5) * 18;
          const pull = index > 0 ? (anchor - value) * 0.3 : 0;
          return Math.round(value + noise + pull);
        }),
      };

    case "ADD_TOP_SOURCE":
      return {
        ...state,
        topSources: [...state.topSources, { name: "New source", value: 0 }],
      };

    case "DELETE_TOP_SOURCE":
      return {
        ...state,
        topSources: state.topSources.filter((_, i) => i !== action.index),
      };

    case "UPDATE_AGE_GROUP":
      return {
        ...state,
        ageGroups: safeArray(state.ageGroups, DEFAULT_DATA.ageGroups).map((a, i) =>
          i === action.index 
            ? { 
                label: action.updates.label !== undefined ? action.updates.label : a.label,
                value: action.updates.value !== undefined ? action.updates.value : a.value
              } 
            : a
        ),
      };

    case "ADD_AGE_GROUP":
      return {
        ...state,
        ageGroups: [...safeArray(state.ageGroups, DEFAULT_DATA.ageGroups), { label: "New age", value: 0 }],
      };

    case "DELETE_AGE_GROUP":
      return {
        ...state,
        ageGroups: safeArray(state.ageGroups, DEFAULT_DATA.ageGroups).filter((_, i) => i !== action.index),
      };

    case "UPDATE_COUNTRY":
      return {
        ...state,
        countries: safeArray(state.countries, DEFAULT_DATA.countries).map((c, i) =>
          i === action.index 
            ? { 
                name: action.updates.name !== undefined ? action.updates.name : c.name,
                value: action.updates.value !== undefined ? action.updates.value : c.value
              } 
            : c
        ),
      };

    case "ADD_COUNTRY":
      return {
        ...state,
        countries: [...safeArray(state.countries, DEFAULT_DATA.countries), { name: "New country", value: 0 }],
      };

    case "DELETE_COUNTRY":
      return {
        ...state,
        countries: safeArray(state.countries, DEFAULT_DATA.countries).filter((_, i) => i !== action.index),
      };

    case "HYDRATE":
      // Merge with defaults to ensure data integrity
      const hydratedData = { ...DEFAULT_DATA, ...action.data };

      hydratedData.rates = safeArray(hydratedData.rates, DEFAULT_DATA.rates);
      hydratedData.topSources = safeArray(hydratedData.topSources, DEFAULT_DATA.topSources);
      hydratedData.audienceGrowthPoints = safeArray(
        hydratedData.audienceGrowthPoints,
        DEFAULT_DATA.audienceGrowthPoints
      );
      hydratedData.contentTypeBreakdown = safeArray(
        hydratedData.contentTypeBreakdown,
        DEFAULT_DATA.contentTypeBreakdown
      );
      hydratedData.profileActivity = safeArray(hydratedData.profileActivity, DEFAULT_DATA.profileActivity);
      hydratedData.ageGroups = safeArray(hydratedData.ageGroups, DEFAULT_DATA.ageGroups);
      hydratedData.countries = safeArray(hydratedData.countries, DEFAULT_DATA.countries);
      hydratedData.activeTimes = safeArray(hydratedData.activeTimes, DEFAULT_DATA.activeTimes);
      hydratedData.topTimes = safeArray(hydratedData.topTimes, DEFAULT_DATA.topTimes);
      hydratedData.topCities = safeArray(hydratedData.topCities, DEFAULT_DATA.topCities);
      hydratedData.screenHistory = Array.isArray(hydratedData.screenHistory) ? hydratedData.screenHistory : [];
      
      // Validate ageGroups structure - ensure they use 'label' key
      if (hydratedData.ageGroups && hydratedData.ageGroups.length > 0) {
        hydratedData.ageGroups = hydratedData.ageGroups.map(g => ({
          label: g.label || g.name || "Unknown",
          value: g.value || 0
        }));
      }
      
      // Validate countries structure - ensure they use 'name' key
      if (hydratedData.countries && hydratedData.countries.length > 0) {
        hydratedData.countries = hydratedData.countries.map(c => ({
          name: c.name || c.label || "Unknown",
          value: c.value || 0
        }));
      }
      
      return hydratedData;

    case "RESET":
      return { ...DEFAULT_DATA };

    default:
      return state;
  }
}

export function ReelDataProvider({ children }) {
  const [state, dispatch] = useReducer(reelDataReducer, DEFAULT_DATA);

  // Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          dispatch({ type: "HYDRATE", data });
        }
      } catch (err) {
        // Silently handle AsyncStorage errors on first load
        if (err.message && !err.message.includes('Native module is null')) {
          console.warn("Failed to load reel data:", err);
        }
      }
    })();
  }, []);

  // Save to AsyncStorage on every state change
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        console.warn("Failed to save reel data:", err);
      }
    })();
  }, [state]);

  useEffect(() => {
    if (state.selectedPostData) {
      publishSelectedPostSync(state.selectedPostData);
    }
  }, [state.selectedPostData]);

  return (
    <ReelDataContext.Provider value={{ state, dispatch }}>
      {children}
    </ReelDataContext.Provider>
  );
}

export function useReelData() {
  const context = useContext(ReelDataContext);
  if (!context) {
    throw new Error("useReelData must be used within ReelDataProvider");
  }
  return context;
}
