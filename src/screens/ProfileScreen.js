import { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Plus,
  Lock,
  ChevronDown,
  Menu,
  Repeat2,
  Contact,
} from "lucide-react-native";
import Svg, { Path } from "react-native-svg";
import BottomTabBar from "../components/BottomTabBar";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CELL_SIZE = SCREEN_WIDTH / 3;

const HIGHLIGHTS = [
  { id: "h1", imageUri: "https://picsum.photos/seed/hl1/200", label: "Success" },
  { id: "h2", imageUri: "https://picsum.photos/seed/hl2/200", label: "muscle edit" },
  { id: "h3", imageUri: "https://picsum.photos/seed/hl3/200", label: "pushup" },
];

const POSTS = [
  {
    id: "1",
    thumbnailUri: "https://picsum.photos/seed/ironman/400",
    isVideo: true,
  },
];

const GridIcon = ({ color }) => (
  <View style={{ width: 22, height: 22, flexDirection: "row", flexWrap: "wrap", gap: 2 }}>
    {Array.from({ length: 9 }).map((_, i) => (
      <View
        key={i}
        style={{
          width: (22 - 2 * 2) / 3, // = 6px each square
          height: (22 - 2 * 2) / 3,
          backgroundColor: color,
          borderRadius: 0.5,
        }}
      />
    ))}
  </View>
);

const ReelsIcon = ({ color }) => (
  <View
    style={{
      width: 22,
      height: 22,
      borderRadius: 5,
      borderWidth: 1.5,
      borderColor: color,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View
      style={{
        width: 0,
        height: 0,
        borderTopWidth: 4,
        borderBottomWidth: 4,
        borderLeftWidth: 7,
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        borderLeftColor: color,
        marginLeft: 2,
      }}
    />
  </View>
);

const PersonPlusIcon = ({ color = "#111111", size = 18 }) => (
  <Svg viewBox="0 0 1044 1028" width={size} height={size * 0.985}>
    <Path
      fill={color}
      d="M 320.564 592.423 C 327.11 591.792 337.999 591.823 344.696 591.761 L 500.901 591.73 C 544.916 591.73 609.061 588.756 650.011 599.124 C 690.794 609.499 728.092 630.514 758.095 660.023 C 803.266 704.511 829.03 765.046 829.775 828.442 C 829.785 858.583 817.707 887.469 796.245 908.632 C 760.167 944.724 724.926 941.818 678.538 941.777 L 607.5 941.706 L 320.485 941.714 L 243.055 941.721 C 227.774 941.74 202.846 942.416 188.608 939.926 C 168.579 936.23 149.909 927.228 134.545 913.857 C 112.098 894.633 98.3367 867.181 96.3651 837.694 C 92.438 780.715 116.48 716.437 154.059 674.003 C 198.341 624 254.316 596.83 320.564 592.423 z"
      transform="translate(1044,0) scale(-1,1)"
    />
    <Path
      fill={color}
      d="M 457.55 122.938 C 565.689 120.118 655.62 205.535 658.366 313.676 C 661.112 421.818 575.632 511.69 467.489 514.361 C 359.452 517.031 269.686 431.652 266.942 323.616 C 264.199 215.58 349.516 125.756 457.55 122.938 z"
      transform="translate(1044,0) scale(-1,1)"
    />
    <Path
      fill={color}
      d="M 842.211 336.194 C 842.564 336.174 842.917 336.156 843.271 336.14 C 878.594 334.63 872.49 374.644 872.42 398.138 C 872.233 420.017 872.259 441.898 872.496 463.776 L 938.226 463.628 C 949.125 463.612 960.749 464.082 971.53 463.929 C 994.883 463.596 1010.18 489.018 992.152 506.925 C 988.595 510.507 984.065 512.966 979.123 513.997 C 970.676 515.729 948.145 515.105 938.556 515.069 L 872.274 514.973 C 871.824 535.872 875.478 612.95 869.731 626.653 C 866.179 635.122 859.402 639.295 851.209 642.607 C 850.286 642.666 849.363 642.709 848.439 642.737 C 841.187 642.923 834.176 640.125 829.045 634.997 C 817.849 624.017 820.943 596.041 820.983 580.797 C 821.11 558.884 821.111 536.971 820.985 515.058 C 787.84 514.616 754.729 515.588 721.497 514.843 C 706.705 514.512 694.279 505.249 693.179 489.666 C 692.414 478.826 703.072 466.682 713.836 465.019 C 727.611 462.89 742.188 463.629 756.269 463.657 C 777.854 463.784 799.439 463.76 821.024 463.587 C 821.177 444.081 818.288 363.157 823.807 351.134 C 827.512 343.061 834.241 339.269 842.211 336.194 z"
      transform="translate(1044,0) scale(-1,1)"
    />
  </Svg>
);

export default function ProfileScreen() {
  const [activeContentTab, setActiveContentTab] = useState(0);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeftBtn} activeOpacity={0.7}>
          <Plus size={32} color="#111111" strokeWidth={1.5} />
        </TouchableOpacity>

        <View style={styles.headerCenterContainer} pointerEvents="none">
          <View style={styles.headerCenterRow}>
            <Lock size={17} color="#111111" strokeWidth={2} />
            <Text style={styles.headerUsername}>aryan_9544_</Text>
            <ChevronDown size={17} color="#111111" strokeWidth={2.5} />
            <View style={styles.headerRedDot} />
          </View>
        </View>

        <View style={styles.headerRightGroup}>
          <TouchableOpacity style={{ position: 'relative' }} activeOpacity={0.7}>
            <View style={{
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Svg viewBox="0 0 1056 1196" width={26} height={29}>
                <Path
                  fill="#111111"
                  d="M 523.524 112.449 C 601.347 109.455 689.934 125.603 759.94 159.763 C 851.582 204.481 916.782 278.826 955.825 372.385 C 964.819 393.939 970.141 413.492 977.593 435.117 C 970.267 436.4 956.138 440.671 948.289 442.828 L 889.764 459.237 L 889.576 458.202 C 887.502 447.301 880.75 428.675 876.594 417.849 C 852.682 355.558 815.02 301.297 759.133 263.209 C 670.693 202.934 548.756 192.23 445.693 210.824 C 363.477 225.656 289.878 267.467 242.445 337.98 C 165.957 451.685 157.471 620.927 180.837 751.86 C 197.131 843.16 240.05 933.733 319.051 986.813 C 407.717 1046.39 527.562 1055.09 630.588 1037.02 C 699.951 1024.86 771.801 983.747 811.497 924.704 C 839.15 884.114 849.404 834.144 839.97 785.945 C 829.795 735.159 801.967 706.613 760.618 679.108 C 759.487 684.068 758.452 689.795 757.592 694.807 C 742.219 784.385 693.715 860.885 602.051 886.147 C 501.369 913.895 369.358 879.743 338.063 768.535 C 326.025 725.755 333.111 681.458 354.928 643.314 C 368.945 620.515 387.988 601.221 410.603 586.908 C 472.037 547.205 549.618 543.742 620.705 548.191 C 634.875 549.078 656.965 551.088 670.631 554.022 C 666.276 517.326 647.023 477.225 613.703 458.533 C 557.429 426.964 455.732 436.695 421.412 497.261 C 396.766 481.951 369.727 462.883 345.411 446.537 C 350.407 441.242 355.941 433.512 360.723 427.576 C 434.968 335.42 597.332 325.206 687.002 399.395 C 741.481 444.469 758.806 512.112 764.432 580.523 C 797.306 593.644 829.973 614.266 855.608 638.177 C 963.576 738.88 956.182 907.262 857.514 1011.61 C 774.318 1099.59 674.559 1131.98 555.991 1135.31 C 433.799 1138.74 313.033 1110.78 222.149 1025 C 119.92 929.028 82.6203 782.181 79.1566 646.518 C 76.6744 501.785 104.684 346.573 207.392 237.757 C 292.179 147.926 403.487 116.251 523.524 112.449 z"
                />
                <Path
                  fill="#ffffff"
                  d="M 564.509 637.433 C 602.525 635.779 636.213 639.911 673.365 646.439 C 663.033 736.594 635.387 803.436 533.287 805.031 C 486.307 805.487 425.118 783.898 422.665 728.765 C 421.916 710.03 428.696 691.776 441.495 678.073 C 471.805 645.003 522.468 639.114 564.509 637.433 z"
                />
              </Svg>
            </View>
            <View style={{
              position: 'absolute',
              top: -6,
              right: -7,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#FF3040',
              borderWidth: 2,
              borderColor: '#ffffff',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{
                fontSize: 11,
                fontWeight: '900',
                color: '#ffffff',
                lineHeight: 12,
                includeFontPadding: false,
              }}>
                2
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerRightBtn} activeOpacity={0.7}>
            <Menu size={26} color="#111111" strokeWidth={1.75} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main content scroll */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Top Section */}
        <View style={styles.profileTop}>
          {/* Avatar with Note */}
          <View style={styles.avatarContainer}>
            <View style={{
              backgroundColor: '#ffffff',
              borderWidth: 1,
              borderColor: '#DBDBDB',
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 7,
              marginBottom: -15,
              maxWidth: 100,
              minWidth: 80,
              position: 'relative',
              zIndex: 10,
            }}>
              <Text style={{
                fontSize: 12,
                color: '#8E8E8E',
                lineHeight: 15,
                textAlign: 'center',
              }}>
                {"Today's\nvibe..."}
              </Text>
              <View style={{
                position: 'absolute',
                bottom: -5,
                left: 24,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#DBDBDB',
              }} />
            </View>

            <View style={{ position: "relative", width: 90, height: 90 }}>
              <Image
                source={{ uri: "https://picsum.photos/seed/myavatar/200" }}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  borderWidth: 1,
                  borderColor: '#DBDBDB',
                }}
                resizeMode="cover"
              />
              <View style={styles.addStoryBadge}>
                <Text style={styles.addStoryBadgeText}>+</Text>
              </View>
            </View>
          </View>

          {/* Stats and Name */}
          <View style={styles.statsContainer}>
            <Text style={styles.displayName}>Aryan_</Text>
            <View style={styles.statsRow}>
              {[
                { count: "1", label: "posts" },
                { count: "75", label: "followers" },
                { count: "111", label: "following" },
              ].map(({ count, label }) => (
                <TouchableOpacity key={label} style={styles.statCol} activeOpacity={0.7}>
                  <Text style={styles.statCount}>{count}</Text>
                  <Text style={styles.statLabel}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.bioSection}>
          <Text style={styles.bioText}>
            {"Look around and build something that the world wants....🤚😊\n...\nGreat code comes from stupid problem 🤭"}
          </Text>
        </View>



        {/* Action Buttons Row */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionButtonText}>Edit profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionButtonText}>Share profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addPersonButton} activeOpacity={0.7}>
            <PersonPlusIcon size={20} color="#111111" />
          </TouchableOpacity>
        </View>

        {/* Highlights Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.highlightsContainer}
        >
          {/* New highlight */}
          <TouchableOpacity style={styles.highlightItem} activeOpacity={0.7}>
            <View style={styles.newHighlightCircle}>
              <Plus size={24} color="#111111" strokeWidth={1.25} />
            </View>
            <Text style={styles.highlightLabel}>New</Text>
          </TouchableOpacity>

          {/* highlights list */}
          {HIGHLIGHTS.map((hl) => (
            <TouchableOpacity key={hl.id} style={styles.highlightItem} activeOpacity={0.7}>
              <View style={styles.highlightCircle}>
                <Image source={{ uri: hl.imageUri }} style={styles.highlightImage} resizeMode="cover" />
              </View>
              <Text style={styles.highlightLabel} numberOfLines={1}>
                {hl.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content Tabs */}
        <View style={styles.tabsContainer}>
          {[
            { id: 0, component: (color) => <GridIcon color={color} /> },
            { id: 1, component: (color) => <ReelsIcon color={color} /> },
            { id: 2, component: (color) => <Repeat2 size={22} color={color} strokeWidth={1.5} /> },
            { id: 3, component: (color) => <Contact size={22} color={color} strokeWidth={1.5} /> },
          ].map((tab) => {
            const isActive = activeContentTab === tab.id;
            const color = isActive ? "#111111" : "#8E8E8E";
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.tabBtn}
                activeOpacity={0.7}
                onPress={() => setActiveContentTab(tab.id)}
              >
                {tab.component(color)}
                {isActive && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Post Grid */}
        {activeContentTab === 0 && (
          <View style={styles.postGrid}>
            {POSTS.map((post) => (
              <TouchableOpacity key={post.id} style={styles.postCell} activeOpacity={0.9}>
                <Image source={{ uri: post.thumbnailUri }} style={styles.postThumbnail} resizeMode="cover" />
                {post.isVideo && (
                  <View style={styles.videoIndicator}>
                    <View style={styles.videoIndicatorTriangle} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 60,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    position: "relative",
    zIndex: 10,
  },
  headerLeftBtn: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    padding: 4,
  },
  headerCenterContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  headerCenterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerUsername: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    color: "#111111",
  },
  headerRedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3040",
  },
  headerRightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    zIndex: 2,
  },
  headerRightBtn: {
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  threadsBtn: {
    position: "relative",
    padding: 4,
  },
  threadsOutline: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },
  threadsSymbol: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111111",
    lineHeight: 18,
  },
  threadsBadge: {
    position: "absolute",
    top: -1,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FF3040",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  threadsBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 10,
  },
  scrollContent: {
    paddingBottom: 64,
  },
  profileTop: {
    paddingHorizontal: 14,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarContainer: {
    width: 90,
    alignItems: "flex-start",
  },
  noteBubble: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 11,
    paddingHorizontal: 9,
    paddingVertical: 6,
    marginBottom: 4,
    marginLeft: 0,
    maxWidth: 90,
    position: "relative",
  },
  noteText: {
    fontSize: 11,
    color: "#8E8E8E",
    lineHeight: 14,
    fontFamily: "Inter_400Regular",
  },
  noteBubbleTail: {
    position: "absolute",
    bottom: -5,
    left: 14,
    width: 9,
    height: 9,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#DBDBDB",
    transform: [{ rotate: "45deg" }],
  },
  avatarImage: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 1,
    borderColor: "#DBDBDB",
  },
  addStoryBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#111111",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  addStoryBadgeText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 20,
    includeFontPadding: false,
  },
  statsContainer: {
    flex: 1,
    paddingTop: 0,
    paddingRight: 16,
  },
  displayName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111111",
    marginBottom: 8,
    fontFamily: "Inter_500Medium",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 0,
  },
  statCol: {
    alignItems: "flex-start",
    gap: -2,
  },
  statCount: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111111",
    fontFamily: "Inter_500Medium",
    lineHeight: 18,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "400",
    color: "#111111",
    marginTop: -2,
    fontFamily: "Inter_400Regular",
  },
  bioSection: {
    paddingHorizontal: 14,
    marginTop: 12,
  },
  bioText: {
    fontSize: 15,
    fontWeight: "400",
    color: "#111111",
    lineHeight: 20,
    fontFamily: "Poppins_400Regular",
  },
  linksRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  linkPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: 28,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    borderRadius: 14,
  },
  linkPillIcon: {
    fontSize: 13,
    color: "#111111",
    fontWeight: "400",
    fontFamily: "Inter_400Regular",
  },
  linkPillText: {
    fontSize: 13,
    color: "#111111",
    fontWeight: "400",
    fontFamily: "Inter_400Regular",
  },
  actionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    height: 34,
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111111",
    fontFamily: "Inter_500Medium",
  },
  addPersonButton: {
    width: 38,
    height: 34,
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  highlightsContainer: {
    paddingHorizontal: 14,
    gap: 14,
    paddingTop: 14,
    paddingBottom: 4,
  },
  highlightItem: {
    alignItems: "center",
    width: 86,
  },
  newHighlightCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: "#DBDBDB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  highlightCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    overflow: "hidden",
  },
  highlightImage: {
    width: "100%",
    height: "100%",
  },
  highlightLabel: {
    fontSize: 11,
    fontWeight: "400",
    color: "#111111",
    marginTop: 5,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    maxWidth: 72,
  },
  tabsContainer: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "#DBDBDB",
    marginTop: 14,
  },
  tabBtn: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: "#111111",
  },
  postGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  postCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    position: "relative",
    margin: 0,
  },
  postThumbnail: {
    width: "100%",
    height: "100%",
  },
  videoIndicator: {
    position: "absolute",
    top: 7,
    right: 7,
  },
  videoIndicatorTriangle: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftWidth: 10,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#FFFFFF",
  },
});
