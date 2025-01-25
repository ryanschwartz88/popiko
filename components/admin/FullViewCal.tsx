import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  format,
} from "date-fns";
import { MaterialIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  const summerMonths = [5, 6, 7]; // June - August
  const isSummer = summerMonths.includes(currentDate.getMonth());

  const weekdaySchedule = {
    days: ["Mon", "Tue", "Thu"],
    start: ["13:15", "14:00", "14:45", "15:30", "16:15", "17:15"],
    end: ["13:45", "14:30", "15:15", "16:00", "16:45", "17:45"],
    duration: 30,
  };

  const weekendSchedule = {
    days: ["Sat", "Sun"],
    start: [
      "10:15",
      "11:00",
      "11:45",
      "12:30",
      "13:15",
      "14:00",
      "14:45",
      "15:30",
      "16:30",
    ],
    end: [
      "10:45",
      "11:30",
      "12:15",
      "13:00",
      "13:45",
      "14:30",
      "15:15",
      "16:00",
      "17:00",
    ],
    duration: 30,
  };

  const schedules = isSummer ? [weekdaySchedule, weekendSchedule] : [weekendSchedule];

  const generateWeeks = () => {
    const validDays: string[] = schedules.flatMap((schedule) => schedule.days);
  
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });
  
    const filteredDays = daysInMonth.filter((day) =>
      validDays.includes(format(day, "EEE"))
    );
  
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
  
    filteredDays.forEach((day) => {
      currentWeek.push(day);
  
      if (
        format(day, "EEE") === "Sun" || 
        currentWeek.length === validDays.length
      ) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
  
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
  
    return weeks;
  };
  

  const weeks = generateWeeks();

  // Generate timeslots for a given day
  const generateTimeslots = (day: string) => {
    // Find the schedule that includes the given day
    const schedule = schedules.find((schedule) => schedule.days.includes(day));
  
    if (!schedule) {
      return []; // Return an empty array if no matching schedule is found
    }
  
    // Generate timeslots using the start and end times
    const timeslots = schedule.start.map((startTime, index) => ({
      start: startTime,
      end: schedule.end[index], // Get the corresponding end time
    }));
  
    return timeslots;
  };
  

  // Render a day in the week
  const renderDay = (day: Date) => {
    const dayOfWeek = format(day, "EEE");
    const timeslots = generateTimeslots(dayOfWeek);

    return (
      <View style={styles.dayContainer}>
        {/* Day Header */}
        <View style={styles.dayHeaderContainer}>
          <Text style={styles.dayHeader}>{dayOfWeek}</Text>
          <Text style={styles.dayHeader}>{format(day, "d")}</Text>
        </View>
        {/* Timeslot List */}
        <FlatList
          data={timeslots}
          keyExtractor={(item, index) => `${day}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.timeslotContainer}>
              <Text style={styles.timeslotText} numberOfLines={1} ellipsizeMode="tail">
                {item.start} - {item.end}
              </Text>
              <View style={styles.eventRectangle}>
                <Text style={styles.eventText} numberOfLines={1} ellipsizeMode="tail">Event</Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  };

  // Render a week in the month
  const renderWeek = ({ item: week } : { item: Date[] }) => {
    return (
      <View style={[styles.weekContainer, { width: screenWidth }]}>
        {week.map((day) => renderDay(day))}
      </View>
    );
  };

  // Handle swiping between weeks
  const handleWeekScroll = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentWeekIndex(newIndex);
  };

  // Render the week indicator
  const renderWeekIndicator = () => {
    return (
      <View style={styles.indicatorContainer}>
        {weeks.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicatorDot,
              currentWeekIndex === index && styles.activeIndicatorDot,
            ]}
          />
        ))}
      </View>
    );
  };

  // Header for month navigation
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() =>
          setCurrentDate((prev) =>
            startOfMonth(new Date(prev.setMonth(prev.getMonth() - 1)))
          )
        }
      >
        <MaterialIcons name="chevron-left" size={40} color="black" />
      </TouchableOpacity>
      <Text style={styles.monthYearText}>{format(currentDate, "MMMM yyyy")}</Text>
      <TouchableOpacity
        onPress={() =>
          setCurrentDate((prev) =>
            startOfMonth(new Date(prev.setMonth(prev.getMonth() + 1)))
          )
        }
      >
        <MaterialIcons name="chevron-right" size={40} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={weeks}
        horizontal
        pagingEnabled
        keyExtractor={(_, index) => `week-${index}`}
        renderItem={renderWeek}
        onScroll={handleWeekScroll}
        showsHorizontalScrollIndicator={false}
      />
      {renderWeekIndicator()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  navButton: {
    fontSize: 20,
    fontWeight: "bold",
  },
  monthYearText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  dayContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  dayHeaderContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  dayHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  timeslotContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  timeslotText: {
    fontSize: 14,
    marginBottom: 5,
  },
  eventRectangle: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    maxWidth: "90%", // Maximum width to ensure it doesn't overflow
  },  
  eventText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ddd",
    marginHorizontal: 5,
  },
  activeIndicatorDot: {
    backgroundColor: "#000",
  },
});

export default Calendar;
