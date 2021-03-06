//import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useContext } from "react";
import LottieView from 'lottie-react-native';
import { useTheme, Layout, Text, Button } from "@ui-kitten/components";
import { BluetoothIcon, LocationIcon, ScanQRIcon, SettingsIcon } from "../Icons";
import { openAppSettings, enableBluetooth, enableLocationServices, BluetoothContext } from "../../lib/bluetooth";
import { TrolleysContext } from "../../lib/trolleys";
import { ZoomIn } from "../../lib/transitions";
//import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
export function BluetoothDisabled () {

    const { bluetoothState } = useContext(BluetoothContext);

    return (
        <ZoomIn style={{flex: 1}} >
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
                        width: '30%',
                    }}
                    source={require('../../../assets/lottie/bluetooth/disconnected.json')}
                />
                <Layout>
                    <Text category='h1' >
                        Oops, something is off...
                    </Text>
                    {!bluetoothState.bluetoothEnabled &&
                        <Button
                            style={{
                                marginVertical: 4
                            }}
                            size='large'
                            accessoryLeft={BluetoothIcon}
                            status='warning'
                            onPress={enableBluetooth}
                        >
                            Enable Bluetooth
                        </Button>
                    }
                    {!bluetoothState.locationEnabled &&
                        <Button
                            size='large'
                            accessoryLeft={LocationIcon}
                            status='warning'
                            onPress={enableLocationServices}
                        >
                            Enable Location Services
                        </Button>
                    }

                </Layout>
            </Layout>
        </ZoomIn>
    )
}

export function BluetoothNotPermitted () {
    return (
        <ZoomIn style={{flex: 1}} >
            <Layout
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <LottieView
                    autoPlay={false}
                    style={{
                        width: '30%',
                    }}
                    source={require('../../../assets/lottie/bluetooth/not_permitted.json')}
                />
                <Layout>
                    <Text category='h2' >
                        Please allow
                        <Text category='h2' style={{fontWeight:'bold'}} > Bluetooth </Text>
                        and
                        <Text category='h2' style={{fontWeight:'bold'}} > Location Services </Text>
                        for the app to work.
                    </Text>
                    <Button
                        style={{
                            marginVertical: 4
                        }}
                        size='large'
                        accessoryLeft={SettingsIcon}
                        status='warning'
                        onPress={openAppSettings}
                    >
                        Go to Settings
                    </Button>
                </Layout>
            </Layout>
        </ZoomIn>
    )
}