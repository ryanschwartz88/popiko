import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { sections } from "@/constants/childrenSkills";
import { Feather, MaterialIcons } from "@expo/vector-icons";

interface ReviewModalProps {
  lastSkill: string | undefined;
  skillGroup: string | undefined;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ lastSkill, skillGroup }) => {
  const [isSectionSelectionVisible, setSectionSelectionVisible] = useState(false);
  const [isSkillsModalVisible, setSkillsModalVisible] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);

  const skillGroupIndex = sections.findIndex(
    (section) => section.title === skillGroup
  );
  const availableSections = sections.filter(
    (section, index) => index <= skillGroupIndex
  );

  const lastSection = sections[currentSectionIndex];
  const lastObtainedSkill = lastSection.units
		.flatMap((unit) => unit.skills)
		.find((skill) => skill.name === lastSkill);
	const indexOfLastObtainedSkill = lastObtainedSkill ? lastObtainedSkill.index : 0;
  //todo fix the last available skill if not completed whole section.
  const handleToggleSection = (sectionTitle: string) => {
    if (selectedSections.includes(sectionTitle)) {
      setSelectedSections((prev) =>
        prev.filter((title) => title !== sectionTitle)
      );
    } else {
      setSelectedSections((prev) => [...prev, sectionTitle]);
    }
  };

  const handleStartReview = () => {
    if (selectedSections.length === 0) {
      alert("Please select at least one section to review.");
      return;
    }
    const initialSectionIndex = availableSections.findIndex(
      (section) => section.title === selectedSections[0]
    );
    setCurrentSectionIndex(initialSectionIndex !== -1 ? initialSectionIndex : 0);
    setCurrentUnitIndex(0);
    setCurrentSkillIndex(0);
    setSectionSelectionVisible(false);
    setSkillsModalVisible(true);
  };

  const handleCloseSkillsModal = () => {
    setSkillsModalVisible(false);
    setSelectedSections([]);
    setCurrentSectionIndex(0);
    setCurrentUnitIndex(0);
    setCurrentSkillIndex(0);
  };

  // Navigation handlers
  const moveToNextSkill = () => {
    const currentSection = sections[currentSectionIndex];
    const currentUnit = currentSection.units[currentUnitIndex];

    if (currentSkillIndex < currentUnit.skills.length - 1) {
      setCurrentSkillIndex((prev) => prev + 1);
    } else {
        // move to the next unit if the current skill is the last one
        if (currentUnitIndex < currentSection.units.length - 1) {
            setCurrentUnitIndex((prev) => prev + 1);
            setCurrentSkillIndex(0);
        } else {
            // move to the next selected section if the current unit is the last one
            if (currentSectionIndex < selectedSections.length - 1) {
                setCurrentSectionIndex((prev) => prev + 1);
                setCurrentUnitIndex(0);
                setCurrentSkillIndex(0);
            }
        }
    }
  };

  const moveToPrevSkill = () => {
    if (currentSkillIndex > 0) {
      setCurrentSkillIndex((prev) => prev - 1);
    } else {
        // move to the previous unit if the current skill is the first one
        if (currentUnitIndex > 0) {
            setCurrentSkillIndex(currentSection.units[currentUnitIndex - 1].skills.length - 1);
            setCurrentUnitIndex((prev) => prev - 1);
        } else {
            // move to the previous section if the current unit is the first one
            if (currentSectionIndex > 0) {
                const prevSection = sections.find((section) => section.title === selectedSections[currentSectionIndex - 1]) || sections[currentSectionIndex - 1];
                setCurrentSkillIndex(prevSection.units[prevSection.units.length - 1].skills.length - 1);
                setCurrentUnitIndex(prevSection.units.length - 1);
                setCurrentSectionIndex((prev) => prev - 1);
            }
        }
    }
  };

  const moveToNextUnit = () => {
    const currentSection = sections[currentSectionIndex];
    if (currentUnitIndex < currentSection.units.length - 1) {
      setCurrentUnitIndex((prev) => prev + 1);
      setCurrentSkillIndex(0);
    } else {
      // move to the next section if the current unit is the last one
      if (currentSectionIndex < sections.length - 1) {
        setCurrentSectionIndex((prev) => prev + 1);
        setCurrentUnitIndex(0);
        setCurrentSkillIndex(0);
      }
    }
  };

  const moveToPrevUnit = () => {
    if (currentUnitIndex > 0) {
      setCurrentUnitIndex((prev) => prev - 1);
      setCurrentSkillIndex(0);
    } else {
        // move to the previous section if the current unit is the first one
        if (currentSectionIndex > 0) {
            const prevSection = sections.find((section) => section.title === selectedSections[currentSectionIndex - 1]) || sections[currentSectionIndex - 1];
            setCurrentSkillIndex(prevSection.units[prevSection.units.length - 1].skills.length - 1);
            setCurrentUnitIndex(prevSection.units.length - 1);
            setCurrentSectionIndex((prev) => prev - 1);
        }
    }
  };

  const moveToNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      setCurrentUnitIndex(0);
      setCurrentSkillIndex(0);
    }
  };

  const moveToPrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
      setCurrentUnitIndex(0);
      setCurrentSkillIndex(0);
    }
  };

  const currentSection = sections.find((section) => section.title === selectedSections[currentSectionIndex]) || sections[currentSectionIndex];
  const currentUnit = currentSection.units[currentUnitIndex];
  const currentSkill = currentUnit.skills[currentSkillIndex];

  return (
    <>
      {/* Review Button */}
      <TouchableOpacity
        style={styles.reviewButton}
        onPress={() => setSectionSelectionVisible(true)}
      >
        <Text style={styles.reviewButtonText}>Review</Text>
      </TouchableOpacity>

      {/* Section Selection Modal */}
      <Modal visible={isSectionSelectionVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.xButton}
              onPress={() => setSectionSelectionVisible(false)}
            >
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Categories to Review</Text>
            <ScrollView>
                {availableSections.map((section) => (
                <TouchableOpacity
                    key={section.title}
                    style={[
                    styles.sectionOption,
                    selectedSections.includes(section.title) &&
                        styles.sectionOptionSelected,
                    ]}
                    onPress={() => handleToggleSection(section.title)}
                >
                    <Text
                    style={[
                        styles.sectionOptionText,
                        selectedSections.includes(section.title) &&
                        styles.sectionOptionTextSelected,
                    ]}
                    >
                    {section.title}
                    </Text>
                </TouchableOpacity>
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.startButton} onPress={handleStartReview}>
                <Text style={styles.startButtonText}>Start Review</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setSectionSelectionVisible(false)}
            >
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            </View>
        </View>
      </Modal>


      {/* Skills Modal */}
      <Modal visible={isSkillsModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={moveToPrevSection}
                        disabled={currentSectionIndex === 0}
                    >
                        <Feather
                            name="chevrons-left"
                            size={28}
                            color={currentSectionIndex === 0 ? "gray" : "black"}
                            style={currentSectionIndex === 0 && styles.disabledIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={moveToPrevUnit}
                        disabled={currentUnitIndex === 0 && currentSectionIndex === 0}
                    >
                        <Feather
                            name="chevron-left"
                            size={24}
                            color={
                                currentSectionIndex === 0 && currentUnitIndex === 0
                                ? "gray"
                                : "black"
                            }
                            style={
                                currentSectionIndex === 0 &&
                                currentUnitIndex === 0 &&
                                styles.disabledIcon
                            }
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>
                    {currentSection.title}: {currentUnit.title}
                    </Text>
                    <TouchableOpacity
                    onPress={moveToNextUnit}
                    disabled={currentUnitIndex === currentSection.units.length - 1 &&
                        currentSectionIndex === selectedSections.length - 1}
                    >
                    <Feather
                        name="chevron-right"
                        size={24}
                        color={
                            currentUnitIndex === currentSection.units.length - 1 &&
                            currentSectionIndex === selectedSections.length - 1
                            ? "gray"
                            : "black"
                        }
                        style={
                            currentUnitIndex === currentSection.units.length - 1 &&
                            currentSectionIndex === selectedSections.length - 1 &&
                            styles.disabledIcon
                        }
                    />
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={moveToNextSection}
                    disabled={currentSectionIndex === selectedSections.length - 1}
                    >
                    <Feather
                        name="chevrons-right"
                        size={28}
                        color={
                            currentSectionIndex === selectedSections.length - 1
                            ? "gray"
                            : "black"
                        }
                        style={
                            currentSectionIndex === selectedSections.length - 1 &&
                            styles.disabledIcon
                        }
                    />
                    </TouchableOpacity>
                </View>

                {/* Body */}
                <View style={styles.body}>
                    <TouchableOpacity
                    onPress={moveToPrevSkill}
                    disabled={currentSkillIndex === 0 && currentUnitIndex === 0 && currentSectionIndex === 0} 
                    >
                    <Feather
                        name="chevron-left"
                        size={28}
                        color={
                            currentSkillIndex === 0 &&
                            currentUnitIndex === 0 &&
                            currentSectionIndex === 0
                            ? "gray"
                            : "black"
                        }
                        style={
                            currentSkillIndex === 0 &&
                            currentUnitIndex === 0 &&
                            currentSectionIndex === 0 &&
                            styles.disabledIcon
                        }
                    />
                    </TouchableOpacity>
                    <View style={styles.skillContainer}>
                    <Text style={styles.skillTitle}>{currentSkill.name}</Text>
                    <Text style={styles.skillDescription}>
                        {currentSkill.description}
                    </Text>
                    </View>
                    <TouchableOpacity
                    onPress={moveToNextSkill}
                    disabled={currentSkillIndex === currentUnit.skills.length - 1 &&
                        currentUnitIndex === currentSection.units.length - 1 &&
                        currentSectionIndex === selectedSections.length - 1}
                    >
                    <Feather
                        name="chevron-right"
                        size={28}
                        color={
                            currentSkillIndex === currentUnit.skills.length - 1 &&
                            currentUnitIndex === currentSection.units.length - 1 &&
                            currentSectionIndex === selectedSections.length - 1
                            ? "gray"
                            : "black"
                        }
                        style={
                            currentSkillIndex === currentUnit.skills.length - 1 &&
                            currentUnitIndex === currentSection.units.length - 1 &&
                            currentSectionIndex === selectedSections.length - 1 &&
                            styles.disabledIcon
                        }
                    />
                    </TouchableOpacity>
                </View>

                {/* Close Button */}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleCloseSkillsModal}
                >
                    <Text style={styles.closeButtonText}>End Review</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  reviewButton: {
    margin: 10,
    padding: 15,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    alignItems: "center",
    minWidth: 150,
  },
  reviewButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '90%', // Adjust width of modal
    maxHeight: '80%', // Limit modal height
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Adds shadow for Android
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
    flexWrap: "wrap", // Allow wrapping for body content
  },
  skillContainer: {
    alignItems: "center",
    justifyContent: "center",
    maxWidth: '80%', // Ensure content doesn't span too wide
    marginHorizontal: 10,
  },
  skillTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center", // Center-align text for better aesthetics
    flexWrap: "wrap", // Allow text wrapping
  },
  skillDescription: {
    fontSize: 16,
    textAlign: "center", // Center text
    flexShrink: 1, // Allow the text to shrink if needed
    maxWidth: "90%", 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center", // Ensure the header text is centered
    flex: 1, // Allow the text to occupy available space
    marginHorizontal: 10,
  },
  closeButton: {
    padding: 15,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center", // Center the close button horizontally
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerIcon: {
    fontSize: 18,
    marginHorizontal: 10,
    color: "#007AFF",
  },
  disabledIcon: {
    color: "#ccc",
  },
  bodyIcon: {
    fontSize: 18,
    marginHorizontal: 10,
    color: "#007AFF",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  sectionOption: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sectionOptionSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  sectionOptionText: {
    fontSize: 16,
    color: '#333',
  },
  sectionOptionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  xButton: {
    alignSelf: 'flex-end',
  }
});

export default ReviewModal;
