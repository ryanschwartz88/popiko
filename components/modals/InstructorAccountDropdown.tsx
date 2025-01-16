import React, { useState, RefObject, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	Modal,
	Pressable,
	Image,
	LayoutRectangle,
	TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import SignOut from "@/components/buttons/SignOut";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/hooks/account/client";

const InstructorDropdown: React.FC<{ buttonRef: RefObject<TouchableOpacity>, session: Session | null }> = ({ buttonRef, session }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [buttonLayout, setButtonLayout] = useState<LayoutRectangle | null>(null);
	const [currentName, setCurrentName] = useState('');
	const [dropdownWidth, setDropdownWidth] = useState<number>(200); 


	const shadesOfBlue = ["#007AFF", "#0056D2", "#0046AA", "#003580", "#002966"];

	const getIconColor = (index: number) => shadesOfBlue[index % shadesOfBlue.length];

	const toggleModal = () => {
		if (buttonRef?.current) {
			buttonRef.current.measureInWindow((x: any, y: any, width: any, height: any) => {
				setButtonLayout({ x, y, width, height });
			});
		}
		setIsModalVisible(!isModalVisible);
	};

	const getCurrentName = async () => {
		if (session) {
			const { data, error } = await supabase
				.from('instructors')
				.select('name')
				.eq('id', session.user.id)
				.single();

			if (error) {
				console.error(error);
			} else {
				setCurrentName(data?.name);
			}
		}
	};

	useEffect(() => {
		getCurrentName();
	}, [session]);


	return (
		<>
			{/* Dropdown Button */}
			<TouchableOpacity ref={buttonRef} style={styles.button} onPress={toggleModal}>
                <Entypo name="dots-three-horizontal" size={32} style={styles.icon} />
            </TouchableOpacity>


			{/* Modal */}
			{isModalVisible && buttonLayout && (
				<Modal
					transparent
					animationType="fade"
					visible={isModalVisible}
					onRequestClose={toggleModal}
				>
					<Pressable style={styles.modalOverlay} onPress={toggleModal}>
						<View
							onLayout={(event) => {
								const { width } = event.nativeEvent.layout;
								setDropdownWidth(width);
							}}
							style={[
								styles.modalDropdown,
								{
									top: buttonLayout.y + buttonLayout.height + 5,
									left: buttonLayout.x + buttonLayout.width - dropdownWidth,
								},
							]}
						>
							<View style={styles.currentAccountContainer}>
								<MaterialCommunityIcons
									name="account-circle"
									size={32}
									color={getIconColor(0)}
									style={styles.icon}
								/>
								<View>
									<Text style={styles.currentAccountText}>{currentName}</Text>
									<Text style={styles.currentAccountSubText}>Email: {session?.user.email}</Text>
								</View>
							</View>
							<View style={styles.divider} />
							<SignOut />
						</View>
					</Pressable>
				</Modal>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	button: {
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 12,
    },
    iconAndTextContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#151E26",
    },
    buttonIcon: {
        fontSize: 20,
        color: "#151E26",
        marginLeft: 8,
    },
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.2)",
	},
	modalDropdown: {
		position: "absolute",
		backgroundColor: "#FFFFFF",
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
        minWidth: 200,
	},
	currentAccountContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
	},
	currentAccountText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#151E26",
	},
	currentAccountSubText: {
		fontSize: 14,
        paddingTop: 4,
		color: "#6C757D",
	},
	divider: {
		height: 1,
		backgroundColor: "#E9ECEF",
	},
	dropdownItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#E9ECEF",
	},
	dropdownItemText: {
		fontSize: 16,
		color: "#151E26",
		marginLeft: 8,
	},
	icon: {
		marginRight: 8,
	},
	image: {
		height: 40,
	},
});

export default InstructorDropdown;
