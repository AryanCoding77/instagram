import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Info } from "lucide-react-native";
import { useReelData } from "../context/ReelDataContext";

/**
 * SectionHeading
 * Props: title, subtext (optional)
 */
export default function SectionHeading({ title, subtext }) {
  const { state } = useReelData();

  return (
    <View style={[styles.wrapper, state.isEditing && styles.editingBorder]}>
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Info size={18} color="#111111" strokeWidth={2.25} />
      </View>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 0,
    marginBottom: 4,
  },
  editingBorder: {
    borderLeftWidth: 3,
    borderLeftColor: "#DD2A7B",
    paddingLeft: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 22,
  },
  title: {
    flexShrink: 1,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#111111",
    marginRight: 8,
  },
  subtext: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#8E8E8E",
    marginTop: 4,
  },
});
