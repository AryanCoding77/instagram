import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Pencil } from "lucide-react-native";

export default function EditModeBadge() {
  return (
    <View style={styles.badge}>
      <Pencil size={12} color="#FFFFFF" strokeWidth={2.2} />
      <Text style={styles.text}>Editing</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#DD2A7B",
    borderRadius: 999,
    height: 28,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
});
