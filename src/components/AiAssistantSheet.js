import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, ImagePlus, Sparkles, X } from "lucide-react-native";
import { sendGeminiMessage } from "../services/geminiService";
import { useReelData } from "../context/ReelDataContext";
import { useProfileData } from "../context/ProfileDataContext";
import { buildHistoricalPromptContext, filterReelsWithinLast30Days, summarizeReels } from "../utils/insightsBaseline";

const INITIAL_MESSAGE = {
  id: "intro",
  role: "model",
  text: "Ask for new insights, graph edits, or campaign-style analytics. I will use the loaded reel history, return strict JSON internally, and apply it to the screen.",
};

const PROMPT_SUGGESTIONS = [
  "Generate realistic filler-post insights from the loaded reel history.",
  "Generate campaign insights for 28000 base views and make the overview graph spike hard early.",
  "Use the attached screenshot and rebuild the retention plus engagement graphs to match it.",
  "Keep current views, but make likes, saves, and shares look more believable for this account.",
];

function makeMessage(role, text, images = []) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    images,
  };
}

function mapConversationForApi(messages) {
  return messages.map((message) => ({
    role: message.role,
    text: message.text,
    images: message.images || [],
  }));
}

function parseGeminiJson(text) {
  const raw = String(text || "").trim();
  if (!raw) {
    throw new Error("Gemini returned an empty response.");
  }

  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fenceMatch ? fenceMatch[1].trim() : raw;
  return JSON.parse(jsonText);
}

function isJsonLike(text) {
  const trimmed = String(text || "").trim();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
}

async function requestCameraAndPickImage() {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Camera permission is required to take a reference photo.");
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    quality: 0.7,
    allowsEditing: false,
    base64: true,
  });

  if (result.canceled || !result.assets?.[0]) {
    return null;
  }

  const asset = result.assets[0];
  return {
    id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    uri: asset.uri,
    base64: asset.base64 || "",
    mimeType: asset.mimeType || "image/jpeg",
  };
}

async function pickLibraryImage() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Photo library permission is required to attach an image.");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.7,
    allowsEditing: false,
    base64: true,
  });

  if (result.canceled || !result.assets?.[0]) {
    return null;
  }

  const asset = result.assets[0];
  return {
    id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    uri: asset.uri,
    base64: asset.base64 || "",
    mimeType: asset.mimeType || "image/jpeg",
  };
}

function formatPercentValue(value) {
  const num = Number(value) || 0;
  return `${Number(num.toFixed(1))}%`;
}

function buildSelectedReelState(reel, fallbackState) {
  const views = Number(reel?.viewCount ?? reel?.views ?? fallbackState.views ?? 0) || 0;
  const likes = Number(reel?.likesCount ?? reel?.likes ?? fallbackState.likes ?? 0) || 0;
  const comments = Number(reel?.commentsCount ?? reel?.comments ?? fallbackState.comments ?? 0) || 0;
  const reposts = Number(reel?.repostsCount ?? reel?.reposts ?? fallbackState.reposts ?? 0) || 0;
  const shares = Number(reel?.sharesCount ?? reel?.shares ?? fallbackState.shares ?? 0) || 0;
  const saves = Number(reel?.savesCount ?? reel?.saves ?? fallbackState.saves ?? 0) || 0;
  const accountsReached = Number(reel?.accountsReached ?? Math.round(views * 0.88)) || 0;
  const follows = Number(reel?.follows ?? fallbackState.follows ?? 0) || 0;

  return {
    reel_id: String(reel?.id || reel?.shortCode || reel?.thumbnailUri || Math.random().toString(36).slice(2, 8)),
    summary: {
      views,
      accountsReached,
      avgWatchTime: reel?.avgWatchTime || fallbackState.avgWatchTime || "10s",
      follows,
    },
    metrics: {
      likes,
      comments,
      reposts,
      shares,
      saves,
    },
    rates: Array.isArray(fallbackState.rates)
      ? fallbackState.rates.map((rate) => ({
          label: rate.label,
          value: typeof rate.value === "string" ? rate.value : formatPercentValue(rate.value),
        }))
      : [],
    topSources: Array.isArray(fallbackState.topSources)
      ? fallbackState.topSources.map((source) => ({
          label: source.label || source.name,
          percentage: Number(source.percentage ?? source.value ?? 0) || 0,
        }))
      : [],
    viewsOverTime: Array.isArray(fallbackState.viewsOverTime)
      ? fallbackState.viewsOverTime.map((point) => Number(point?.thisReel ?? point?.views ?? 0) || 0)
      : [],
    retentionPoints: Array.isArray(fallbackState.retentionPoints) ? [...fallbackState.retentionPoints] : [],
    audience: {
      followersPercent: Number(fallbackState.followersPercent ?? 0) || 0,
      genderMen: Number(fallbackState.genderMen ?? 0) || 0,
      ageGroups: Array.isArray(fallbackState.ageGroups)
        ? fallbackState.ageGroups.map((group) => ({
            label: group.label,
            percentage: Number(group.percentage ?? group.value ?? 0) || 0,
          }))
        : [],
      countries: Array.isArray(fallbackState.countries)
        ? fallbackState.countries.map((country) => ({
            label: country.label || country.name,
            percentage: Number(country.percentage ?? country.value ?? 0) || 0,
          }))
        : [],
    },
  };
}

function buildCurrentAnalyticsState(profile, reelState, sourceReels) {
  const handle = `@${profile?.username || reelState.selectedPostData?.username || "unknown"}`;
  const allReels = Array.isArray(sourceReels) ? sourceReels.filter(Boolean) : [];
  const recentReels = filterReelsWithinLast30Days(allReels);
  const reelPool = recentReels.length ? recentReels : allReels;
  const sortedReels = summarizeReels(reelPool).top3Reels;
  const recentSummary = summarizeReels(reelPool);
  const derivedAccountsReached = Math.max(
    Number(reelState.accountsReached ?? 0) || 0,
    Math.round(recentSummary.views * 0.88)
  );
  const derivedEngagedAccounts =
    recentSummary.likes + recentSummary.comments + recentSummary.shares + recentSummary.saves;

  const selectedReels = (sortedReels.length ? sortedReels : [reelState.selectedPostData].filter(Boolean)).map((reel) =>
    buildSelectedReelState(reel, reelState)
  );

  return {
    account_handle: handle,
    selected_reels: selectedReels,
    dashboard_30d: {
      overview: {
        total_views_30d: recentSummary.views || 0,
        accounts_reached: derivedAccountsReached,
        accounts_reached_change: "+0%",
        accounts_engaged: derivedEngagedAccounts || Number(reelState.interactions ?? 0) || 0,
        accounts_engaged_change: "+0%",
        total_followers: Number(profile?.followersCount ?? reelState.followersCount ?? 0) || 0,
        net_followers_30d: Number(reelState.netFollowers ?? reelState.follows ?? 0) || 0,
        profile_visits_30d: Math.max(
          Number(reelState.profileVisits ?? 0) || 0,
          Math.round(recentSummary.shares * 1.2 + recentSummary.saves * 0.8)
        ),
      },
      audience: {
        followers_count: Number(reelState.followersCount ?? profile?.followersCount ?? 0) || 0,
        followers_growth_change: String(reelState.followersGrowthChange ?? "+0%"),
        followers_percent: Number(reelState.followersPercent ?? 0) || 0,
        non_followers_percent: Number((100 - (Number(reelState.followersPercent ?? 0) || 0)).toFixed(1)),
        genderMen: Number(reelState.genderMen ?? 0) || 0,
        ageGroups: Array.isArray(reelState.ageGroups)
          ? reelState.ageGroups.map((group) => ({
              label: group.label,
              percentage: Number(group.percentage ?? group.value ?? 0) || 0,
            }))
          : [],
        countries: Array.isArray(reelState.countries)
          ? reelState.countries.map((country) => ({
              label: country.label || country.name,
              percentage: Number(country.percentage ?? country.value ?? 0) || 0,
            }))
          : [],
        top_cities: Array.isArray(reelState.topCities)
          ? reelState.topCities.map((city) => ({
              label: city.label || city.name,
              percentage: Number(city.percentage ?? city.value ?? 0) || 0,
            }))
          : [],
        active_times: Array.isArray(reelState.activeTimes)
          ? reelState.activeTimes.map((item) => ({
              day: item.day,
              value: Number(item.value) || 0,
            }))
          : [],
        top_times: Array.isArray(reelState.topTimes)
          ? reelState.topTimes.map((item) => ({
              day: item.day,
              range: item.range,
            }))
          : [],
      },
      daily_reach_trend: Array.isArray(reelState.audienceGrowthPoints)
        ? reelState.audienceGrowthPoints.map((value) => Number(value) || 0)
        : [],
      follower_growth_trend: Array.isArray(reelState.audienceGrowthPoints)
        ? reelState.audienceGrowthPoints.map((value) => Number(value) || 0)
        : [],
    },
  };
}

export default function AiAssistantSheet({ visible, onClose }) {
  const { state: reelState, dispatch } = useReelData();
  const { state: profileState, dispatch: profileDispatch } = useProfileData();
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const scrollRef = useRef(null);

  const selectedPost = reelState.selectedPostData || null;
  const sourceReels = Array.isArray(profileState.profile?.reels) ? profileState.profile.reels : [];
  const contextText = useMemo(
    () => buildHistoricalPromptContext(profileState.profile, selectedPost, sourceReels),
    [profileState.profile, selectedPost, sourceReels]
  );

  useEffect(() => {
    if (!visible) {
      return;
    }

    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd?.({ animated: true });
    }, 80);

    return () => clearTimeout(timer);
  }, [visible, messages, attachments]);

  const canSend = useMemo(
    () => (draft.trim().length > 0 || attachments.length > 0) && !isSending,
    [draft, attachments.length, isSending]
  );

  const addAttachment = (image) => {
    if (!image) return;
    setAttachments((current) => [...current, image].slice(0, 3));
  };

  const handlePickFromLibrary = async () => {
    try {
      const image = await pickLibraryImage();
      addAttachment(image);
    } catch (error) {
      setMessages((current) => [...current, makeMessage("model", error.message || "Could not attach the selected image.")]);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const image = await requestCameraAndPickImage();
      addAttachment(image);
    } catch (error) {
      setMessages((current) => [...current, makeMessage("model", error.message || "Could not open the camera.")]);
    }
  };

  const handleUseSuggestion = (text) => {
    setDraft(text);
  };

  const handleSend = async () => {
    const prompt = draft.trim() || "Use the attached visual reference and loaded reel history to generate updated insights.";
    if (!canSend) {
      return;
    }

    const userImages = attachments;
    const userMessage = makeMessage("user", prompt, userImages);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setDraft("");
    setAttachments([]);
    setIsSending(true);

    try {
      const currentState = buildCurrentAnalyticsState(profileState.profile, reelState, sourceReels);
      const reply = await sendGeminiMessage({
        accountHandle: currentState.account_handle,
        userCommand: prompt,
        currentState,
        images: userImages,
        historyContext: contextText,
      });
      const payload = parseGeminiJson(reply);
      dispatch({ type: "APPLY_GEMINI_PAYLOAD", payload });

      const dashboardOverview =
        payload?.dashboard_30d?.overview || payload?.dashboard_30d_summary?.overview || {};
      const recentReels = filterReelsWithinLast30Days(sourceReels);
      const recentSummary = summarizeReels(recentReels.length ? recentReels : sourceReels);
      const baselineOtherViews = Math.max(
        0,
        (recentSummary.views || 0) - (recentSummary.top3Views || 0)
      );
      const selectedViewsTotal = Number(
        payload?.selected_reels?.reduce?.((sum, reel) => sum + (Number(reel?.summary?.views) || 0), 0) ||
          payload?.selected_reels_insights?.reduce?.((sum, reel) => sum + (Number(reel?.summary?.views) || 0), 0) ||
          0
      );
      const dashboardViews = selectedViewsTotal > 0 ? selectedViewsTotal + baselineOtherViews : 0;
      const totalFollowers = Number(dashboardOverview.total_followers ?? 0) || 0;

      if (profileDispatch && ((Number.isFinite(dashboardViews) && dashboardViews > 0) || totalFollowers > 0)) {
        profileDispatch({
          type: "MERGE_PROFILE",
          updates: {
            ...(dashboardViews > 0 ? { dashboardViews } : {}),
            ...(totalFollowers > 0 ? { followersCount: totalFollowers } : {}),
          },
        });
      }

      setMessages((current) => [
        ...current,
        makeMessage("model", "Applied fresh insights from the loaded reel history and the latest AI payload."),
        makeMessage("model", JSON.stringify(payload, null, 2)),
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        makeMessage(
          "model",
          error?.message || "The AI request failed. Check the Gemini key, permissions, or network connection and try again."
        ),
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
          style={styles.keyboardWrap}
        >
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <View style={styles.headerCopy}>
                <Text style={styles.title}>Reel insights AI</Text>
                <Text style={styles.subtitle}>Feed it history, targets, and screenshots for stronger analytics.</Text>
              </View>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeBtn}>
                <X size={18} color="#111111" strokeWidth={2.2} />
              </TouchableOpacity>
            </View>

            <View style={styles.guideCard}>
              <View style={styles.guideIconWrap}>
                <Sparkles size={16} color="#FFFFFF" strokeWidth={2.4} />
              </View>
              <View style={styles.guideCopy}>
                <Text style={styles.guideTitle}>Best inputs for better insights</Text>
                <Text style={styles.guideText}>
                  Tell AI if you want reel-level edits or the 30-day dashboard updated, include the target view range,
                  and attach a screenshot when you want the graphs to match a visual reference.
                </Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionRow}
              style={styles.suggestionScroller}
            >
              {PROMPT_SUGGESTIONS.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  activeOpacity={0.8}
                  onPress={() => handleUseSuggestion(suggestion)}
                  style={styles.suggestionChip}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView
              ref={scrollRef}
              style={styles.messages}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {messages.map((message) => {
                const isUser = message.role === "user";
                return (
                  <View
                    key={message.id}
                    style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowModel]}
                  >
                    <View style={[styles.bubble, isUser ? styles.userBubble : styles.modelBubble, isJsonLike(message.text) && styles.jsonBubble]}>
                      {Array.isArray(message.images) && message.images.length ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.inlineImagesRow}>
                          {message.images.map((image) => (
                            <Image key={image.id} source={{ uri: image.uri }} style={styles.inlineImage} resizeMode="cover" />
                          ))}
                        </ScrollView>
                      ) : null}
                      <Text style={[styles.bubbleText, isUser && styles.userBubbleText, isJsonLike(message.text) && styles.jsonText]}>
                        {message.text}
                      </Text>
                    </View>
                  </View>
                );
              })}

              {isSending ? (
                <View style={styles.messageRow}>
                  <View style={[styles.bubble, styles.modelBubble, styles.loadingBubble]}>
                    <ActivityIndicator size="small" color="#DD2A7B" />
                  </View>
                </View>
              ) : null}
            </ScrollView>

            {attachments.length ? (
              <View style={styles.attachmentsWrap}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.attachmentsRow}>
                  {attachments.map((image) => (
                    <View key={image.id} style={styles.attachmentCard}>
                      <Image source={{ uri: image.uri }} style={styles.attachmentImage} resizeMode="cover" />
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setAttachments((current) => current.filter((item) => item.id !== image.id))}
                        style={styles.attachmentRemove}
                      >
                        <X size={12} color="#FFFFFF" strokeWidth={2.4} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <View style={styles.composer}>
              <View style={styles.toolRail}>
                <TouchableOpacity activeOpacity={0.85} onPress={handleTakePhoto} style={styles.toolBtn}>
                  <Camera size={18} color="#111111" strokeWidth={2.1} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.85} onPress={handlePickFromLibrary} style={styles.toolBtn}>
                  <ImagePlus size={18} color="#111111" strokeWidth={2.1} />
                </TouchableOpacity>
              </View>

              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Example: update the top 3 reels, smooth the 30-day dashboard, and match the attached screenshot."
                placeholderTextColor="#8D95A1"
                multiline
                style={styles.input}
              />
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSend}
                disabled={!canSend}
                style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
              >
                <Text style={styles.sendBtnText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(8, 10, 18, 0.34)",
    justifyContent: "flex-end",
  },
  keyboardWrap: {
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FCFCFD",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 14,
    minHeight: "68%",
    maxHeight: "92%",
  },
  handle: {
    width: 52,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#D0D4DA",
    alignSelf: "center",
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },
  headerCopy: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#111111",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
    color: "#667085",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF1F5",
  },
  guideCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#F6F3FF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: "#ECE6FF",
    marginBottom: 14,
  },
  guideIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  guideCopy: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#111111",
    marginBottom: 2,
  },
  guideText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
    color: "#626B78",
  },
  suggestionScroller: {
    marginBottom: 12,
  },
  suggestionRow: {
    gap: 10,
    paddingRight: 4,
  },
  suggestionChip: {
    maxWidth: 270,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8EBEF",
  },
  suggestionText: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: "Inter_500Medium",
    color: "#27303D",
  },
  messages: {
    flexGrow: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#EEF1F5",
    paddingHorizontal: 8,
    paddingTop: 8,
    marginBottom: 10,
  },
  messagesContent: {
    paddingBottom: 14,
    gap: 10,
  },
  messageRow: {
    width: "100%",
  },
  messageRowUser: {
    alignItems: "flex-end",
  },
  messageRowModel: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "92%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  userBubble: {
    backgroundColor: "#111111",
    borderBottomRightRadius: 6,
  },
  modelBubble: {
    backgroundColor: "#F5F7FA",
    borderBottomLeftRadius: 6,
  },
  jsonBubble: {
    width: "100%",
  },
  loadingBubble: {
    minWidth: 64,
    alignItems: "center",
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
    color: "#111111",
  },
  userBubbleText: {
    color: "#FFFFFF",
  },
  jsonText: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    lineHeight: 18,
  },
  inlineImagesRow: {
    gap: 8,
    marginBottom: 10,
  },
  inlineImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#E6E9EE",
  },
  attachmentsWrap: {
    marginBottom: 10,
  },
  attachmentsRow: {
    gap: 10,
  },
  attachmentCard: {
    width: 74,
    height: 74,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#E7EBF0",
  },
  attachmentImage: {
    width: "100%",
    height: "100%",
  },
  attachmentRemove: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(17,17,17,0.82)",
    alignItems: "center",
    justifyContent: "center",
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  toolRail: {
    gap: 8,
  },
  toolBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#EEF1F5",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 130,
    borderRadius: 18,
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 13,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
    color: "#111111",
    borderWidth: 1,
    borderColor: "#E7EBF0",
  },
  sendBtn: {
    minHeight: 50,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: "#DD2A7B",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.45,
  },
  sendBtnText: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
});
