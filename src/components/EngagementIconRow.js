import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useReelData } from "../context/ReelDataContext";
import EditableNumber from "./EditableNumber";

const LIKE_ICON = require("../../assets/icons/like.png");
const COMMENT_ICON = require("../../assets/icons/comment.png");
const REPOST_ICON = require("../../assets/icons/repost.png");
const SHARE_ICON = require("../../assets/icons/share.png");
const SAVED_ICON = require("../../assets/icons/saved.png");

function ThickenedIcon({ source, style, bolder = false }) {
  const offset = bolder ? 0.42 : 0.35;
  return (
    <View style={[styles.iconBox, bolder && styles.iconBoxBolder, style]}>
      <Image source={source} style={[styles.iconLayer, { transform: [{ translateY: -offset }] }]} resizeMode="contain" />
      <Image source={source} style={[styles.iconLayer, { transform: [{ translateX: offset }] }]} resizeMode="contain" />
      <Image source={source} style={[styles.iconLayer, { transform: [{ translateY: offset }] }]} resizeMode="contain" />
      <Image source={source} style={[styles.iconLayer, { transform: [{ translateX: -offset }] }]} resizeMode="contain" />
      {bolder ? (
        <>
          <Image source={source} style={[styles.iconLayer, { transform: [{ translateY: 0.18 }] }]} resizeMode="contain" />
        </>
      ) : null}
      <Image source={source} style={styles.iconLayer} resizeMode="contain" />
    </View>
  );
}

export default function EngagementIconRow() {
  const { state, dispatch } = useReelData();

  const ICONS = [
    { source: LIKE_ICON, field: "likes", count: state.likes, bolder: true },
    { source: COMMENT_ICON, field: "comments", count: state.comments },
    { source: REPOST_ICON, field: "reposts", count: state.reposts },
    { source: SHARE_ICON, field: "shares", count: state.shares },
    { source: SAVED_ICON, field: "saves", count: state.saves },
  ];

  return (
    <View style={styles.container}>
      {ICONS.map(({ source, field, count, bolder }, index) => (
        <View key={index} style={styles.item}>
          <ThickenedIcon source={source} bolder={bolder} />
          <EditableNumber
            value={count}
            onSave={(val) => {
              const num = parseInt(val) || 0;
              dispatch({ type: "UPDATE_FIELD", field, value: num });
            }}
            style={styles.count}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  item: {
    alignItems: "center",
    flex: 1,
  },
  iconBox: {
    width: 17.5,
    height: 17.5,
    marginBottom: 0,
  },
  iconBoxBolder: {
    width: 17.8,
    height: 17.8,
  },
  iconLayer: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    tintColor: "#111111",
  },
  iconLayerUp: {
    transform: [{ translateY: -0.35 }],
  },
  iconLayerRight: {
    transform: [{ translateX: 0.35 }],
  },
  iconLayerDown: {
    transform: [{ translateY: 0.35 }],
  },
  iconLayerLeft: {
    transform: [{ translateX: -0.35 }],
  },
  count: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "#111111",
    marginTop: 4,
  },
});
