import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import StoryCircle from "./StoryCircle";
import { STORIES } from "../constants/mockData";
import { C } from "../constants/colors";
import { useProfileData } from "../context/ProfileDataContext";

export default function StoriesRow({ stories = STORIES }) {
  const { state: profileState } = useProfileData();
  const profile = profileState.profile;
  const storyItems = [
    {
      id: "your-story",
      avatarUri: profile.profilePicUri || stories[0]?.avatarUri,
      label: "Your story",
      isOwn: true,
      hasStory: false,
      isViewed: false,
    },
    ...stories.filter((story) => !story.isOwn),
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {storyItems.map((story) => (
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
});
