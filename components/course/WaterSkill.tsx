import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LayoutRectangle,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const WaterSkill = ({
  skill,
  locked,
  buttonRef,
}: {
  skill: { name: string; description: string; index: number };
  locked: boolean;
  buttonRef: React.RefObject<TouchableOpacity>;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState<LayoutRectangle | null>(null);

  const handlePress = () => {
    if (!buttonRef?.current) return;
    buttonRef.current.measureInWindow((x, y, width, height) => {
      setButtonLayout({ x, y, width, height });
      setModalVisible(true);
    });
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        ref={buttonRef}
        style={[
          styles.skillCircle,
          { backgroundColor: locked ? "#ccc" : "#007AFF" },
        ]}
      >
        <FontAwesome name={locked ? "lock" : "star"} size={24} color="#fff" />
      </TouchableOpacity>

      {modalVisible && buttonLayout && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.overlay}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={() => setModalVisible(false)}
            />
            {/* Pointer (Triangle) */}
            <View
              style={[
                styles.pointer,
                {
                  top: buttonLayout.y + buttonLayout.height + 5, // Position right below the button
                  left: buttonLayout.x + buttonLayout.width / 2 - 10, // Center the triangle
                },
              ]}
            />
            {/* Modal Background */}
            <View
              style={[
                styles.relativeModal,
                {
                  top: buttonLayout.y + buttonLayout.height + 15, // Slightly below the pointer
                  left: screenWidth * 0.1, // Center horizontally (80% width)
                  width: screenWidth * 0.8,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.modalText}>{skill.name}</Text>
              <Text style={styles.skillStatus}>
                {locked ? "This skill is locked." : skill.description}
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  skillCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pointer: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "white", // Match modal background color
    zIndex: 100,
  },
  relativeModal: {
    position: "absolute",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalText: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  skillStatus: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
});

export default WaterSkill;
