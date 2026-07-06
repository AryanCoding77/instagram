import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import TextOverlaySticker from "./TextOverlaySticker";

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
});
