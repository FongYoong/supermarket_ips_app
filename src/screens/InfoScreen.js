import React, { useContext, useEffect } from "react";
import { StyleSheet, View } from 'react-native';
import { useTheme, Spinner, Layout, Text, Button, Divider, TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { InfoIcon, NavigationBackIcon } from "../components/Icons";
import AeyonTitle from "../components/logo/AeyonTitle";

const InfoScreen = ({navigation}) => {

    return (
    <>
        <TopNavigation
            title='Info'
            accessoryLeft={
                <TopNavigationAction icon={NavigationBackIcon} 
                    onPress={() => navigation.goBack() }
                />
            }
        />
        <Divider />
        <Layout style={{
            flex: 1,
            padding: 16,
            alignItems: 'flex-start',
            justifyContent: 'flex-start'
        }} >
            <AeyonTitle width={300} height={100} style={{ marginLeft: 8 }} />
            <Text >
                • The Aeyon app enables users to view product listings and interact with Aeyon's smart trolleys.
                    Using visible-light-communication (VLC), these trolleys provide location information that is beneficial for navigating the supermarket.
            </Text>
            <Text>
                • Developed as part of Integrated Design Project.
            </Text>
        </Layout>
    </>
)};

export default InfoScreen;