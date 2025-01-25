import { useEffect, useState } from "react";
import { CalendarEvent } from "@/types/event";
import { addMinutes, isSameMinute, isWithinInterval, parse } from "date-fns";
import { supabase } from "@/hooks/account/client";
import { v4 as uuidv4 } from "uuid";

export const useAvailable = (
	startDate: Date,
	endDate: Date,
	events?: CalendarEvent[],
) => {
	const [available, setAvailable] = useState<CalendarEvent[]>([]);

	useEffect(() => {
		const summerMonths = [6, 7, 8]; // June - August
		const isSummer = summerMonths.includes(startDate.getMonth());

		const weekdaySchedule = {
			days: ["Mon", "Tue", "Thu"],
			times: ["13:15", "14:00", "14:45", "15:30", "16:15", "17:15"],
			duration: 30, 
		};

		const weekendSchedule = {
			days: ["Sat", "Sun"],
			times: [
				"10:15",
				"11:00",
				"11:45",
				"12:30",
				"13:15",
				"14:00",
				"14:45",
				"15:45",
				"16:30",
			],
			duration: 30,
		};

		const schedules = isSummer
			? [weekdaySchedule, weekendSchedule]
			: [weekendSchedule];

		const fetchAllAvailable = async () => {
			const { data: intervals, error } = await supabase
				.from("availability_intervals")
				.select(`
                    *,
                    instructor:instructors(name)
                `);

			if (error) {
				console.error("Error fetching availability intervals:", error);
				return;
			}

			const generatedSlots: CalendarEvent[] = [];

			let currentDate = new Date(startDate);
			while (currentDate <= endDate) {
				schedules.forEach((schedule) => {
					schedule.days.forEach((day) => {
						if (currentDate.toLocaleDateString("en-US", { weekday: "short" }) === day) {
							intervals
								.filter((interval) =>
									interval.in_season === isSummer && interval.day_of_week.slice(0, 3) === day
								)
								.forEach((interval) => {
									const startTime = parse(interval.start, "HH:mm:ss", currentDate);
									const endTime = parse(interval.end, "HH:mm:ss", currentDate);

									schedule.times.forEach((time) => {
										const slotStart = parse(time, "HH:mm", currentDate);
										const slotEnd = addMinutes(slotStart, schedule.duration);

										if (
											isWithinInterval(slotStart, {
												start: startTime,
												end: endTime,
											})
										) {
											const existingSlot = generatedSlots.find((slot) =>
												isSameMinute(slot.start, slotStart)
											);

											if (existingSlot) {
												existingSlot.available_instructor?.push({
													id: interval.instructor_id,
													name: interval.instructor.name,
												});
											} else {
												generatedSlots.push({
													id: uuidv4(),
													title: "Available Lesson",
													start: slotStart,
													end: slotEnd,
													status: "available",
													available_instructor: [
														{
															id: interval.instructor_id,
															name: interval.instructor.name,
														},
													],
												});
											}
										}
									});
								});
						}
					});
				});
				currentDate.setDate(currentDate.getDate() + 1);
			}

			// Filter out slots that are already taken
			events?.forEach((event) => {
				const slotIndex = generatedSlots.findIndex((slot) =>
					isSameMinute(slot.start, event.start)
				);

				if (slotIndex !== -1) {
					const slot = generatedSlots[slotIndex];
					if (slot.available_instructor && slot.available_instructor?.length > 1) {
						slot.available_instructor = slot.available_instructor.filter(
							(instructor) => instructor.id !== event.instructorID
						);
					} else {
						generatedSlots.splice(slotIndex, 1);
					}
				}
			});

			setAvailable(generatedSlots);
		};

		fetchAllAvailable();
	}, [events, startDate, endDate]);

	return available;
};

