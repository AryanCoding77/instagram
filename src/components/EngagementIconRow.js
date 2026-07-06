import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react-native";
import RepostIcon from "./RepostIcon";
import { useReelData } from "../context/ReelDataContext";
import EditableNumber from "./EditableNumber";

export default function EngagementIconRow() {
  const { state, dispatch } = useReelData();

  const ICONS = [
    { Icon: Heart, field: "likes", count: state.likes },
    { Icon: MessageCircle, field: "comments", count: state.comments },
    { Icon: RepostIcon, field: "reposts", count: state.reposts },
    { Icon: Send, field: "shares", count: state.shares },
    { Icon: Bookmark, field: "saves", count: state.saves },
  ];

  return (
    <View style={styles.container}>
      {ICONS.map(({ Icon, field, count }, index) => (
        <View key={index} style={styles.item}>
          {Icon === MessageCircle ? (
            <View style={{ transform: [{ scaleX: -1 }] }}>
              <Icon size={22} color="#111111" strokeWidth={2.25} />
            </View>
          ) : (
            <Icon size={22} color="#111111" strokeWidth={2.25} />
          )}
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
    paddingVertical: 24,
  },
  item: {
    alignItems: "center",
    flex: 1,
  },
  count: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#111111",
    marginTop: 10,
  },
});
