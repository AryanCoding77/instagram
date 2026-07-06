import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { C } from "../constants/colors";

export default function AdBanner() {
  return (
    <View style={styles.container}>
      {/* EA Logo Badge */}
      <View style={styles.logoBadge}>
        <Text style={styles.logoText}>
          EA{"\n"}SPORTS
        </Text>
      </View>

      {/* Main content area */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.goldTitle}>MVP+</Text>
          <Text style={styles.whiteTitle}>Membership</Text>
        </View>
        <Text style={styles.subtitle}>
          7-Day Early Access | Offer Ends 7/1
        </Text>
      </View>

      {/* Sponsored label at bottom-right */}
      <View style={styles.sponsored}>
        <Text style={styles.sponsoredText}>SPONSORED BY EA</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 80,
    backgroundColor: C.adBg,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 12,
    position: "relative",
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#C8860A",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 8,
    fontFamily: "Inter_800ExtraBold",
    color: C.white,
    textAlign: "center",
    lineHeight: 9,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  goldTitle: {
    fontSize: 26,
    fontFamily: "Inter_800ExtraBold",
    color: C.adGold,
    letterSpacing: -0.5,
  },
  whiteTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: C.white,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: C.adSubtitle,
    marginTop: 1,
  },
  sponsored: {
    position: "absolute",
    bottom: 7,
    right: 10,
  },
  sponsoredText: {
    fontSize: 8,
    fontFamily: "Inter_400Regular",
    color: "#9A7B4F",
  },
});
