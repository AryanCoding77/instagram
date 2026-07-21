import React from "react";
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { VolumeX } from "lucide-react-native";
import TextOverlaySticker from "./TextOverlaySticker";
import { C } from "../constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function PostMedia({ mediaUri, textOverlay }) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: mediaUri }}
        style={styles.mediaImage}
        resizeMode="cover"
      />
      {textOverlay && <TextOverlaySticker text={textOverlay} />}
      <TouchableOpacity activeOpacity={0.8} style={styles.muteBtn}>
        <VolumeX size={14} color={C.white} strokeWidth={2.1} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: SCREEN_WIDTH * 1.1,
    overflow: "hidden",
    position: "relative",
  },
  mediaImage: {
    width: "100%",
    height: "100%",
  },
  muteBtn: {
    position: "absolute",
    right: 14,
    bottom: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
});
