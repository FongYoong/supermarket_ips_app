import React from "react";
import { Linking } from 'react-native';
import { Layout, Text, Button, Divider, TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { NavigationBackIcon, GitHubIcon } from "../components/Icons";
import AeyonTitle from "../components/logo/AeyonTitle";

const githubUrl = "https://github.com/FongYoong/supermarket_ips_esp32";

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
                • Developed as part of UEEA2148 Integrated Design Project.
            </Text>
            <Button style={{
                marginTop: 16,
                alignSelf: 'center'
            }}
                size='medium'
                accessoryLeft={GitHubIcon} status='basic'
                appearance='filled'
                onPress={async () => {
                    await Linking.openURL(githubUrl);
                }}
            >
                GitHub
            </Button>
        </Layout>
    </>
)};

export default InfoScreen;