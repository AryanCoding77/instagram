import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeHeader from "../components/HomeHeader";
import StoriesRow from "../components/StoriesRow";
import FeedPost from "../components/FeedPost";
import BottomTabBar from "../components/BottomTabBar";
import { FEED_POSTS } from "../constants/mockData";
import { C } from "../constants/colors";

export default function HomeScreen() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      {/* Top Header */}
      <HomeHeader />

      {/* Main feed list */}
      <FlatList
        data={FEED_POSTS}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<StoriesRow />}
        renderItem={({ item }) => <FeedPost post={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        initialNumToRender={3}
        windowSize={5}
      />

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.white,
  },
  listContent: {
    paddingBottom: 90, // clears the absolute positioned tab bar + inset safely
  },
});
