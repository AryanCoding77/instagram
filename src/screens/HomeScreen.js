import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeHeader from "../components/HomeHeader";
import StoriesRow from "../components/StoriesRow";
import FeedPost from "../components/FeedPost";
import BottomTabBar from "../components/BottomTabBar";
import { FEED_POSTS, STORIES } from "../constants/mockData";
import { C } from "../constants/colors";

export default function HomeScreen() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <HomeHeader />

      <FlatList
        data={FEED_POSTS}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<StoriesRow stories={STORIES} />}
        renderItem={({ item }) => <FeedPost post={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        initialNumToRender={3}
        windowSize={5}
      />

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
    paddingBottom: 90,
  },
});
