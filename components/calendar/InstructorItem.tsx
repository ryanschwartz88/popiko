import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  Modal,
  TextInput,
} from 'react-native';
import { CalendarEvent } from '@/types/event';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/hooks/account/client';
import { v4 as uuidv4 } from 'uuid';

const AgendaItem = ({ item }: { item: CalendarEvent }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notes, setNotes] = useState<string>('');
  const [id, setId] = useState<string>('');

  const getNotes = async () => {
    console.log(item.childID, item.instructorID)
    const { data, error } = await supabase
      .from('instructor_notes')
      .select('*')
      .eq('child_id', item.childID)
      .eq('instructor_id', item.instructorID)
      .single();
    if (error) {
      console.log(error);
    } else {
      setNotes(data?.note || '');
      setId(data?.id || '');
    }
};

  const handleClose = async () => {
    //Update the notes in the database
    const { data, error } = await supabase
      .from('instructor_notes')
      .upsert(
        {
          id: id || uuidv4(),
          child_id: item.childID,
          instructor_id: item.instructorID,
          note: notes,
        }
      )
      .single();
    if (error) {
      console.log(error);
    }
    setModalVisible(false);
  };

  const handlePress = () => {
    getNotes();
    setModalVisible(true);
  };

  if (!item) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned Today</Text>
      </View>
    );
  }

  // Format the start time for display
  const startTime = item.start.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <>
      <TouchableOpacity activeOpacity={1.0} style={styles.item}>
        <View>
          <Text style={styles.itemHourText}>{startTime.toLowerCase()}</Text>
          <Text style={styles.itemDurationText}>30m</Text>
        </View>
        <Text style={styles.itemTitleText}>{item.title}</Text>
        <View style={styles.itemButtonContainer}>
          <Button color="grey" title="Notes" onPress={handlePress} />
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Notes for {item.childName}</Text>
            <TextInput
              style={styles.textInput}
              placeholderTextColor={'#ccc'}
              multiline
              numberOfLines={4}
              placeholder="Write your notes here..."
              value={notes}
              onChangeText={(text) => setNotes(text)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default React.memo(AgendaItem);

const styles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemHourText: {
    color: 'black',
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    color: 'black',
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    backgroundColor: '#f5f5f5',
    minHeight: 100,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
