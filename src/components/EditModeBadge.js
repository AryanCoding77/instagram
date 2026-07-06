import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EditModeBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>✏ Editing</Text>
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
  },
  text: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
});
