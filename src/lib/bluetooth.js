import React, { useState, useEffect, createContext, useRef, useMemo } from 'react';
import { PermissionsAndroid } from 'react-native';
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';
// import { checkMultiple, requestMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';
import * as Application from 'expo-application';
import * as Location from 'expo-location';
import { BleManager } from 'react-native-ble-plx';
export const bluetoothManager = new BleManager();

export const BluetoothContext = createContext(undefined);

const androidPermissions = [
    'android.permission.BLUETOOTH_CONNECT',
    'android.permission.BLUETOOTH_SCAN',
    'android.permission.BLUETOOTH_ADVERTISE',
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
];
// const androidPermissions = [
//     PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
//     PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
//     PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
//     PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
// ];

export function BluetoothProvider ({children}) {
    const [bluetoothState, setBluetoothState] = useState({
        checkingPermissions: true,
        permitted: false,
        bluetoothEnabled: 'loading',  // loading, on, off
        locationEnabled: 'loading' // loading, on, off
    });
    const bluetoothStateRef = useRef();
    bluetoothStateRef.current = bluetoothState;


    useEffect(() => {
        requestBluetoothPermissions().then((result) => {
            if (result === 'denied') {
                setBluetoothState((prev) => {
                    return {
                        ...prev,
                        checkingPermissions: false,
                        permitted: false
                    }
                });
            }
            else {
                setBluetoothState((prev) => {
                    return {
                        ...prev,
                        checkingPermissions: false,
                        permitted: true
                    }
                });
            }
        });
        const checkLocationId = setInterval(() => {
            Location.hasServicesEnabledAsync().then((enabled) => {
                if (bluetoothStateRef.current.locationEnabled !== enabled) {
                    setBluetoothState((prev) => {
                        return {
                            ...prev,
                            locationEnabled: enabled
                        }
                    });
                }
            })
        }, 2000)
        return () => {
            clearInterval(checkLocationId);
        }
    }, [])

    useEffect(() => {
        if (bluetoothState.permitted) {
            const subscription = bluetoothManager.onStateChange((state) => {
                if (state === 'PoweredOn') {
                    setBluetoothState((prev) => {
                        return {
                            ...prev,
                            bluetoothEnabled: true
                        }
                    });
                }
                else if (state === 'PoweredOff') {
                    setBluetoothState((prev) => {
                        return {
                            ...prev,
                            bluetoothEnabled: false
                        }
                    });
                }
            }, true);
            return () => subscription.remove();
        }
    }, [bluetoothState.permitted, bluetoothManager]);
    const simpleBluetoothState = summmarizeBluetoothState(bluetoothState);

    return (
        <BluetoothContext.Provider value={{bluetoothState, simpleBluetoothState}} >
            {children}
        </BluetoothContext.Provider>
    )
}

export function summmarizeBluetoothState(bluetoothState) {
    if (bluetoothState.checkingPermissions) {
        return "checkingPermissions"
    }
    else {
        if (bluetoothState.permitted) {
            if (bluetoothState.bluetoothEnabled === 'loading' || bluetoothState.locationEnabled === 'loading') {
                return "loading";
            }
            else if (bluetoothState.bluetoothEnabled && bluetoothState.locationEnabled) {
                return "enabled"
            }
            else {
                return "disabled"
            }
        }
        else {
            return "not permitted"
        }
    }
}

export function openAppSettings () {
    startActivityAsync(ActivityAction.APPLICATION_DETAILS_SETTINGS, {
        data: "package:" + Application.applicationId
    }).catch((e) => console.log(e));
}

export function enableBluetooth () {
    startActivityAsync("android.bluetooth.adapter.action.REQUEST_ENABLE");
    // Linking.sendIntent("android.settings.BLUETOOTH_SETTINGS", [])
}

export function enableLocationServices () {
    Location.enableNetworkProviderAsync();
    // startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS);
    // Linking.sendIntent("android.settings.BLUETOOTH_SETTINGS", [])
}

export function openBluetoothSettings () {
    startActivityAsync(ActivityAction.BLUETOOTH_SETTINGS);
    // Linking.sendIntent("android.settings.BLUETOOTH_SETTINGS", [])
}

export async function requestBluetoothPermissions () {
    const results = await PermissionsAndroid.requestMultiple(androidPermissions);
    console.log(results)
    // PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
    if ([PermissionsAndroid.RESULTS.DENIED].some((r) => Object.values(results).includes(r))) {
        return "denied";
    }
}

// export async function requestBluetoothPermissions () {
//     const results = await requestMultiple(androidPermissions);
//     if ([RESULTS.DENIED, RESULTS.BLOCKED].some((r) => Object.values(results).includes(r))) {
//         return "denied";
//     }
// }

// export async function old_requestBluetoothPermissions () {
//     console.log('bruh-bluetooth')
//     const results = await PermissionsAndroid.requestMultiple(
//         permissions
//     );
//     console.log(results)
//     console.log(Object.values(results))
//     console.log('bruh-bluetooth-end')

//     // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//     //   console.log("Bluetooth permissions granted");
//     // } else {
//     //   console.log("Bluetooth permissions denied");
//     // }
//     // const permissionsRequests = permissions.forEach(async (permission) => {
//     //     try {
//     //         const granted = await PermissionsAndroid.request(
//     //             permission,
//     //           {
//     //             title: "Cool Photo App Camera Permission",
//     //             message:
//     //               "Cool Photo App needs access to your camera " +
//     //               "so you can take awesome pictures.",
//     //             buttonNeutral: "Ask Me Later",
//     //             buttonNegative: "Cancel",
//     //             buttonPositive: "OK"
//     //           }
//     //         );
//     //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//     //           console.log("You can use the camera");
//     //         } else {
//     //           console.log("Camera permission denied");
//     //         }
//     //     } 
//     //     catch (err) {
//     //         console.warn(err);
//     //     }
//     // });
// }