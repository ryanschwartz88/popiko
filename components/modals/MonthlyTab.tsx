import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEvents } from '@/hooks/event/useEvents';

const MonthlyTab: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      {/* Button to open the modal */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="receipt-long" size={24} color="black" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            {/* Modal Content */}
            <Text style={styles.modalText}>Invoices</Text>
            <View style={styles.contentContainer}>
              <Text>Payment details and information will go here.</Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
    iconButton: {
      marginRight: 10,
      padding: 10,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalView: {
      backgroundColor: 'white',
      minHeight: '90%',
      borderTopEndRadius: 20,
      borderTopStartRadius: 20,
      padding: 35,
      alignItems: 'center',
      width: '100%',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    closeButton: {
      alignSelf: 'flex-end',
      position: 'absolute',
      top: 20,
      right: 20,
    },
    modalText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    contentContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
  });
  

export default MonthlyTab;
