import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { X } from "lucide-react-native";
import { useReelData } from "../context/ReelDataContext";

export default function ViewsOverTimeModal({ visible, onClose }) {
  const { state, dispatch } = useReelData();
  const [localData, setLocalData] = useState(state.viewsOverTime);

  const handleSave = () => {
    Keyboard.dismiss();
    dispatch({ type: "UPDATE_VIEWS_OVER_TIME", data: localData });
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const updatePoint = (index, field, value) => {
    const newData = [...localData];
    newData[index] = { ...newData[index], [field]: parseInt(value) || 0 };
    setLocalData(newData);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Views over time</Text>
              <Text style={styles.modalSubtitle}>
                Edit data points. Values auto-scale to chart.
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#111111" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <KeyboardAwareScrollView
            style={styles.modalScroll}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={24}
            showsVerticalScrollIndicator={false}
          >
            {localData.map((point, index) => (
              <View key={index} style={styles.dataRow}>
                <Text style={styles.dateLabel}>{point.label}</Text>
                <View style={styles.inputGroup}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>This reel</Text>
                    <TextInput
                      style={styles.input}
                      value={String(point.thisReel)}
                      onChangeText={(val) => updatePoint(index, "thisReel", val)}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Typical</Text>
                    <TextInput
                      style={styles.input}
                      value={String(point.typicalReel)}
                      onChangeText={(val) => updatePoint(index, "typicalReel", val)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            ))}
          </KeyboardAwareScrollView>

          <TouchableOpacity style={styles.doneBtn} onPress={handleSave}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#111111",
  },
  modalSubtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#8E8E8E",
    marginTop: 4,
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    flex: 1,
  },
  dataRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F4",
  },
  dateLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "#8E8E8E",
    marginBottom: 10,
  },
  inputGroup: {
    flexDirection: "row",
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#8E8E8E",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F2F2F4",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#111111",
    borderWidth: 1,
    borderColor: "#DD2A7B",
  },
  doneBtn: {
    backgroundColor: "#DD2A7B",
    marginHorizontal: 20,
    marginVertical: 20,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  doneBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
});
