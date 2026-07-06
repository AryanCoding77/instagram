import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { C } from "../constants/colors";

export default function TextOverlaySticker({ text }) {
  return (
    <View style={styles.stickerContainer}>
      <View style={styles.stickerPill}>
        <Text style={styles.stickerText}>
          {text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stickerContainer: {
    position: "absolute",
    top: "32%",
    alignSelf: "center",
    zIndex: 20,
  },
  stickerPill: {
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 7,
    // Subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stickerText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: C.black,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    textAlign: "center",
  },
});
