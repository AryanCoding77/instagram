import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

/**
 * Tabs bar
 * Props:
 *   tabs    – array of string labels
 *   active  – currently active tab label
 *   onChange – callback(label)
 */
export default function Tabs({ tabs, active, onChange }) {
  return (
    <View style={styles.wrapper}>
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => onChange(tab)}
          >
            <Text style={[styles.label, isActive ? styles.active : styles.inactive]}>
              {tab}
            </Text>
            {isActive && <View style={styles.underline} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EFEFEF",
    backgroundColor: "#FFFFFF",
    marginTop: -10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    position: "relative",
  },
  label: {
    fontSize: 13,
  },
  active: {
    fontFamily: "Inter_600SemiBold",
    color: "#111111",
  },
  inactive: {
    fontFamily: "Inter_500Medium",
    color: "#8E8E8E",
  },
  underline: {
    position: "absolute",
    bottom: 0,
    left: 13,
    right: 13,
    height: 2,
    backgroundColor: "#111111",
    borderRadius: 1,
  },
});
