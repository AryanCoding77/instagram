import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import VideoPreviewCard from "../components/VideoPreviewCard";
import EngagementIconRow from "../components/EngagementIconRow";
import Tabs from "../components/Tabs";
import OverviewTab from "./OverviewTab";
import EngagementTab from "./EngagementTab";
import AudienceTab from "./AudienceTab";
import SkeletonLoader from "../components/SkeletonLoader";
import FadeToast from "../components/FadeToast";
import { useReelData } from "../context/ReelDataContext";

const TAB_NAMES = ["Overview", "Engagement", "Audience"];

export default function ReelInsightsScreen() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const { state } = useReelData();

  useEffect(() => {
    // Simulate data loading for 0.5-1 second
    const loadingTime = Math.random() * 500 + 500; // Random between 500ms and 1000ms
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingTime);

    return () => clearTimeout(timer);
  }, []);

  // Show toast when entering edit mode for the first time
  useEffect(() => {
    if (state.isEditing && !showToast) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [state.isEditing]);

  // Handle tab change with keyboard dismiss
  const handleTabChange = (tab) => {
    Keyboard.dismiss();
    setActiveTab(tab);
  };

  // The video section is always at index 0, so tabs stick at index 1
  const stickyIndex = 1;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Sticky Header */}
      <Header />

      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          stickyHeaderIndices={[stickyIndex]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Video preview + icon row — always shown on all tabs */}
          <View style={styles.videoSection}>
            <VideoPreviewCard width={130} showPlayIcon={false} />
            <EngagementIconRow />
          </View>

          {/* Tab bar (will stick to top of ScrollView) */}
          <Tabs tabs={TAB_NAMES} active={activeTab} onChange={handleTabChange} />

          {/* Tab content */}
          <View style={styles.tabContent}>
            {activeTab === "Overview" && <OverviewTab />}
            {activeTab === "Engagement" && <EngagementTab />}
            {activeTab === "Audience" && <AudienceTab />}
          </View>
        </ScrollView>
      )}

      <FadeToast
        message="Tap any number or label to edit"
        visible={showToast}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  videoSection: {
    backgroundColor: "#FFFFFF",
    paddingTop: 16,
  },
  tabContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
