import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Plus, Heart } from "lucide-react-native";
import { C } from "../constants/colors";

export default function HomeHeader() {
  return (
    <View style={styles.header}>
      {/* Left icon */}
      <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
        <Plus size={28} color={C.black} strokeWidth={1.75} />
      </TouchableOpacity>

      {/* Center logo (absolute position so it doesn't get pushed by side icons) */}
      <View style={styles.logoContainer} pointerEvents="none">
        <Text style={styles.logoText}>Instagram</Text>
      </View>

      {/* Right icon */}
      <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
        <Heart size={26} color={C.black} strokeWidth={1.75} fill="none" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 52,
    backgroundColor: C.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    position: "relative",
  },
  iconBtn: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  logoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontFamily: "GrandHotel_400Regular",
    fontSize: 36,
    color: C.black,
    letterSpacing: -0.5,
    textAlign: "center",
  },
});
