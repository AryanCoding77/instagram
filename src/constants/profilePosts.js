const BASE_POSTS = [
  { seed: "ironman", views: 8, description: "This is why I never skip a Wiz stream", date: "29 June" },
  { seed: "workout1", views: 10, description: "Can we just stop all the weird", date: "3 July" },
  { seed: "fitness", views: 10, description: "They didn't see the vision", date: "4 July" },
  { seed: "gym1", views: 11, description: "Another one for the books", date: "5 July" },
  { seed: "exercise", views: 10, description: "Keep the pace, keep the focus", date: "6 July" },
  { seed: "training", views: 5, description: "Just another training day", date: "7 July" },
  { seed: "muscle", views: 9, description: "Progress looks like this", date: "8 July" },
  { seed: "strength", views: 7, description: "Stronger than yesterday", date: "9 July" },
  { seed: "power", views: 12, description: "Power mode on", date: "10 July" },
  { seed: "athlete", views: 6, description: "Keep it moving", date: "11 July" },
  { seed: "sport", views: 4, description: "Game day energy", date: "12 July" },
  { seed: "pushup", views: 9, description: "No days off", date: "13 July" },
];

const DATE_VARIANTS = [
  "29 June",
  "30 June",
  "1 July",
  "2 July",
  "3 July",
  "4 July",
  "5 July",
  "6 July",
  "7 July",
  "8 July",
  "9 July",
  "10 July",
  "11 July",
  "12 July",
  "13 July",
  "14 July",
  "15 July",
  "16 July",
  "17 July",
  "18 July",
  "19 July",
  "20 July",
  "21 July",
  "22 July",
];

function buildPost(index, base) {
  const sequence = index + 1;
  const bucket = Math.floor(index / BASE_POSTS.length) + 1;
  const descriptionSuffix = bucket > 1 ? ` Part ${bucket}` : "";
  return {
    id: String(sequence),
    thumbnailUri: `https://picsum.photos/seed/aryan-${base.seed}-${sequence}/400`,
    isVideo: true,
    views: String(base.views + bucket * 2),
    description: `${base.description}${descriptionSuffix}`,
    date: DATE_VARIANTS[index % DATE_VARIANTS.length],
  };
}

export const PROFILE_POSTS = Array.from({ length: 48 }, (_, index) => {
  const base = BASE_POSTS[index % BASE_POSTS.length];
  return buildPost(index, base);
});
