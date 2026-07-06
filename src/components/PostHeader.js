import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Music2, MoreVertical } from "lucide-react-native";
import { C } from "../constants/colors";

export default function PostHeader({ user, audioLabel }) {
  return (
    <View style={styles.header}>
      {/* User avatar */}
      <Image source={{ uri: user.avatarUri }} style={styles.avatar} resizeMode="cover" />

      {/* Username & Subtitle */}
      <View style={styles.userInfo}>
        <Text style={styles.username}>{user.username}</Text>
        {audioLabel && (
          <View style={styles.audioRow}>
            <Music2 size={11} color={C.textGray} />
            <Text style={styles.audioText} numberOfLines={1}>
              {audioLabel}
            </Text>
          </View>
        )}
      </View>

      {/* Menu button */}
      <TouchableOpacity activeOpacity={0.7} style={styles.menuBtn}>
        <MoreVertical size={20} color={C.white} strokeWidth={1.75} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 48,
    backgroundColor: C.black,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  username: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: C.white,
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 1,
  },
  audioText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: C.textGray,
    maxWidth: "90%",
  },
  menuBtn: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
