import React, { useState, useMemo, useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSession } from '@/hooks/account/useSession';
import AccountDropdown from '@/components/modals/AccountDropdown';
import MonthlyTab from '@/components/modals/MonthlyTab';

const CalendarScreen = () => {
const { session, currentAccountUuid } = useSession();
const parentAccount = currentAccountUuid === session?.user.id;

const dropdownButtonRef = useRef(null);

return (
    <View style={styles.container}>
        <View style={styles.header}>
            <AccountDropdown buttonRef={dropdownButtonRef}/>
            <MonthlyTab />
        </View>
        
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
});
