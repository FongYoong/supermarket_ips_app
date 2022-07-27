//import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useTheme, Layout, Text, Button, Divider, Icon } from "@ui-kitten/components";
import { ScanQRIcon, SettingsIcon } from "../Icons";
import { openAppSettings } from "../../lib/bluetooth";
import { TrolleysContext } from "../../lib/trolleys";
import { ZoomIn, FlyIn, FadeIn } from "../../lib/transitions";
//import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'; 
//import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export function ScanQR () {
    const navigation = useNavigation();
    const { trolleysState, selectTrolley } = useContext(TrolleysContext);

    return (
        <ZoomIn style={{flex: 1}} >
            <Layout
                style={{
                    flex: 1,
                }}
            >
                <LottieView
                    autoPlay
                    style={{
                        alignSelf: 'center',
                        width: '100%',
                    }}
                    source={require('../../../assets/lottie/bluetooth/scanning.json')}
                />
                <View
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '60%'
                    }}
                >
                    <Text category='s1' >
                        {Object.keys(trolleysState.availableTrolleys).length} trolley(s) detected
                    </Text>
                    <Button
                        style={{
                            marginTop: 16,
                            borderRadius: 24
                        }}
                        size='giant'
                        accessoryLeft={ScanQRIcon} status='info'
                        onPress={() => {
                            navigation.push('QRScan', {
                                onSuccess: selectTrolley
                            })
                        }}
                    >
                        Scan QR to Connect
                    </Button>
                </View>

            </Layout>

        </ZoomIn>
    )
}

export function TrolleyConnecting () {

    const { trolleysState } = useContext(TrolleysContext);
    const selectedTrolley = trolleysState.selectedTrolley;

    return (
        <FlyIn style={{flex: 1}} >
            <Layout
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <LottieView
                    autoPlay
                    style={{
                        width: '100%',
                    }}
                    source={require('../../../assets/lottie/trolley/connecting.json')}
                />
                <Layout>
                    <Text category='h5' style={{textAlign: 'center', marginVertical: 8}} >
                        Connecting to&nbsp;
                        <Text category='h5' style={{fontWeight:'bold'}} >{selectedTrolley.name}</Text>
                        ...
                    </Text>
                </Layout>
            </Layout>
        </FlyIn>
    )
}

export function TrolleyConnected () {

    const { trolleysState, trolleyData, deselectTrolley } = useContext(TrolleysContext);
    const selectedTrolley = trolleysState.selectedTrolley;

    return (
        <FadeIn style={{flex: 1}} >
            <Layout
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {/* <LottieView
                    autoPlay
                    //resizeMode='contain'
                    style={{
                        width: '50%',
                        transform: [
                            { scale: 1.3 }
                        ]
                    }}
                    source={require('../../../assets/lottie/trolley/disconnected.json')}
                /> */}
                <Layout>
                    <Text category='h5' style={{textAlign: 'center', marginBottom: 8}} >
                        Connected to&nbsp;
                        <Text category='h5' style={{fontWeight:'bold'}} >{selectedTrolley.name}</Text>
                    </Text>
                    {trolleyData.error &&
                        <Text category='s1' style={{textAlign: 'center', marginBottom: 8}} >
                            An error occurred.
                        </Text>
                    }
                    <Button
                        style={{
                            marginVertical: 4,
                        }}
                        size='large'
                        accessoryLeft={<Icon name='trash-outline' />}
                        appearance='outline'
                        status='danger'
                        onPress={deselectTrolley}
                    >
                        Change to another trolley
                    </Button>
                </Layout>
            </Layout>
        </FadeIn>
    )
}

export function TrolleyDisconnected () {

    const { trolleysState, connectSelectedTrolley, deselectTrolley } = useContext(TrolleysContext);
    const selectedTrolley = trolleysState.selectedTrolley;

    return (
        <FadeIn style={{flex: 1}} >
            <Layout
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <LottieView
                    autoPlay
                    //resizeMode='contain'
                    style={{
                        width: '50%',
                        transform: [
                            { scale: 1.3 }
                        ]
                    }}
                    source={require('../../../assets/lottie/trolley/disconnected.json')}
                />
                <Layout>
                    <Text category='h5' style={{textAlign: 'center', marginBottom: 8}} >
                        <Text category='h5' style={{fontWeight:'bold', textDecorationLine: 'underline', color: 'red'}} >Failed</Text>
                        &nbsp;to connect to&nbsp;
                        <Text category='h5' style={{fontWeight:'bold'}} >{selectedTrolley.name}</Text>
                    </Text>
                    <Button
                        style={{
                            marginVertical: 4
                        }}
                        size='large'
                        accessoryLeft={<Icon name='repeat-outline' />}
                        status='info'
                        onPress={connectSelectedTrolley}
                    >
                        Retry connection
                    </Button>
                    <Button
                        style={{
                            marginVertical: 4,
                        }}
                        size='large'
                        accessoryLeft={<Icon name='trash-outline' />}
                        appearance='outline'
                        status='danger'
                        onPress={deselectTrolley}
                    >
                        Scan for other trolleys
                    </Button>
                </Layout>
            </Layout>
        </FadeIn>
    )
}