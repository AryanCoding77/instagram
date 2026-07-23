import "./global.css";
import React from "react";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import { GrandHotel_400Regular } from "@expo-google-fonts/grand-hotel";
import { Poppins_400Regular, Poppins_500Medium } from "@expo-google-fonts/poppins";
import { StyleSheet } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import PostsScreen from "./src/screens/PostsScreen";
import ReelsScreen from "./src/screens/ReelsScreen";
import ReelInsightsScreen from "./src/screens/ReelInsightsScreen";
import ProfessionalDashboardScreen from "./src/screens/ProfessionalDashboardScreen";
import InsightsDetailScreen from "./src/screens/InsightsDetailScreen";
import { ReelDataProvider, useReelData } from "./src/context/ReelDataContext";
import { ProfileDataProvider } from "./src/context/ProfileDataContext";

function MainNavigator() {
  const { state } = useReelData();
  switch (state.currentScreen) {
    case "profile":
      return <ProfileScreen />;
    case "posts":
      return <PostsScreen />;
    case "reels":
      return <ReelsScreen />;
    case "insights":
      return <ReelInsightsScreen />;
    case "professionalDashboard":
      return <ProfessionalDashboardScreen />;
    case "insightsDetail":
      return <InsightsDetailScreen />;
    case "home":
    default:
      return <HomeScreen />;
  }
}

export default function App() {
  const [_fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    GrandHotel_400Regular,
    Poppins_400Regular,
    Poppins_500Medium,
  });

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ExpoStatusBar style="dark" backgroundColor="#FFFFFF" translucent={false} />
        <SafeAreaProvider>
          <ReelDataProvider>
            <ProfileDataProvider>
              <MainNavigator />
            </ProfileDataProvider>
          </ReelDataProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});

