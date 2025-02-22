import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
ExpandableCalendar,
CalendarProvider,
AgendaList,
} from 'react-native-calendars';
import { StyleSheet, View } from 'react-native';
import { useEvents } from '@/hooks/event/useEvents';
import { CalendarEvent } from '@/types/event';
import { useSession } from '@/hooks/account/useSession';
import AgendaItem from '@/components/calendar/AgendaItem';
import { Text } from '@rneui/themed';
import AccountDropdown from '@/components/modals/AccountDropdown';
import MonthlyTab from '@/components/modals/MonthlyTab';

const CalendarScreen = () => {
	const { session, currentAccountUuid } = useSession();
	const parentAccount = currentAccountUuid === session?.user.id;

	const today = useMemo(() => new Date(), []);
	const events: CalendarEvent[] = useEvents(today);

	// Filter events for the current account
	const filteredEvents = useMemo(() => {
		if (parentAccount) {
			return events.filter((event) => event.user_id === currentAccountUuid);
		}
		return events.filter((event) => event.childID === currentAccountUuid);
	}, [events, parentAccount, currentAccountUuid]);

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
		return <AgendaItem item={item} />;
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
				<AccountDropdown buttonRef={dropdownButtonRef}/>
				<MonthlyTab />
			</View>
			
			<CalendarProvider
				date={today.toLocaleDateString('en-CA')}
				showTodayButton={markedDates[today.toLocaleDateString('en-CA')]?.marked}
				todayButtonStyle={styles.todayButton}
				style={styles.calendar}
			>
				<ExpandableCalendar
					horizontal={true} 
					initialPosition={ExpandableCalendar.positions.CLOSED} 
					firstDay={1} 
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
					<Text style={styles.section}>No Scheduled Events</Text>
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
todayButton: {
	position: 'absolute',
	bottom: 40,
	right: 40,
	backgroundColor: '#007BFF',
	borderRadius: 50,
	padding: 10,
}
});
