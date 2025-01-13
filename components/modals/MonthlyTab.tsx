import React, { useState, useMemo } from 'react';
import {
	Modal,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { MaterialIcons } from '@expo/vector-icons';
import { useCharges } from '@/hooks/payments/useCharges';
import { Charge } from '@/types/charge';
import { useSession } from '@/hooks/account/useSession';
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';

const MonthlyTab: React.FC = () => {
	const [modalVisible, setModalVisible] = useState(false);
	const currentDate = new Date();
	const [activeSectionsByYear, setActiveSectionsByYear] = useState<Record<string, number[]>>({});
	const { accountData, session } = useSession();

	const startDate = new Date(accountData?.created_at || new Date());

	if (!session) {
		return null;
	}
	
	const allCharges: Charge[] = useCharges(session.user.id, startDate);

	// Generate months grouped by year from account creation to now
	const groupedMonths = useMemo(() => {
		const grouped: Record<string, { month: number; year: number }[]> = {};
		let current = currentDate;
		
		while (current >= startDate) {
			const year = current.getFullYear();
			const month = current.getMonth();
			if (!grouped[year]) {
				grouped[year] = [];
			}
			grouped[year].push({ month, year });
			current = subMonths(current, 1);
		}
		
		return Object.entries(grouped).map(([year, months]) => ({
			title: year,
			data: months,
		})).reverse();
	}, [currentDate, startDate]);
	
	// Precompute charges for each month
	const chargesByMonth = useMemo(() => {
		const charges: Record<string, Charge[]> = {};
		groupedMonths.forEach(({ data }) => {
			data.forEach(({ month, year }) => {
				const start = startOfMonth(new Date(year, month));
				const end = endOfMonth(start);
				const filteredCharges = allCharges.filter(
					(charge) => charge.date >= start && charge.date <= end
				);
				const formattedMonth = format(start, 'MMM yyyy');
				charges[formattedMonth] = filteredCharges;
			});
		});
		
		Object.values(charges).forEach((chargeList) => {
			chargeList.sort((a, b) => a.date.getTime() - b.date.getTime());
		});
		return charges;
	}, [groupedMonths, allCharges]);
	

	const renderHeader = (
		month: { month: number; year: number },
		index: number,
		isActive: boolean
	) => {
		const formattedMonth = format(new Date(month.year, month.month), 'MMM yyyy');
		const monthCharges = chargesByMonth[formattedMonth] || [];
		const totalAmount = monthCharges.reduce((sum, charge) => sum + (charge.discount ? charge.amount - charge.amount *charge.discount : charge.amount), 0);
		
		return (
			<View style={styles.accordionHeader}>
			<Text style={styles.accordionHeaderText}>
				{format(new Date(month.year, month.month), 'MMMM')}
			</Text>
			<View style={styles.accordionHeaderAmountContainer}>
				<Text style={styles.accordionHeaderAmount}>${totalAmount.toFixed(2)}</Text>
				<MaterialIcons
					name={isActive ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
					size={24}
					color="black"
				/>
			</View>
			</View>
		);
	};
	
	const renderContent = (month: { month: number; year: number }) => {
		const formattedMonth = format(new Date(month.year, month.month), 'MMM yyyy');
		const monthCharges = chargesByMonth[formattedMonth] || [];
		const totalAmount = monthCharges.reduce((sum, charge) => sum + (charge.discount ? charge.amount - charge.amount *charge.discount : charge.amount), 0);
		
		return (
			<View style={styles.accordionContent}>
			{/* Header Row */}
			<View style={styles.contentHeader}>
				<Text style={[styles.column, styles.columnDate]}>Date</Text>
				<Text style={[styles.column, styles.columnTitle]}>Title</Text>
				<Text style={[styles.column, styles.columnAmount]}>Amount</Text>
			</View>
			<View style={styles.separator} />
		
			{/* Events */}
			{monthCharges.length > 0 ? (
				monthCharges.map((charge) => (
					<View key={charge.id} style={styles.eventRow}>
						<Text style={[styles.column, styles.columnDate]}>
							{format(charge.date, 'MM/dd')}
						</Text>
						<Text style={[styles.column, styles.columnTitle]}>{charge.title}</Text>
						<View style={[styles.column, styles.columnAmount, { alignItems: 'flex-end' }]}>
							{charge.discount ? (
								<View style={{ alignItems: 'flex-end' }}>
									<Text style={styles.strikeThrough}>
									${charge.amount?.toFixed(2)}
									</Text>
									<Text style={styles.discountText}>
									${((charge.amount || 0) - (charge.amount || 0) * charge.discount).toFixed(2)}
									</Text>
								</View>
							) : (
							<Text style={styles.columnAmount}>
								${charge.amount?.toFixed(2)}
							</Text>
							)}
						</View>
					</View>
				  ))
			) : (
				<Text style={styles.noEventsText}>
					No charges for {formattedMonth}.
				</Text>
			)}
		
			{/* Total Row */}
			{monthCharges.length > 0 && (
				<View style={styles.totalRow}>
				<Text style={styles.totalText}>Total:</Text>
				<Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
				</View>
			)}
			</View>
		);
	};
	

	const renderYearHeader = (year: string) => (
		<View style={styles.yearHeader}>
			<Text style={styles.yearHeaderText}>{year}</Text>
		</View>
	);

	const handleAccordionChange = (year: string, newSections: number[]) => {
		setActiveSectionsByYear({
			[year]: newSections.slice(-1), // Keep only one section open for the active year
		});
	};
	
	

	return (
	<>
		<TouchableOpacity
			style={styles.iconButton}
			onPress={() => setModalVisible(true)}
		>
		<MaterialIcons name="account-balance" size={24} color="black" />
		</TouchableOpacity>

		<Modal
			animationType="slide"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => setModalVisible(false)}
		>
		<SafeAreaView style={styles.centeredView}>
			<View style={styles.modalView}>
			<TouchableOpacity
				style={styles.closeButton}
				onPress={() => setModalVisible(false)}
			>
				<MaterialIcons name="close" size={24} color="black" />
			</TouchableOpacity>
			<Text style={styles.modalText}>Invoices</Text>

			{/* Payment Instructions */}
			<View style={styles.paymentInstructions}>
				<Text style={styles.paymentText}>
					For monthly users, payments are due on the 2nd of each month.
				</Text>
				<Text style={styles.paymentText}>
					Payments can be made in person or through Zelle at{' '}
					<Text style={styles.emphasizedEmail}>payments@popikotutoring.com</Text>.
				</Text>
			</View>


			{groupedMonths.map(({ title: year, data: months }) => (
				<SafeAreaView style={styles.year} key={year}>
					{/* Year Header */}
					{renderYearHeader(year)}

					{/* Monthly Accordion */}
					<Accordion
						sections={months}
						activeSections={activeSectionsByYear[year] || []}
						renderHeader={(month, index, isActive) => renderHeader(month, index, isActive)}
						renderContent={(month) => renderContent(month)}
						onChange={(newSections) => handleAccordionChange(year, newSections)}
						expandMultiple={false} // Allow only one section at a time
						renderAsFlatList
						underlayColor="#fff"
					/>
				</SafeAreaView>
			))}

			</View>
		</SafeAreaView>
		</Modal>
	</>
	);
};

const styles = StyleSheet.create({
	iconButton: {
		marginRight: 10,
		paddingHorizontal: 12,
	},
	centeredView: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	modalView: {
		backgroundColor: 'white',
		minHeight: '90%',
		borderTopEndRadius: 20,
		borderTopStartRadius: 20,
		padding: 35,
		alignItems: 'center',
		width: '100%',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	closeButton: {
		alignSelf: 'flex-end',
		position: 'absolute',
		top: 20,
		right: 20,
	},
	modalText: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	paymentInstructions: {
		paddingHorizontal: 16,
		paddingVertical: 10,
		backgroundColor: '#f9f9f9', // Subtle background for distinction
		borderRadius: 8,
		width: '100%',
	},
	paymentText: {
		fontSize: 16,
		color: '#333',
		lineHeight: 24,
		marginBottom: 10,
	},
	emphasizedEmail: {
		color: '#007BFF', // Blue for emphasis
		fontWeight: 'bold', // Make it stand out
		textDecorationLine: 'underline', // Optional: Adds an underline
	},
	year: {
		width: '100%',
	},
	yearHeader: {
		padding: 10,
		backgroundColor: '#e0e0e0',
		borderRadius: 5,
		marginTop: 10,
	},
	yearHeaderText: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	accordionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 10,
		backgroundColor: '#f0f0f0',
		borderRadius: 5,
		marginTop: 5,
	},
	accordionHeaderText: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	accordionHeaderAmount: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#007BFF',
		marginRight: 10,
	},
	accordionHeaderAmountContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	accordionContent: {
		padding: 10,
		backgroundColor: '#ffffff',
		borderTopWidth: 1,
		borderTopColor: '#ddd',
	},
	contentHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: 5,
	},
	column: {
		flex: 1,
		textAlign: 'left',
	},
	columnDate: {
		flex: 2,
		textAlign: 'left',
	},
	columnTitle: {
		flex: 4,
		textAlign: 'left',
	},
	columnAmount: {
		flex: 2,
		textAlign: 'right',
	},
	strikeThrough: {
		textDecorationLine: 'line-through',
	},
	separator: {
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		marginVertical: 5,
	},
	eventRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 5,
	},
	noEventsText: {
		fontSize: 14,
		color: 'gray',
		textAlign: 'center',
		marginTop: 10,
	},
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
		borderTopWidth: 1,
		borderTopColor: '#ddd',
		paddingTop: 10,
	},
	totalText: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	totalAmount: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#007BFF',
	},
	discountText: {
		fontWeight: 'bold',
		color: '#007BFF', 
	},
	  
});

export default MonthlyTab;
