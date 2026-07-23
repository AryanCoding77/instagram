import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import VideoPreviewCard from "../components/VideoPreviewCard";
import EngagementIconRow from "../components/EngagementIconRow";
import Tabs from "../components/Tabs";
import AiAssistantSheet from "../components/AiAssistantSheet";
import SpinnerArc from "../components/SpinnerArc";
import OverviewTab from "./OverviewTab";
import EngagementTab from "./EngagementTab";
import AudienceTab from "./AudienceTab";
import FadeToast from "../components/FadeToast";
import { useReelData } from "../context/ReelDataContext";

const TAB_NAMES = ["Overview", "Engagement", "Audience"];

const TAB_SHARED_HEADINGS = {
  Overview: "Summary",
  Engagement: "Actions after viewing",
  Audience: "Who viewed your reel",
};

export default function ReelInsightsScreen() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [loadingPhase, setLoadingPhase] = useState("spinner");
  const [showToast, setShowToast] = useState(false);
  const [aiVisible, setAiVisible] = useState(false);
  const { state, dispatch } = useReelData();

  useEffect(() => {
    const spinnerTimer = setTimeout(() => {
      setLoadingPhase("skeleton");
    }, 450);
    const contentTimer = setTimeout(() => {
      setLoadingPhase("ready");
    }, 1100);

    return () => {
      clearTimeout(spinnerTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  useEffect(() => {
    if (state.isEditing && !showToast) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showToast, state.isEditing]);

  const handleTabChange = (tab) => {
    Keyboard.dismiss();
    if (tab === "Content" && state.isEditing) {
      dispatch({ type: "SET_EDITING", value: false });
    }
    setActiveTab(tab);
  };

  const handleTitlePress = () => {
    if (activeTab === "Content") {
      return;
    }
    dispatch({ type: "SET_EDITING", value: true });
  };

  const stickyIndex = 1;
  const isLoading = loadingPhase !== "ready";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header
        onTitlePress={handleTitlePress}
        onAIPress={() => setAiVisible(true)}
        disableTitlePress={activeTab === "Content"}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[stickyIndex]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.videoSection}>
          <VideoPreviewCard width={118} showPlayIcon={false} />
          <EngagementIconRow />
        </View>

        <Tabs tabs={TAB_NAMES} active={activeTab} onChange={handleTabChange} />

        <View style={styles.sharedHeadingWrap}>
          <Text style={styles.sharedHeading}>{TAB_SHARED_HEADINGS[activeTab]}</Text>
        </View>

        <View style={styles.tabContent}>
          {activeTab === "Overview" && (
            <OverviewTab hideTopHeading isLoading={isLoading} loadingPhase={loadingPhase} />
          )}
          {activeTab === "Engagement" &&
            (isLoading ? (
              <OverviewTab hideTopHeading isLoading loadingPhase={loadingPhase} />
            ) : (
              <EngagementTab hideTopHeading />
            ))}
          {activeTab === "Audience" &&
            (isLoading ? (
              <OverviewTab hideTopHeading isLoading loadingPhase={loadingPhase} />
            ) : (
              <AudienceTab hideTopHeading />
            ))}
        </View>
      </ScrollView>

      {loadingPhase === "spinner" ? (
        <View style={styles.fullScreenLoaderOverlay} pointerEvents="auto">
          <SpinnerArc
            size={50}
            strokeWidth={1}
            duration={950}
            segmentColors={["#F4F4F4", "#E5E5E5", "#D0D0D0", "#B9B9B9", "#A0A0A0", "#878787", "#6D6D6D", "#575757", "#404040"]}
          />
        </View>
      ) : null}

      <FadeToast message="Tap any number or label to edit" visible={showToast} />
      <AiAssistantSheet visible={aiVisible} onClose={() => setAiVisible(false)} />
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
    paddingTop: 10,
  },
  tabContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  sharedHeadingWrap: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  sharedHeading: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#111111",
  },
  fullScreenLoaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
});
