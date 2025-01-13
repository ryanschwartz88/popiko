import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const WaterSkill = ({
  skill,
  locked,
}: {
  skill: { name: string };
  locked: boolean;
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    if (locked) return;
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={handlePress}
        style={[
          styles.skillCircle,
          { backgroundColor: locked ? "#ccc" : "#007AFF" },
        ]}
      >
        <FontAwesome
          name={locked ? "lock" : "star"}
          size={24}
          color="#fff"
        />
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalText}>{skill.name}</Text>
            <Text style={styles.skillStatus}>
              {locked ? "This skill is locked." : "This skill is unlocked!"}
            </Text>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: "white",
    minHeight: "90%",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    padding: 35,
    alignItems: "center",
    width: "100%",
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
    alignSelf: "flex-end",
    position: "absolute",
    top: 20,
    right: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  skillStatus: {
    marginTop: 15,
    fontSize: 18,
    textAlign: "center",
  },
});

export default WaterSkill;
