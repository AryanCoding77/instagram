const PEOPLE_POOL = [
  {
    username: "kingvalor1",
    avatarSeed: "kv1",
    caption: "This is why I never skip a stream",
    textOverlay: "CROWD WENT WILD",
  },
  {
    username: "techreels_",
    avatarSeed: "tr2",
    caption: "City cuts and night moves.",
    textOverlay: null,
  },
  {
    username: "streetlens",
    avatarSeed: "sl3",
    caption: "Quick turn, clean shot.",
    textOverlay: "NO EDITS",
  },
  {
    username: "dailyframez",
    avatarSeed: "df4",
    caption: "Little clip, big energy.",
    textOverlay: "ON REPEAT",
  },
  {
    username: "northside.clips",
    avatarSeed: "nc5",
    caption: "Daylight scenes hit different.",
    textOverlay: "NEW DROP",
  },
  {
    username: "reelrush",
    avatarSeed: "rr6",
    caption: "The crowd was not ready.",
    textOverlay: "TURN IT UP",
  },
  {
    username: "motionfeed",
    avatarSeed: "mf7",
    caption: "One more cut for the timeline.",
    textOverlay: "MOTION",
  },
  {
    username: "urbanloop",
    avatarSeed: "ul8",
    caption: "Just letting this play out.",
    textOverlay: "LOOPED",
  },
];

const STORY_POOL = [
  { label: "adarshherex.x", seed: "story1" },
  { label: "arman.noturtype", seed: "story2" },
  { label: "deprox_id", seed: "story3" },
  { label: "user_4", seed: "story4" },
  { label: "vibe.cuts", seed: "story5" },
  { label: "pixeltrail", seed: "story6" },
  { label: "nightglow", seed: "story7" },
  { label: "fastframe", seed: "story8" },
];

const MEDIA_POOL = [
  { seed: "crowd", likes: 887, comments: 10, reposts: 197, shares: 480 },
  { seed: "city", likes: 1441, comments: 10, reposts: 369, shares: 670 },
  { seed: "street", likes: 622, comments: 8, reposts: 142, shares: 205 },
  { seed: "stadium", likes: 2034, comments: 18, reposts: 410, shares: 760 },
  { seed: "nightcar", likes: 951, comments: 12, reposts: 244, shares: 332 },
  { seed: "sunset", likes: 760, comments: 6, reposts: 101, shares: 188 },
  { seed: "bridge", likes: 1180, comments: 9, reposts: 278, shares: 399 },
  { seed: "studio", likes: 1675, comments: 15, reposts: 325, shares: 512 },
];

const CAPTIONS = [
  "This one stayed in my head all day",
  "The timing on this was unreal",
  "A tiny moment, but it landed hard",
  "Could not believe the reaction",
  "Saved this one immediately",
  "The comments were better than the post",
  "Had to post this one twice",
  "Another clip that did way too well",
];

const AUDIO_PREFIXES = [
  "Original audio",
  "Live set audio",
  "studio mix",
  "night drive audio",
  "field recording",
];

const Timestamps = ["19 June", "21 June", "23 June", "26 June", "29 June", "1 July", "4 July"];

function seededAvatar(seed) {
  return `https://picsum.photos/seed/${seed}/200`;
}

function seededMedia(seed) {
  return `https://picsum.photos/seed/${seed}/400/600`;
}

function shuffledCopy(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomCount(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function buildRandomStories(count = 6) {
  return shuffledCopy(STORY_POOL)
    .slice(0, count)
    .map((item, index) => ({
      id: `story-${item.seed}-${index}`,
      avatarUri: seededAvatar(item.seed),
      label: item.label,
      hasStory: true,
      isViewed: Math.random() > 0.6,
    }));
}

export function buildRandomFeedPosts(count = 8) {
  const people = shuffledCopy(PEOPLE_POOL);
  const media = shuffledCopy(MEDIA_POOL);

  return Array.from({ length: count }, (_, index) => {
    const person = people[index % people.length];
    const mediaItem = media[index % media.length];
    const audio = randomFrom(AUDIO_PREFIXES);
    return {
      id: String(index + 1),
      type: "reel",
      user: {
        username: person.username,
        avatarUri: seededAvatar(person.avatarSeed),
      },
      audioLabel: `${person.username} · ${audio}`,
      mediaUri: seededMedia(mediaItem.seed),
      textOverlay: person.textOverlay,
      likesCount: mediaItem.likes + randomCount(-120, 260),
      commentsCount: mediaItem.comments + randomCount(-2, 6),
      repostsCount: mediaItem.reposts + randomCount(-25, 60),
      sharesCount: mediaItem.shares + randomCount(-30, 90),
      caption: randomFrom(CAPTIONS),
      timestamp: randomFrom(Timestamps),
    };
  });
}

export const STORIES = buildRandomStories();
export const FEED_POSTS = buildRandomFeedPosts();
