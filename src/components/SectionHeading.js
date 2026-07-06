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
        <Text style={styles.title}>{title}</Text>
        <Info size={18} color="#111111" strokeWidth={2.25} />
      </View>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 0,
    marginBottom: 8,
  },
  editingBorder: {
    borderLeftWidth: 3,
    borderLeftColor: "#DD2A7B",
    paddingLeft: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#111111",
    marginRight: 8,
    transform: [{ scaleY: 1.08 }],
    letterSpacing: 0.8,
  },
  subtext: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#8E8E8E",
    marginTop: 4,
  },
});
