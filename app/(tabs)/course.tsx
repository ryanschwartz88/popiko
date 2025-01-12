import React, { useState, useMemo, useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSession } from '@/hooks/account/useSession';
import AccountDropdown from '@/components/modals/AccountDropdown';
import MonthlyTab from '@/components/modals/MonthlyTab';
import SwimProgress from '@/components/course/SkillProgression';
import ReviewLibrary from '@/components/course/ReviewLibrary';

const CourseScreen = () => {
    const { session, currentAccountUuid, accountData } = useSession();
    const parentAccount = currentAccountUuid === session?.user.id;

    const dropdownButtonRef = useRef(null);

    const { last_obtained_skill, skill_group} = useMemo(() => {
        const currentAccount = accountData?.accounts.find((account) => account.id === currentAccountUuid);
        return {
            last_obtained_skill: currentAccount?.last_obtained_skill,
            skill_group: currentAccount?.skill_group
        }
    }, [accountData, currentAccountUuid]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <AccountDropdown buttonRef={dropdownButtonRef}/>
                <MonthlyTab />
            </View>
            { parentAccount ? <ReviewLibrary /> : <SwimProgress skillGroup={skill_group} lastSkill={last_obtained_skill} /> }
        </View>
    );
};

export default CourseScreen;

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
