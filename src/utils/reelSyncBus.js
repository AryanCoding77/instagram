const listeners = new Set();

function getReelIdentity(reel) {
  if (!reel) {
    return null;
  }

  return reel.id || reel.shortCode || reel.thumbnailUri || reel.videoUrl || null;
}

export function publishSelectedPostSync(reel) {
  const identity = getReelIdentity(reel);
  if (!identity) {
    return;
  }

  listeners.forEach((listener) => {
    try {
      listener(reel);
    } catch (error) {
      console.warn("[reelSyncBus] listener failed", error);
    }
  });
}

export function subscribeSelectedPostSync(listener) {
  if (typeof listener !== "function") {
    return () => {};
  }

  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function mergeReelIntoList(reels = [], updatedReel = null) {
  const identity = getReelIdentity(updatedReel);
  if (!identity || !Array.isArray(reels) || reels.length === 0) {
    return reels;
  }

  let matched = false;
  const next = reels.map((item) => {
    const itemIdentity = getReelIdentity(item);
    const matches =
      itemIdentity &&
      identity &&
      (itemIdentity === identity ||
        item.id === updatedReel.shortCode ||
        item.shortCode === updatedReel.id ||
        item.thumbnailUri === updatedReel.thumbnailUri ||
        item.videoUrl === updatedReel.videoUrl);

    if (!matches) {
      return item;
    }

    matched = true;
    return {
      ...item,
      ...updatedReel,
      id: updatedReel.id ?? item.id,
      shortCode: updatedReel.shortCode ?? item.shortCode,
      thumbnailUri: updatedReel.thumbnailUri ?? item.thumbnailUri,
      videoUrl: updatedReel.videoUrl ?? item.videoUrl ?? null,
      viewCount: updatedReel.viewCount ?? updatedReel.views ?? item.viewCount,
      likesCount: updatedReel.likesCount ?? updatedReel.likes ?? item.likesCount,
      commentsCount: updatedReel.commentsCount ?? updatedReel.comments ?? item.commentsCount,
      repostsCount: updatedReel.repostsCount ?? updatedReel.reposts ?? item.repostsCount,
      sharesCount: updatedReel.sharesCount ?? updatedReel.shares ?? item.sharesCount,
      savesCount: updatedReel.savesCount ?? updatedReel.saves ?? item.savesCount,
      caption: updatedReel.caption ?? item.caption,
      description: updatedReel.description ?? item.description,
      timestamp: updatedReel.timestamp ?? item.timestamp,
      date: updatedReel.date ?? item.date,
      username: updatedReel.username ?? item.username,
      displayName: updatedReel.displayName ?? item.displayName,
      isPinned: updatedReel.isPinned ?? updatedReel.pinned ?? item.isPinned ?? item.pinned,
      pinned: updatedReel.pinned ?? updatedReel.isPinned ?? item.pinned ?? item.isPinned,
    };
  });

  return matched ? next : reels;
}
