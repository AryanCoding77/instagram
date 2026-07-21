import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@reelInsights:data";

export const DEFAULT_DATA = {
  currentScreen: "home",
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
};

const ReelDataContext = createContext(null);

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
      return { ...state, currentScreen: action.value };

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
        
        const accountsReached = action.field === "accountsReached" ? action.value : state.accountsReached;
        const views = action.field === "views" ? action.value : state.views;
        const likes = action.field === "likes" ? action.value : state.likes;
        const comments = action.field === "comments" ? action.value : state.comments;
        const reposts = action.field === "reposts" ? action.value : state.reposts;
        const shares = action.field === "shares" ? action.value : state.shares;
        const saves = action.field === "saves" ? action.value : state.saves;
        
        // Calculate rates as percentage of accounts reached
        const calculateRate = (count) => {
          if (accountsReached > 0) {
            return parseFloat(((count / accountsReached) * 100).toFixed(1));
          }
          return 0;
        };
        
        // Calculate skip rate based on views (views not reached / accounts reached)
        const calculateSkipRate = () => {
          if (accountsReached > 0 && views > 0) {
            const skipped = accountsReached - views;
            if (skipped > 0) {
              return parseFloat(((skipped / accountsReached) * 100).toFixed(1));
            }
          }
          return 0;
        };
        
        // Update rates array with calculated values
        const currentRates = safeArray(state.rates, DEFAULT_DATA.rates);
        newState.rates = currentRates.map(rate => {
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
      
      return newState;

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
