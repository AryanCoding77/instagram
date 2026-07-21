import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  AtSign,
  Check,
  ChevronRight,
  ChevronUp,
  Circle,
  CircleAlert,
  TrendingUp,
  X,
} from "lucide-react-native";
import { useProfileData } from "../context/ProfileDataContext";
import { fetchInstagramProfile, fetchInstagramReels } from "../services/apifyService";
import { formatCount } from "../constants/profileData";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const COLLAPSED_VISIBLE_RATIO = 0.52;
const EXPANDED_VISIBLE_RATIO = 0.95;

const STEP_IDS = ["start", "profile", "reels", "apply"];

const STEP_LABELS = {
  start: "Connecting to Apify...",
  profile: "Fetching profile and bio...",
  reels: "Fetching top 15 reels...",
  apply: "Applying data to profile...",
};

const createIdleSteps = () =>
  STEP_IDS.reduce((acc, id) => {
    acc[id] = "waiting";
    return acc;
  }, {});

const initialProgress = {
  isRunning: false,
  steps: createIdleSteps(),
  error: null,
};

const mapFetchError = (message) => {
  if (!message) return "Something went wrong while fetching the profile.";
  if (message.includes("No profile data returned")) {
    return "Account not found or is private.";
  }
  if (message.includes("Invalid Apify token")) {
    return "Invalid Apify token. Update EXPO_PUBLIC_APIFY_TOKEN in .env.local.";
  }
  if (message.toLowerCase().includes("network")) {
    return "No internet connection. Check your connection and try again.";
  }
  return message;
};

const formatStatInput = (value) => {
  const n = typeof value === "number" ? value : Number(value) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${n}`;
};

const parseStatInput = (value) => {
  const s = String(value || "").trim().toUpperCase();
  if (!s) return 0;
  if (s.endsWith("M")) return Math.round(parseFloat(s) * 1_000_000) || 0;
  if (s.endsWith("K")) return Math.round(parseFloat(s) * 1_000) || 0;
  const n = parseInt(s.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
};

function StepIcon({ state }) {
  if (state === "active") {
    return <ActivityIndicator size="small" color="#111111" />;
  }

  if (state === "done") {
    return (
      <View style={[styles.stepIconBase, styles.stepIconDone]}>
        <Check size={10} color="#FFFFFF" strokeWidth={3} />
      </View>
    );
  }

  if (state === "error") {
    return (
      <View style={[styles.stepIconBase, styles.stepIconError]}>
        <X size={10} color="#FFFFFF" strokeWidth={3} />
      </View>
    );
  }

  return <View style={styles.stepIconWaiting} />;
}

function EditField({
  label,
  value,
  onChangeText,
  multiline = false,
  keyboardType = "default",
  placeholder = "",
  maxLength,
}) {
  return (
    <View style={styles.editFieldWrap}>
      <Text style={styles.editFieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor="#C0C0C0"
        maxLength={maxLength}
        style={[styles.editFieldInput, multiline && styles.editFieldInputMultiline]}
      />
      {typeof maxLength === "number" ? (
        <Text style={styles.editFieldCount}>
          {String(value || "").length}/{maxLength}
        </Text>
      ) : null}
    </View>
  );
}

function ToggleRow({ icon, label, description, value, onToggle }) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleIconBubble}>{icon}</View>
      <View style={styles.toggleTextCol}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#E0E0E0", true: "#111111" }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E0E0E0"
      />
    </View>
  );
}

export default function ProfileEditorSheet() {
  const { state, dispatch } = useProfileData();
  const profile = state.profile;

  const collapsedTop = useMemo(
    () => SCREEN_HEIGHT - SCREEN_HEIGHT * COLLAPSED_VISIBLE_RATIO,
    []
  );
  const expandedTop = useMemo(
    () => SCREEN_HEIGHT - SCREEN_HEIGHT * EXPANDED_VISIBLE_RATIO,
    []
  );

  const sheetTop = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetLift = useRef(new Animated.Value(0)).current;
  const currentTopRef = useRef(SCREEN_HEIGHT);
  const dragStartTopRef = useRef(SCREEN_HEIGHT);
  const prevEditingRef = useRef(false);

  const [visible, setVisible] = useState(false);
  const [snapIndex, setSnapIndex] = useState(0);
  const [progress, setProgress] = useState(initialProgress);
  const [localProfile, setLocalProfile] = useState(() => ({ ...profile }));
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    setLocalProfile({ ...profile });
  }, [profile, state.isEditing]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (event) => {
      const nextHeight = event?.endCoordinates?.height || 0;
      setKeyboardHeight(nextHeight);
      console.log("[ProfileEditorSheet] keyboard shown", { nextHeight });
      Animated.timing(sheetLift, {
        toValue: Math.min(nextHeight * 0.85, 280),
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
      console.log("[ProfileEditorSheet] keyboard hidden");
      Animated.timing(sheetLift, {
        toValue: 0,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [sheetLift]);

  useEffect(() => {
    if (state.isEditing) {
      setVisible(true);
      setSnapIndex(0);
      setProgress(initialProgress);
      setKeyboardHeight(0);
      sheetTop.setValue(SCREEN_HEIGHT);
      backdropOpacity.setValue(0);
      sheetLift.setValue(0);
      console.log("[ProfileEditorSheet] editor opened", {
        username: profile.username,
        dashboardViews: profile.dashboardViews,
      });

      Animated.parallel([
        Animated.timing(sheetTop, {
          toValue: collapsedTop,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start(() => {
        currentTopRef.current = collapsedTop;
      });
    } else if (prevEditingRef.current) {
      Animated.parallel([
        Animated.timing(sheetTop, {
          toValue: SCREEN_HEIGHT,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start(() => {
        setVisible(false);
        setProgress(initialProgress);
      });
    }

    prevEditingRef.current = state.isEditing;
  }, [backdropOpacity, collapsedTop, sheetTop, state.isEditing]);

  const updateLocal = (key, value) => {
    setLocalProfile((current) => ({ ...current, [key]: value }));
  };

  const resetProgress = () => {
    setProgress(initialProgress);
  };

  const animateTo = (targetTop, index) => {
    setSnapIndex(index);
    currentTopRef.current = targetTop;

    Animated.spring(sheetTop, {
      toValue: targetTop,
      stiffness: 220,
      damping: 26,
      mass: 0.72,
      useNativeDriver: false,
    }).start();
  };

  const handleFetch = async () => {
    const username = (localProfile.username || "").trim().replace(/^@/, "");
    if (!username) {
      Alert.alert("Username required", "Enter a public Instagram username first.");
      return;
    }

    console.log("[ProfileEditorSheet] fetch requested", {
      username,
      keyboardHeight,
      snapshot: {
        dashboardVisible: !!localProfile.dashboardVisible,
        threadsRowVisible: !!localProfile.threadsRowVisible,
        highlightsVisible: !!localProfile.highlightsVisible,
      },
    });

    setProgress({
      isRunning: true,
      error: null,
      steps: {
        start: "active",
        profile: "waiting",
        reels: "waiting",
        apply: "waiting",
      },
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.log("[ProfileEditorSheet] step -> start done");
      setProgress((current) => ({
        ...current,
        steps: { ...current.steps, start: "done", profile: "active" },
      }));

      console.log("[ProfileEditorSheet] fetching profile actor...");
      const profileRaw = await fetchInstagramProfile(username);
      console.log("[ProfileEditorSheet] profile actor complete", {
        followersCount: profileRaw.followersCount,
        postsCount: profileRaw.postsCount,
        latestPosts: profileRaw.latestPosts?.length || 0,
        highlights: profileRaw.highlights?.length || 0,
        threadsLabel: profileRaw.threadsLabel || "",
        noteText: profileRaw.noteText || "",
      });

      setProgress((current) => ({
        ...current,
        steps: { ...current.steps, profile: "done", reels: "active" },
      }));

      const extractedHighlights = Array.isArray(profileRaw.highlights) ? profileRaw.highlights : [];
      const extractedThreadsLabel = (profileRaw.threadsLabel || "").trim();
      const extractedNoteText = (profileRaw.noteText || "").trim();

      console.log("[ProfileEditorSheet] fetching reels actor...");
      let reels = await fetchInstagramReels(username);
      if (!reels.length) {
        console.log("[ProfileEditorSheet] reels actor returned no posts, falling back to profile latestPosts...");
        reels = Array.isArray(profileRaw.latestPosts) ? profileRaw.latestPosts : [];
      }
      console.log("[ProfileEditorSheet] content extraction complete", {
        posts: reels.length,
        highlights: extractedHighlights.length,
        threadsLabel: extractedThreadsLabel,
        noteText: extractedNoteText,
      });

      setProgress((current) => ({
        ...current,
        steps: { ...current.steps, reels: "done", apply: "active" },
      }));

      await new Promise((resolve) => setTimeout(resolve, 250));
      console.log("[ProfileEditorSheet] applying profile data");
      dispatch({
        type: "MERGE_PROFILE",
        updates: {
          username,
          displayName: profileRaw.fullName || username,
          bio: profileRaw.biography || "",
          profilePicUri: profileRaw.profilePicUrl || localProfile.profilePicUri,
          followersCount: profileRaw.followersCount || 0,
          followingCount: profileRaw.followsCount || 0,
          postsCount: profileRaw.postsCount || 0,
          externalUrl: profileRaw.externalUrl || "",
          isVerified: profileRaw.verified || false,
          reels,
          highlightItems: extractedHighlights,
          highlightsVisible: extractedHighlights.length > 0,
          noteText: extractedNoteText || localProfile.noteText || "",
          noteVisible: Boolean(extractedNoteText),
          threadsLabel: extractedThreadsLabel,
          threadsRowVisible: Boolean(extractedThreadsLabel),
        },
      });
      dispatch({ type: "SET_LAST_LOADED_USERNAME", value: username });
      console.log("[ProfileEditorSheet] fetch complete");
      setProgress((current) => ({
        ...current,
        isRunning: false,
        error: null,
        steps: { ...current.steps, apply: "done" },
      }));
    } catch (error) {
      console.log("[ProfileEditorSheet] fetch failed", error);
      setProgress((current) => {
        const failedStep = STEP_IDS.find((id) => current.steps[id] === "active") || "start";
        return {
          ...current,
          isRunning: false,
          error: mapFetchError(error?.message),
          steps: { ...current.steps, [failedStep]: "error" },
        };
      });
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets?.[0]) {
      const profilePicUri = result.assets[0].uri;
      updateLocal("profilePicUri", profilePicUri);
      dispatch({
        type: "SET_PROFILE",
        data: { ...localProfile, profilePicUri },
      });
    }
  };

  const handleApply = () => {
    dispatch({
      type: "SET_PROFILE",
      data: {
        ...localProfile,
        dashboardVisible: localProfile.dashboardVisible ?? true,
        threadsRowVisible: localProfile.threadsRowVisible ?? true,
        highlightsVisible: localProfile.highlightsVisible ?? true,
      },
    });
  };

  const handleClose = () => {
    dispatch({ type: "SET_EDITING", value: false });
  };

  const sheetPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dy) > 6 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderGrant: () => {
          dragStartTopRef.current = currentTopRef.current;
        },
        onPanResponderMove: (_, gestureState) => {
          const nextTop = Math.min(
            SCREEN_HEIGHT,
            Math.max(expandedTop, dragStartTopRef.current + gestureState.dy)
          );
          currentTopRef.current = nextTop;
          sheetTop.setValue(nextTop);
          const t = (nextTop - expandedTop) / (SCREEN_HEIGHT - expandedTop || 1);
          backdropOpacity.setValue(1 - t);
        },
        onPanResponderRelease: (_, gestureState) => {
          const shouldExpand = gestureState.dy < -70 || gestureState.vy < -0.6;
          const shouldCollapse = gestureState.dy > 70 || gestureState.vy > 0.6;

          if (shouldExpand) {
            animateTo(expandedTop, 1);
            return;
          }

          if (shouldCollapse) {
            animateTo(collapsedTop, 0);
            return;
          }

          const midpoint = (collapsedTop + expandedTop) / 2;
          const nearest = currentTopRef.current <= midpoint ? expandedTop : collapsedTop;
          animateTo(nearest, nearest === expandedTop ? 1 : 0);
        },
      }),
    [backdropOpacity, collapsedTop, expandedTop, sheetTop]
  );

  if (!visible) {
    return null;
  }

  const showManualSection = snapIndex === 1;

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={handleClose}>
      <View style={styles.modalRoot}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose}>
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        </Pressable>

        <Animated.View
          style={[
            styles.sheet,
            {
              top: sheetTop,
              transform: [{ translateY: Animated.multiply(sheetLift, -1) }],
            },
          ]}
        >
          <View style={styles.handleArea} {...sheetPanResponder.panHandlers}>
            <View style={styles.handle} />
            <TouchableOpacity activeOpacity={0.75} onPress={handleClose} style={styles.doneButton}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: 34 + keyboardHeight + (showManualSection ? 20 : 8) },
            ]}
          >
            <View style={styles.titleWrap}>
              <Text style={styles.title}>Load from Instagram</Text>
              <Text style={styles.subtitle}>
                Fetch public profile data, then expand to edit the preview manually.
              </Text>
            </View>

            <View style={styles.fetchCard}>
              <View style={styles.fetchRow}>
                <View style={styles.fetchInputWrap}>
                  <Text style={styles.fetchLabel}>Username</Text>
                <TextInput
                  value={localProfile.username}
                  onChangeText={(value) => updateLocal("username", value)}
                  placeholder="username"
                  placeholderTextColor="#C0C0C0"
                  autoCapitalize="none"
                  onFocus={() => console.log("[ProfileEditorSheet] username input focused")}
                  onBlur={() => console.log("[ProfileEditorSheet] username input blurred")}
                  style={styles.fetchInput}
                />
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleFetch}
                  disabled={progress.isRunning}
                  style={[styles.fetchButton, progress.isRunning && styles.fetchButtonDisabled]}
                >
                  <Text style={styles.fetchButtonText}>
                    {progress.isRunning ? "Fetching..." : "Fetch"}
                  </Text>
                </TouchableOpacity>
              </View>

              {progress.isRunning ? (
                <View style={styles.progressCard}>
                  {STEP_IDS.map((stepId) => (
                    <View key={stepId} style={styles.stepRow}>
                      <StepIcon state={progress.steps[stepId]} />
                      <Text
                        style={[
                          styles.stepLabel,
                          progress.steps[stepId] === "waiting" && styles.stepLabelWaiting,
                        ]}
                      >
                        {STEP_LABELS[stepId]}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {state.lastLoadedUsername ? (
                <View style={styles.lastLoadedRow}>
                  <Text style={styles.lastLoadedText}>
                    Last loaded: @{state.lastLoadedUsername}
                  </Text>
                  <TouchableOpacity activeOpacity={0.7} onPress={handleFetch}>
                    <Text style={styles.reloadText}>Reload</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            {!showManualSection ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => animateTo(expandedTop, 1)}
                style={styles.expandHint}
              >
                <ChevronUp size={14} color="#8E8E8E" strokeWidth={2} />
                <Text style={styles.expandHintText}>Or edit manually</Text>
              </TouchableOpacity>
            ) : null}

            {showManualSection ? (
              <View style={styles.manualSection}>
                <View style={styles.divider} />
                <Text style={styles.sectionTitle}>Edit manually</Text>

                <TouchableOpacity activeOpacity={0.8} onPress={handlePickImage} style={styles.photoRow}>
                  <Image source={{ uri: localProfile.profilePicUri }} style={styles.photo} />
                  <View style={styles.photoCopy}>
                    <Text style={styles.photoTitle}>Profile photo</Text>
                    <Text style={styles.photoSubtitle}>Tap to change from your photo library</Text>
                  </View>
                  <ChevronRight size={16} color="#C0C0C0" strokeWidth={2} />
                </TouchableOpacity>

                <EditField
                  label="Username"
                  value={localProfile.username}
                  onChangeText={(value) => updateLocal("username", value)}
                  placeholder="username"
                  maxLength={30}
                />

                <EditField
                  label="Display name"
                  value={localProfile.displayName}
                  onChangeText={(value) => updateLocal("displayName", value)}
                  placeholder="Full name"
                  maxLength={65}
                />

                <EditField
                  label="Bio"
                  value={localProfile.bio}
                  onChangeText={(value) => updateLocal("bio", value)}
                  multiline
                  placeholder="Write a caption..."
                  maxLength={150}
                />

                <View style={styles.statsSection}>
                  <Text style={styles.statsLabel}>Stats</Text>
                  <View style={styles.statsRow}>
                    {[
                      { label: "Posts", key: "postsCount" },
                      { label: "Followers", key: "followersCount" },
                      { label: "Following", key: "followingCount" },
                    ].map(({ label, key }) => (
                      <View key={key} style={styles.statInputCol}>
                        <Text style={styles.statMiniLabel}>{label}</Text>
                        <TextInput
                          value={formatStatInput(localProfile[key])}
                          onChangeText={(value) => updateLocal(key, parseStatInput(value))}
                          keyboardType="numeric"
                          style={styles.statInput}
                        />
                      </View>
                    ))}
                  </View>
                </View>

                <EditField
                  label="Dashboard views (last 30 days)"
                  value={formatStatInput(localProfile.dashboardViews)}
                  onChangeText={(value) => updateLocal("dashboardViews", parseStatInput(value))}
                  keyboardType="numeric"
                  placeholder="e.g. 515.7K"
                />

                <View style={styles.dividerLoose} />
                <Text style={styles.sectionTitle}>Show / hide sections</Text>
                <Text style={styles.sectionSubtitle}>
                  These changes apply immediately to the profile preview.
                </Text>

                <ToggleRow
                  icon={<Circle size={18} color="#111111" strokeWidth={1.7} />}
                  label="Story highlights"
                  description={
                    localProfile.highlightsVisible
                      ? "Showing all highlight circles"
                      : "Only showing the New circle"
                  }
                  value={!!localProfile.highlightsVisible}
                  onToggle={(value) => {
                    updateLocal("highlightsVisible", value);
                    dispatch({
                      type: "MERGE_PROFILE",
                      updates: {
                        highlightsVisible: value,
                        showHighlights: value,
                      },
                    });
                  }}
                />

                <ToggleRow
                  icon={<AtSign size={18} color="#111111" strokeWidth={1.7} />}
                  label="Threads & links row"
                  description={
                    localProfile.threadsRowVisible
                      ? "Showing Threads link + Add button"
                      : "Hidden below bio"
                  }
                  value={!!localProfile.threadsRowVisible}
                  onToggle={(value) => {
                    updateLocal("threadsRowVisible", value);
                    dispatch({
                      type: "MERGE_PROFILE",
                      updates: {
                        threadsRowVisible: value,
                        showThreadsRow: value,
                      },
                    });
                  }}
                />

                <ToggleRow
                  icon={<TrendingUp size={18} color="#111111" strokeWidth={1.7} />}
                  label="Professional dashboard"
                  description={
                    localProfile.dashboardVisible
                      ? `Showing ${formatCount(localProfile.dashboardViews)} views`
                      : "Card hidden from profile"
                  }
                  value={!!localProfile.dashboardVisible}
                  onToggle={(value) => {
                    updateLocal("dashboardVisible", value);
                    dispatch({
                      type: "MERGE_PROFILE",
                      updates: {
                        dashboardVisible: value,
                      },
                    });
                  }}
                />

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleApply}
                  style={styles.applyButton}
                >
                  <Text style={styles.applyButtonText}>Apply changes</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.34)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
  },
  handleArea: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  handle: {
    position: "absolute",
    top: 12,
    width: 38,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#D9D9D9",
  },
  doneButton: {
    position: "absolute",
    right: 14,
    top: 8,
    height: 28,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  doneText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#0095F6",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 34,
    backgroundColor: "#FFFFFF",
  },
  titleWrap: {
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#111111",
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: "#8E8E8E",
    marginTop: 4,
  },
  fetchCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    padding: 12,
  },
  fetchRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  fetchInputWrap: {
    flex: 1,
  },
  fetchLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "#8E8E8E",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  fetchInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#111111",
  },
  fetchButton: {
    minWidth: 88,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  fetchButtonDisabled: {
    opacity: 0.72,
  },
  fetchButtonText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  progressCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    backgroundColor: "#FFFFFF",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 28,
  },
  stepIconBase: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  stepIconDone: {
    backgroundColor: "#111111",
  },
  stepIconError: {
    backgroundColor: "#FF3040",
  },
  stepIconWaiting: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#DBDBDB",
  },
  stepLabel: {
    fontSize: 14,
    color: "#111111",
    fontFamily: "Inter_500Medium",
  },
  stepLabelWaiting: {
    color: "#C0C0C0",
  },
  lastLoadedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  lastLoadedText: {
    fontSize: 12,
    color: "#8E8E8E",
  },
  reloadText: {
    fontSize: 12,
    color: "#0095F6",
    fontFamily: "Inter_600SemiBold",
  },
  expandHint: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 4,
  },
  expandHintText: {
    marginTop: 2,
    fontSize: 11,
    color: "#8E8E8E",
  },
  manualSection: {
    marginTop: 8,
  },
  divider: {
    height: 0.5,
    backgroundColor: "#DBDBDB",
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#111111",
    marginBottom: 12,
  },
  photoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 10,
    gap: 14,
  },
  photo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    backgroundColor: "#F2F2F2",
  },
  photoCopy: {
    flex: 1,
  },
  photoTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#111111",
  },
  photoSubtitle: {
    fontSize: 12,
    color: "#8E8E8E",
    marginTop: 2,
  },
  editFieldWrap: {
    paddingHorizontal: 0,
    marginBottom: 14,
  },
  editFieldLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "#8E8E8E",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  editFieldInput: {
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 10,
    backgroundColor: "#F9F9F9",
    fontSize: 14,
    color: "#111111",
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
  },
  editFieldInputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  editFieldCount: {
    fontSize: 11,
    color: "#C0C0C0",
    textAlign: "right",
    marginTop: 3,
  },
  statsSection: {
    marginBottom: 14,
  },
  statsLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "#8E8E8E",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statInputCol: {
    flex: 1,
  },
  statMiniLabel: {
    fontSize: 11,
    color: "#8E8E8E",
    marginBottom: 4,
    textAlign: "center",
  },
  statInput: {
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 10,
    backgroundColor: "#F9F9F9",
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#111111",
    height: 44,
    textAlign: "center",
  },
  dividerLoose: {
    height: 0.5,
    backgroundColor: "#DBDBDB",
    marginTop: 6,
    marginBottom: 14,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#8E8E8E",
    marginTop: -6,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 14,
  },
  toggleIconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleTextCol: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#111111",
  },
  toggleDescription: {
    fontSize: 12,
    color: "#8E8E8E",
    marginTop: 1,
  },
  applyButton: {
    marginTop: 6,
    marginBottom: 20,
    height: 48,
    backgroundColor: "#111111",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  bottomSpacer: {
    height: 24,
  },
});
