import React from "react";
import { View, StyleSheet } from "react-native";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import AdBanner from "./AdBanner";

export default function FeedPost({ post }) {
  if (post.type === "ad") {
    return <AdBanner />;
  }

  return (
    <View style={styles.container}>
      <PostHeader user={post.user} audioLabel={post.audioLabel} />
      <PostMedia mediaUri={post.mediaUri} textOverlay={post.textOverlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#111111", // matches the post header/media flow
  },
});
