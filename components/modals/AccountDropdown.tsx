import React, { useState, RefObject } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
  LayoutRectangle,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAccount } from "@/hooks/useAccount";

const AccountDropdown: React.FC<{ buttonRef: RefObject<TouchableOpacity> }> = ({ buttonRef }) => {
  const { currentAccountUuid, setCurrentAccountUuid, accountData } = useAccount();
  const accounts = accountData?.accounts || [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState<LayoutRectangle | null>(null);

  const toggleModal = () => {
    if (buttonRef?.current) {
      buttonRef.current.measureInWindow((x: any, y: any, width: any, height: any) => {
        setButtonLayout({ x, y, width, height });
      });
    }
    setIsModalVisible(!isModalVisible);
  };

  return (
    <>
      {/* Dropdown Button */}
      <TouchableOpacity ref={buttonRef} style={styles.button} onPress={toggleModal}>
        <Text style={styles.buttonText}>
          {accounts.find((account) => account.id === currentAccountUuid)?.name ||
            "Select Account"}
        </Text>
        <Icon
          name={isModalVisible ? "chevron-up" : "chevron-down"}
          style={styles.buttonIcon}
        />
      </TouchableOpacity>

      {/* Modal */}
      {isModalVisible && buttonLayout && (
        <Modal
          transparent
          animationType="fade"
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={toggleModal}
          >
            <View
              style={[
                styles.modalDropdown,
                {
                  top: buttonLayout.y + buttonLayout.height + 5,
                  left: buttonLayout.x,
                },
              ]}
            >
              <FlatList
                data={accounts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.dropdownItem}
                    onPress={() => {
                      setCurrentAccountUuid(item.id);
                      toggleModal();
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                  </Pressable>
                )}
              />
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#151E26",
  },
  buttonIcon: {
    fontSize: 20,
    color: "#151E26",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalDropdown: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#151E26",
  },
});

export default AccountDropdown;
