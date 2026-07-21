import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Music2, MoreVertical } from "lucide-react-native";
import { C } from "../constants/colors";

export default function PostHeader({ user, audioLabel }) {
  return (
    <View style={styles.header}>
      <View style={styles.leftGroup}>
        <Image source={{ uri: user.avatarUri }} style={styles.avatar} resizeMode="cover" />

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
      </View>

      <View style={styles.rightGroup}>
        <TouchableOpacity activeOpacity={0.8} style={styles.followBtn}>
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={styles.menuBtn}>
          <MoreVertical size={20} color={C.black} strokeWidth={1.75} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 48,
    backgroundColor: C.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
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
    minWidth: 0,
  },
  username: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: C.black,
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 1,
  },
  audioText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: C.textGray,
    maxWidth: "100%",
    flexShrink: 1,
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 8,
  },
  followBtn: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  followText: {
    color: C.black,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  menuBtn: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
