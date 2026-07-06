import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { C } from "../constants/colors";

export default function StoryCircle({ avatarUri, label, isOwn, hasStory, isViewed }) {
  const renderRing = () => {
    if (isOwn) {
      // Your story: regular thin gray border
      return (
        <View style={styles.ownStoryContainer}>
          <Image source={{ uri: avatarUri }} style={styles.avatarImageOwn} resizeMode="cover" />
          {/* Blue + badge */}
          <View style={styles.plusBadgeContainer}>
            <View style={styles.plusBadge}>
              <Text style={styles.plusText}>+</Text>
            </View>
          </View>
        </View>
      );
    }

    if (isViewed) {
      // Viewed story: solid gray ring
      return (
        <View style={styles.viewedStoryContainer}>
          <View style={styles.whiteGapContainer}>
            <Image source={{ uri: avatarUri }} style={styles.avatarImageViewed} resizeMode="cover" />
          </View>
        </View>
      );
    }

    if (hasStory) {
      // Unread story: colorful gradient ring — yellow bottom-left, purple top-right
      return (
        <LinearGradient
          colors={C.ringGrad}
          locations={C.ringGradLocations}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 0.0 }}
          style={styles.gradientRing}
        >
          {/* White gap ring */}
          <View style={styles.whiteGapContainer}>
            <Image source={{ uri: avatarUri }} style={styles.avatarImageNew} resizeMode="cover" />
          </View>
        </LinearGradient>
      );
    }

    // Default fall-back: simple avatar
    return (
      <View style={styles.defaultAvatarContainer}>
        <Image source={{ uri: avatarUri }} style={styles.avatarImageDefault} resizeMode="cover" />
      </View>
    );
  };

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.container}>
      {renderRing()}
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 90,
    position: "relative",
  },
  ownStoryContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    padding: 4,
    position: "relative",
    backgroundColor: C.white,
  },
  avatarImageOwn: {
    flex: 1,
    borderRadius: 39,
  },
  plusBadgeContainer: {
    position: "absolute",
    bottom: -1,
    right: -1,
    zIndex: 10,
  },
  plusBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.black,
    borderWidth: 2.5,
    borderColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    color: C.white,
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    lineHeight: 16,
    textAlign: "center",
    marginTop: -1,
  },
  gradientRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    padding: 3, // Ring thickness
  },
  whiteGapContainer: {
    flex: 1,
    borderRadius: 42, // 45 - 3
    backgroundColor: C.white,
    padding: 3, // Gap between ring and avatar
    overflow: "hidden",
  },
  avatarImageNew: {
    flex: 1,
    borderRadius: 39,
  },
  viewedStoryContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#C7C7C7",
    padding: 4,
    backgroundColor: C.white,
  },
  avatarImageViewed: {
    flex: 1,
    borderRadius: 39,
  },
  defaultAvatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: C.border,
    padding: 4,
  },
  avatarImageDefault: {
    flex: 1,
    borderRadius: 39,
  },
  label: {
    width: 90,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: C.black,
    textAlign: "center",
    marginTop: 6,
  },
});
