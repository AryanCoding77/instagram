import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image, Alert } from "react-native";
import { Camera, Plus } from "lucide-react-native";
import Svg, { Polygon, Rect, Path } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import { useReelData } from "../context/ReelDataContext";

/**
 * VideoPreviewCard
 * Props:
 *   width  – container width (default: 65% of screen)
 *   showPlayIcon – show centered play triangle overlay
 */
export default function VideoPreviewCard({ width = 220, showPlayIcon = false }) {
  const { state, dispatch } = useReelData();

  // 9:16 aspect ratio height
  const height = (width * 16) / 9;

  // Letter-box proportions: 28% top + 44% content + 28% bottom
  const frameH = height * 0.44;
  const frameTop = height * 0.22;

  const handleChangeThumbnail = async () => {
    console.log("handleChangeThumbnail called");
    
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("Permission result:", permissionResult);
      
      if (!permissionResult.granted) {
        Alert.alert("Permission needed", "Please allow access to your photos");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
        allowsEditing: false,
      });
      
      console.log("Image picker result:", result);

      if (!result.canceled && result.assets && result.assets[0]) {
        dispatch({ type: "SET_THUMBNAIL", uri: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  return (
    <View style={{ alignItems: "center" }}>
      <View style={[styles.container, { width, height, borderRadius: 8 }]}>
        {/* Background image or default background */}
        {state.thumbnailUri ? (
          <Image
            source={{ uri: state.thumbnailUri }}
            style={[StyleSheet.absoluteFill, { borderRadius: 8 }]}
            resizeMode="cover"
          />
        ) : (
          <>
            {/* Black background */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "#000000", borderRadius: 8 }]} />
            
            {/* Simulated video frame area (white/paper sketch background) */}
            <View
              style={[
                styles.frameArea,
                {
                  top: frameTop,
                  height: frameH,
                  left: 0,
                  right: 0,
                },
              ]}
            >
              {/* Sketch paper simulation */}
              <View style={styles.sketchPaper} />
              {/* Hand silhouette - subtle decoration line across middle */}
              <View style={styles.handAccent} />
            </View>
          </>
        )}

        {/* Play icon overlay */}
        {showPlayIcon && !state.isEditing && (
          <View style={[StyleSheet.absoluteFill, styles.playOverlay]}>
            <Svg width={36} height={36} viewBox="0 0 36 36">
              {/* Soft rounded outlined play glyph */}
              <Path
                d="M13 11.2C12.5 11.6 12.2 12.2 12.2 12.8V23.2C12.2 23.8 12.5 24.4 13 24.8C13.6 25.3 14.3 25.3 14.9 24.9L23.9 18.8C24.7 18.3 24.7 17.1 23.9 16.6L14.9 10.6C14.3 10.2 13.6 10.2 13 11.2Z"
                fill="none"
                stroke="white"
                strokeWidth="1.4"
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity={0.95}
              />
            </Svg>
          </View>
        )}

        {/* Plus icon overlay in edit mode - NOW TOUCHABLE */}
        {state.isEditing && (
          <TouchableOpacity
            style={[StyleSheet.absoluteFill, styles.plusOverlay]}
            onPress={handleChangeThumbnail}
            activeOpacity={0.8}
          >
            <View style={styles.plusCircle}>
              <Plus size={32} color="#FFFFFF" strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    alignSelf: "center",
  },
  frameArea: {
    position: "absolute",
    backgroundColor: "#D4C5A0",
    overflow: "hidden",
  },
  sketchPaper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E8DEC8",
  },
  handAccent: {
    position: "absolute",
    bottom: "20%",
    left: "10%",
    right: "20%",
    height: 3,
    backgroundColor: "#B8A880",
    borderRadius: 2,
    opacity: 0.5,
  },
  playOverlay: {
    justifyContent: "center",
    alignItems: "center",
  },
  plusOverlay: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  plusCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#DD2A7B",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
