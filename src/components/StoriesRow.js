import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import StoryCircle from "./StoryCircle";
import { STORIES } from "../constants/mockData";
import { C } from "../constants/colors";

export default function StoriesRow() {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {STORIES.map((story) => (
          <StoryCircle
            key={story.id}
            avatarUri={story.avatarUri}
            label={story.label}
            isOwn={story.isOwn}
            hasStory={story.hasStory}
            isViewed={story.isViewed}
          />
        ))}
      </ScrollView>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: C.white,
  },
  scrollContent: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  divider: {
    height: 0.5,
    backgroundColor: C.border,
    width: "100%",
  },
});
