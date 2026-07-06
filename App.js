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
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ReelInsightsScreen from "./src/screens/ReelInsightsScreen";
import { ReelDataProvider, useReelData } from "./src/context/ReelDataContext";

function MainNavigator() {
  const { state } = useReelData();
  switch (state.currentScreen) {
    case "profile":
      return <ProfileScreen />;
    case "insights":
      return <ReelInsightsScreen />;
    case "home":
    default:
      return <HomeScreen />;
  }
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    GrandHotel_400Regular,
    Poppins_400Regular,
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#DD2A7B" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ReelDataProvider>
        <MainNavigator />
      </ReelDataProvider>
    </SafeAreaProvider>
  );
}

