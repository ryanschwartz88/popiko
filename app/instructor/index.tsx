import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  ExpandableCalendar,
  CalendarProvider,
  AgendaList,
} from 'react-native-calendars';
import { StyleSheet, View, Image } from 'react-native';
import { useEvents } from '@/hooks/event/useEvents';
import { CalendarEvent } from '@/types/event';
import { useSession } from '@/hooks/account/useSession';
import { Text } from '@rneui/themed';
import InstructorItem from '@/components/calendar/InstructorItem';
import InstructorDropdown from '@/components/modals/InstructorAccountDropdown';
import { Ionicons } from '@expo/vector-icons';

const CalendarScreen = () => {
	const { session } = useSession();

	const today = useMemo(() => new Date(), []);
	const events: CalendarEvent[] = useEvents(today, undefined);

	// Filter events for the current account
	const filteredEvents = useMemo(() => {
		return events.filter((event) => event.instructorID === session?.user.id);
	}, [events]);

	// Group events by date for `AgendaList`
	const groupedEvents = useMemo(() => {
		const grouped: Record<string, CalendarEvent[]> = {};
		
		// Group events by date
		filteredEvents.forEach((event) => {
		const date = event.start.toLocaleDateString('en-CA'); // Format the date as 'YYYY-MM-DD'
		if (!grouped[date]) {
			grouped[date] = [];
		}
		grouped[date].push(event);
		});

		// Convert to an array and sort by date
		return Object.entries(grouped)
		.map(([title, data]) => ({ title, data }))
		.sort((a, b) => new Date(a.title).getTime() - new Date(b.title).getTime());
	}, [filteredEvents]);


	const renderItem = useCallback(({ item }: { item: CalendarEvent }) => {
		return <InstructorItem item={item} />;
	}, []);


	// Convert events to marked dates
	const markedDates = useMemo(() => {
		const dates: Record<string, { marked: boolean}> = {};
		filteredEvents.forEach((event) => {
		dates[event.start.toLocaleDateString('en-CA')] = {
			marked: true,
		};
		});
		return dates;
	}, [filteredEvents]);

	const dropdownButtonRef = useRef(null);


	return (
		<View style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginHorizontal: 12 }}>Popiko</Text>
                <InstructorDropdown buttonRef={dropdownButtonRef} session={session} />
            </View>
			
			<CalendarProvider
				date={today.toLocaleDateString('en-CA')}
				showTodayButton={markedDates[today.toLocaleDateString('en-CA')]?.marked}
				style={styles.calendar}
			>
				<ExpandableCalendar
					horizontal={true} 
					initialPosition={ExpandableCalendar.positions.CLOSED} 
					firstDay={1} 
					leftArrowImageSource={undefined} 
					rightArrowImageSource={undefined} 
					allowShadow={false} 
					openThreshold={70} 
					closeThreshold={40} 
					closeOnDayPress={true}
					markedDates={markedDates} 
					disableVirtualization={false} 
					theme={{
						dayTextColor: '#000000', 
						textDisabledColor: '#000000', 
						monthTextColor: '#000000', 
						textMonthFontSize: 24,
						textMonthFontWeight: 'bold',
						arrowColor: '#000000',
					}}
				/>
				{groupedEvents.length > 0 ? (
					<AgendaList
                        sections={groupedEvents}
                        renderItem={renderItem}
                        sectionStyle={styles.section}
					/>
				) : (
					<Text style={styles.section}>No Lessons Planned</Text>
				)}
			</CalendarProvider>
		</View>
	);
};

export default CalendarScreen;

const styles = StyleSheet.create({
container: {
	flex: 1,
	backgroundColor: '#fff',
	alignItems: 'center',
},
header: {
	flexDirection: "row",
	justifyContent: "space-between",
	marginTop: 60,
	marginBottom: 20,
	alignItems: "center",
	paddingHorizontal: 20,
    width: "100%",
},
section: {
	backgroundColor: '#f0f0f0',
	color: 'grey',
	paddingVertical: 8,
	paddingHorizontal: 16,
},
calendar: {
	backgroundColor: '#fff',
	flex: 1,
},
image: {
    marginHorizontal: 12,
},
});
