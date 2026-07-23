import { PROFILE_POSTS } from "./profilePosts";

export function formatCount(value) {
  const n = typeof value === "number" ? value : Number(value) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

export function formatCompactCountWhole(value) {
  const normalized =
    typeof value === "number"
      ? value
      : Number(String(value ?? "").replace(/,/g, "")) || 0;
  const n = Math.max(0, normalized);
  if (n >= 1_000_000) return `${Math.floor(n / 1_000_000)}m`;
  if (n >= 1_000) return `${Math.floor(n / 1_000)}k`;
  return `${n}`;
}

export const DEFAULT_PROFILE_DATA = {
  username: "aryan_9544_",
  displayName: "Aryan_",
  bio: "Doing what 8yrs old me wanted to\n18yrs old\nGoal is to make something big\nContact: wonderscraftofficial@gmail.com",
  profilePicUri: "https://picsum.photos/seed/myavatar/200",
  followersCount: 75,
  followingCount: 111,
  postsCount: PROFILE_POSTS.length,
  dashboardViews: 515700,
  externalUrl: "",
  isVerified: false,
  dashboardVisible: true,
  threadsRowVisible: true,
  highlightsVisible: true,
  categoryText: "",
  noteVisible: true,
  noteText: "",
  threadsLabel: "wonders_craft_",
  highlightItems: null,
  reels: PROFILE_POSTS.map((post) => ({
    id: post.id,
    thumbnailUri: post.thumbnailUri,
    videoUrl: post.isVideo ? post.thumbnailUri : null,
    viewCount: Number(post.views) || 0,
    likesCount: 0,
    commentsCount: 0,
    caption: post.description,
    shortCode: "",
    timestamp: post.date,
  })),
};

const profileData = {
  formatCount,
  formatCompactCountWhole,
  DEFAULT_PROFILE_DATA,
};

export default profileData;
