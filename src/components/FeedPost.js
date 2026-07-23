import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import LikeIcon from "./icons/LikeIcon";
import CommentIcon from "./icons/CommentIcon";
import RepostIcon from "./RepostIcon";
import ShareIcon from "./icons/ShareIcon";
import SaveIcon from "./icons/SaveIcon";
import { C } from "../constants/colors";

function formatIntegerWithCommas(value) {
  const n = Math.max(0, Math.round(Number(value) || 0));
  return n.toLocaleString("en-US");
}

function FeedPostFooter({ post }) {
  const reactions = [
    { value: formatIntegerWithCommas(post.likesCount ?? post.likes ?? 0), icon: LikeIcon },
    { value: formatIntegerWithCommas(post.commentsCount ?? post.comments ?? 0), icon: CommentIcon },
    { value: formatIntegerWithCommas(post.repostsCount ?? post.reposts ?? 0), icon: RepostIcon },
    { value: formatIntegerWithCommas(post.sharesCount ?? post.shares ?? 0), icon: ShareIcon },
  ];
  const caption = post.caption || post.textOverlay || "";
  const timestamp = post.timestamp || "29 June";

  return (
    <View style={styles.footer}>
      <View style={styles.reactionRow}>
        <View style={styles.reactionGroup}>
          {reactions.map((reaction, index) => (
            (() => {
              const Icon = reaction.icon;
              return (
            <View key={`${reaction.value}-${index}`} style={styles.reactionItem}>
              {Icon ? <Icon size={23} color={C.black} /> : null}
              <Text style={styles.reactionValue}>{reaction.value}</Text>
            </View>
              );
            })()
          ))}
        </View>
        <SaveIcon size={23} color={C.black} />
      </View>

      <View style={styles.captionBlock}>
        <View style={styles.captionRow}>
          <Text style={styles.captionText} numberOfLines={1}>
            <Text style={styles.captionUsername}>{post.user.username} </Text>
            {caption}
          </Text>
          <Text style={styles.captionMore}>... more</Text>
        </View>
        <Text style={styles.captionDate}>{timestamp}</Text>
      </View>
    </View>
  );
}

export default function FeedPost({ post }) {
  if (post.type === "ad") {
    return null;
  }

  return (
    <View style={styles.container}>
      <PostHeader user={post.user} audioLabel={post.audioLabel} />
      <PostMedia mediaUri={post.mediaUri} textOverlay={post.textOverlay} />
      <FeedPostFooter post={post} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: C.white,
  },
  footer: {
    backgroundColor: C.white,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
  },
  reactionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reactionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  reactionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reactionValue: {
    fontSize: 12,
    color: "#000000",
    fontFamily: "Inter_400Regular",
  },
  captionBlock: {
    marginTop: 8,
  },
  captionRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  captionText: {
    flexShrink: 1,
    fontSize: 13,
    color: C.black,
    lineHeight: 17,
  },
  captionUsername: {
    fontWeight: "600",
    color: C.black,
  },
  captionMore: {
    color: "#6F6F6F",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  captionDate: {
    marginTop: 2,
    color: "#6F6F6F",
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
});
