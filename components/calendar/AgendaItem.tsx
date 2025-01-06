import React, { useCallback } from 'react';
import {
  StyleSheet,
  Alert,
  View,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native';
import { CalendarEvent } from '@/types/event';

const AgendaItem = ({ item }: { item: CalendarEvent }) => {
  const buttonPressed = useCallback(() => {
    Alert.alert('NOOOOOO');
  }, []);

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
    hour12: true,
  });


  return (
    <TouchableOpacity activeOpacity={1.0} style={styles.item}>
      <View>
        <Text style={styles.itemHourText}>{startTime.toLowerCase()}</Text>
        <Text style={styles.itemDurationText}>30m</Text>
      </View>
      <Text style={styles.itemTitleText}>{item.title}</Text>
      <View style={styles.itemButtonContainer}>
        <Button color="grey" title="Reschedule" onPress={buttonPressed} />
      </View>
    </TouchableOpacity>
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
    });