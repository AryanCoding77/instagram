import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

// Skeleton box with shimmer animation
function SkeletonBox({ width, height, style }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, opacity },
        style,
      ]}
    />
  );
}

export default function SkeletonLoader() {
  return (
    <View style={styles.container}>
      {/* Video preview skeleton */}
      <View style={styles.videoSection}>
        <SkeletonBox width={130} height={200} style={styles.video} />
        
        {/* Icon row skeleton */}
        <View style={styles.iconRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.iconItem}>
              <SkeletonBox width={24} height={24} style={styles.icon} />
              <SkeletonBox width={30} height={12} style={styles.iconLabel} />
            </View>
          ))}
        </View>
      </View>

      {/* Tabs skeleton */}
      <View style={styles.tabs}>
        <SkeletonBox width={80} height={32} style={styles.tab} />
        <SkeletonBox width={100} height={32} style={styles.tab} />
        <SkeletonBox width={80} height={32} style={styles.tab} />
      </View>

      {/* Summary section skeleton */}
      <View style={styles.section}>
        <SkeletonBox width={100} height={20} style={styles.heading} />
        
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <SkeletonBox width="48%" height={80} style={styles.card} />
            <SkeletonBox width="48%" height={80} style={styles.card} />
          </View>
          <View style={styles.gridRow}>
            <SkeletonBox width="48%" height={80} style={styles.card} />
            <SkeletonBox width="48%" height={80} style={styles.card} />
          </View>
        </View>
      </View>

      {/* Views section skeleton */}
      <View style={styles.section}>
        <SkeletonBox width={140} height={20} style={styles.heading} />
        <SkeletonBox width="100%" height={200} style={styles.chart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  skeleton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
  },
  videoSection: {
    paddingTop: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  video: {
    borderRadius: 12,
    marginBottom: 16,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 16,
  },
  iconItem: {
    alignItems: "center",
    gap: 6,
  },
  icon: {
    borderRadius: 12,
  },
  iconLabel: {
    borderRadius: 4,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EFEFEF",
  },
  tab: {
    borderRadius: 20,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  heading: {
    marginBottom: 16,
    borderRadius: 4,
  },
  grid: {
    gap: 10,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  card: {
    borderRadius: 12,
  },
  chart: {
    borderRadius: 12,
    marginTop: 16,
  },
});
