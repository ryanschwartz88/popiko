import React, { useState, RefObject } from "react";
import {
	View,
	Text,
	StyleSheet,
	Modal,
	Pressable,
	FlatList,
	LayoutRectangle,
	TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSession } from "@/hooks/account/useSession";
import SignOut from "@/components/buttons/SignOut";

const AccountDropdown: React.FC<{ buttonRef: RefObject<TouchableOpacity> }> = ({ buttonRef }) => {
	const { currentAccountUuid, setCurrentAccountUuid, accountData } = useSession();
	const accounts = accountData?.accounts || [];
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [buttonLayout, setButtonLayout] = useState<LayoutRectangle | null>(null);

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

	const currentAccount = accounts.find((account) => account.id === currentAccountUuid) || accounts[0];

	return (
		<>
			{/* Dropdown Button */}
			<TouchableOpacity ref={buttonRef} style={styles.button} onPress={toggleModal}>
                <View style={styles.buttonContent}>
                    <View style={styles.iconAndTextContainer}>
                        <Icon name="account-circle" size={32} color={getIconColor(accounts.indexOf(currentAccount))} style={styles.icon} />
                        <Text style={styles.buttonText}>
                            {currentAccount?.name || "Select Account"}
                        </Text>
                    </View>
                    <Icon
                        name={isModalVisible ? "chevron-up" : "chevron-down"}
                        style={styles.buttonIcon}
                    />
                </View>
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
							style={[
								styles.modalDropdown,
								{
									top: buttonLayout.y + buttonLayout.height + 5,
									left: buttonLayout.x,
								},
							]}
						>
							<View style={styles.currentAccountContainer}>
								<Icon
									name="account-circle"
									size={32}
									color={getIconColor(accounts.indexOf(currentAccount))}
									style={styles.icon}
								/>
								<View>
									<Text style={styles.currentAccountText}>{currentAccount?.name}</Text>
									<Text style={styles.currentAccountSubText}>Skill Group: {currentAccount?.skill_group}</Text>
								</View>
							</View>
							<View style={styles.divider} />
							<FlatList
								data={accounts.filter((account) => account.id !== currentAccountUuid)}
								scrollEnabled={false}
								keyExtractor={(item) => item.id.toString()}
								renderItem={({ item, index }) => (
									<Pressable
										style={styles.dropdownItem}
										onPress={() => {
											setCurrentAccountUuid(item.id);
											toggleModal();
										}}
									>
										<Icon
											name="account-circle"
											size={24}
											color={getIconColor(accounts.indexOf(item))}
											style={styles.icon}
										/>
										<Text style={styles.dropdownItemText}>{item.name}</Text>
									</Pressable>
								)}
							/>
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E9ECEF",
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
});

export default AccountDropdown;
