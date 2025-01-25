import React, { useRef, useState, useMemo } from "react";
import {
	SectionList,
	StyleSheet,
	Text,
	View,
	ViewToken,
} from "react-native";
import { sections } from "@/constants/childrenSkills";
import WaterSkill from "@/components/course/WaterSkill";
import ReviewButton from "@/components/course/ReviewButton";

const shadesOfBlue = ["#007AFF", "#0056D2", "#0046AA", "#003580", "#002966"];

const SwimProgress: React.FC<{ skillGroup: string | undefined, lastSkill: string | undefined }> = ({ skillGroup, lastSkill }) => {
	const [currentHeader, setCurrentHeader] = useState<string>(sections[0].title);
	const [currentUnit, setCurrentUnit] = useState<string>("");
	const viewableItemsChangedRef = useRef<((arg0: { viewableItems: ViewToken[] }) => void) | null>(null);
	const currentSection = sections.find((section) => section.title === skillGroup) || sections[0];
	const lastObtainedSkill = currentSection.units
		.flatMap((unit) => unit.skills)
		.find((skill) => skill.name === lastSkill);
	const indexOfLastObtainedSkill = lastObtainedSkill ? lastObtainedSkill.index : 0;

	const formattedData = sections.map((section, sectionIndex) => ({
		title: section.title,
		index: sectionIndex + 1, // Add section index (1-based)
		data: section.units.map((unit, unitIndex) => ({
			unitTitle: unit.title,
			unitIndex: unitIndex + 1, // Add unit index (1-based)
			skills: unit.skills,
		})),
	}));

	const viewabilityConfig = {
		itemVisiblePercentThreshold: 50, // Trigger callback when 50% of the item is visible
	};

	const onViewableItemsChanged = ({
		viewableItems,
	}: {
		viewableItems: ViewToken[];
	}) => {
		const firstVisibleSection = viewableItems.find((item) => item.section);
		const firstVisibleItem = viewableItems.find((item) => item.item);

		// Update currentHeader (section title) if it changes
		if (firstVisibleSection && firstVisibleSection.section.title !== currentHeader) {
			setCurrentHeader(firstVisibleSection.section.title);
		}

		// Update currentUnit (unit title) if it changes
		if (firstVisibleItem && firstVisibleItem.item.unitTitle !== currentUnit) {
			setCurrentUnit(firstVisibleItem.item.unitTitle);
		}
	};

	viewableItemsChangedRef.current = onViewableItemsChanged;

	const calculateSineOffsets = (
		index: number,
		total: number,
		amplitude: number,
	) => {
		if (total === 1 || total === 0) {
			return { offsetX: 0 };
		}
		const progress = (index + 1) / total;
		const angle = progress * Math.PI * 2;
		const offsetX = Math.sin(angle) * amplitude;

		return { offsetX };
	};


	const renderUnit = ({ item, section }: { item: any; section: any }) => {
		// Calculate the base index for the current unit by summing the skill counts of previous units in the section
		const baseIndex = section.data
			.slice(0, item.unitIndex - 1) // Take all units before this one
			.reduce((sum: number, unit: any) => sum + unit.skills.length, 0); // Sum their skill counts
		const totalSkills = section.data
			.flatMap((unit: any) => unit.skills)
			.length;
	
		let skillIndexCounter = 0; // Local counter for this unit
	
		return (
			<View style={styles.unitContainer}>
				<View style={styles.unitTitleContainer}>
					<View style={styles.line} />
					<Text style={styles.unitTitle}>
						Unit {item.unitIndex}: {item.unitTitle}
					</Text>
					<View style={styles.line} />
				</View>
				<View style={styles.skillsRow}>
					{item.skills.map(
						(skill: { name: string; description: string; index: number }) => {
							// Combine the base index with the local counter to get the global index for this skill
							const sectionIndex = baseIndex + skillIndexCounter;
	
							const { offsetX } = calculateSineOffsets(
								sectionIndex, // Use the global index here
								totalSkills,
								100, // Sine wave amplitude
							);
	
							skillIndexCounter += 1; // Increment the local counter
	
							return (
								<React.Fragment key={`${skill.name}-${sectionIndex}`}>
									<View
										key={`${skill.name}-${sectionIndex}`} 
										style={{
											transform: [
												{ translateX: offsetX },
											],
											zIndex: totalSkills - sectionIndex,
										}}
									>
										<WaterSkill
											skill={skill}
											locked={indexOfLastObtainedSkill < skill.index}
										/>
									</View>
									{skill.index === indexOfLastObtainedSkill && (
										<ReviewButton lastSkill={lastSkill} skillGroup={skillGroup}/>
									)}
								</React.Fragment>
							);
						}
					)}
				</View>
			</View>
		);
	};

	const renderSectionHeader = ({
		section,
	}: {
		section: { title: string; index: number };
	}) => (
		<View style={styles.stickyHeader}>
			<View
				style={[styles.headerContainer, { backgroundColor: shadesOfBlue[section.index - 1] }]}
			>
				<Text style={styles.sectionTitle}>
					Section {section.index}: {section.title}
				</Text>
				{currentUnit && currentHeader === section.title ? (
					<Text style={styles.currentUnitText}>
						Unit{" "}
						{(
							formattedData
								.find((s) => s.title === section.title)
								?.data.findIndex((unit) => unit.unitTitle === currentUnit) ?? -1
						) + 1}
						: {currentUnit || "N/A"}
					</Text>
				) : (
					<Text style={styles.currentUnitText}>
						Unit 1: {sections.find((s) => s.title === section.title)?.units[0].title}
					</Text>
				)}
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			<SectionList
				sections={formattedData}
				keyExtractor={(item, index) => `${item.unitTitle}-${item.unitIndex}-${index}`}
				renderItem={renderUnit}
				renderSectionHeader={renderSectionHeader}
				stickySectionHeadersEnabled={true}
				contentContainerStyle={[styles.listContainer, { paddingBottom: 100 }]}
				onViewableItemsChanged={viewableItemsChangedRef.current}
				viewabilityConfig={viewabilityConfig}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
};


const styles = StyleSheet.create({
	container: {
		width: "100%",
		padding: 20,
	},
	listContainer: {
		paddingBottom: 20,
	},
	stickyHeader: {
		zIndex: 1,
	},
	headerContainer: {
		borderRadius: 20,
		paddingHorizontal: 15,
		paddingVertical: 20,
		alignItems: "flex-start",
		justifyContent: "center",
	},
	sectionTitle: {
		fontSize: 14,
		color: "#fff",
		marginBottom: 5,
	},
	currentUnitText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#fff",
	},
	unitContainer: {
		paddingVertical: 20,
		alignItems: "center",
	},
	unitTitleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 10,
	},
	line: {
		height: 3,
		borderRadius: 3,
		flex: 1,
		marginHorizontal: 15,
		backgroundColor: "#444",
	},
	unitTitle: {
		fontSize: 16,
		color: "#444",
	},
	skillContainer: {
		paddingVertical: 5,
	},
	skillsRow: {
		position: "relative",
		alignItems: "center", 
	},
	skillText: {
		fontSize: 14,
		color: "#555",
	},
});

export default SwimProgress;
