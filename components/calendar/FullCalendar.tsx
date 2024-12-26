import { useEvents } from '@/hooks/useEvents';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CalendarProvider } from 'react-native-calendars';

const Calendar = () => {
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const currentDate = new Date();
  const [startDate, setStartDate] = useState(new Date(currentDate));
  const [endDate, setEndDate] = useState(new Date(startDate.getDate() + 6));
  const events = useEvents(startDate, endDate);

  const handleNext = () => {
    // Logic to navigate to the next day/week
    if (viewMode === 'week') {
      setStartDate(new Date(startDate.setDate(startDate.getDate() + 7)));
      setEndDate(new Date(startDate.setDate(startDate.getDate() + 6)));
    } else {
      setStartDate(new Date(startDate.setDate(startDate.getDate() + 1)));
      setEndDate(new Date(startDate.setDate(startDate.getDate() + 1)));
    }
  };

  const handlePrevious = () => {
    // Logic to navigate to the previous day/week
    if (viewMode === 'week') {
      setStartDate(new Date(startDate.setDate(startDate.getDate() - 7)));
      setEndDate(new Date(startDate.setDate(startDate.getDate() - 1)));
    } else {
      setStartDate(new Date(startDate.setDate(startDate.getDate() - 1)));
      setEndDate(new Date(startDate.setDate(startDate.getDate() - 1)));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevious}>
          <Text style={styles.navButton}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.currentDate}>
          {currentDate.toDateString()}
        </Text>

        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.navButton}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Toggle View Mode */}
      <View style={styles.toggleView}>
        <TouchableOpacity
          onPress={() => setViewMode('week')}
          style={[styles.toggleButton, viewMode === 'week' && styles.activeButton]}
        >
          <Text style={viewMode === 'week' ? styles.activeText : styles.inactiveText}>
            Week
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setViewMode('day')}
          style={[styles.toggleButton, viewMode === 'day' && styles.activeButton]}
        >
          <Text style={viewMode === 'day' ? styles.activeText : styles.inactiveText}>
            Day
          </Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Grid */}
      <View style={styles.grid}>
        <Text>{viewMode === 'week' ? 'Week View Placeholder' : 'Day View Placeholder'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  navButton: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentDate: {
    fontSize: 16,
    fontWeight: '500',
  },
  toggleView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  toggleButton: {
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#000',
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
});

export default Calendar;
