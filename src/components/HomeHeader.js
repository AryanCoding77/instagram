import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Plus, Heart } from "lucide-react-native";
import { C } from "../constants/colors";
import InstagramLogo from "../../assets/instagram-logo.svg";

export default function HomeHeader() {
  return (
    <View style={styles.header}>
      {/* Left icon */}
      <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
        <Plus size={28} color={C.black} strokeWidth={1.75} />
      </TouchableOpacity>

      {/* Center logo (kept centered and contained so it doesn't clip on the edges) */}
      <View style={styles.logoContainer} pointerEvents="none">
        <InstagramLogo width={94} height={27} />
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
    height: 50,
    backgroundColor: C.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    position: "relative",
  },
  iconBtn: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  logoContainer: {
    position: "absolute",
    left: 52,
    right: 52,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
