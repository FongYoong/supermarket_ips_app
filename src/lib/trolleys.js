import React, { useState, useEffect, useContext, createContext, useRef, useMemo } from 'react';
import { Linking, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Location from 'expo-location';
import { bluetoothManager, BluetoothContext } from './bluetooth';
import base64 from 'react-native-base64';
import { storeSelectedTrolley, getSelectedTrolley } from './localStorage';

export const TrolleysContext = createContext(undefined);

const trolleyServiceUUID = "b82e3690-6032-4dfb-8b53-0bf1a8a14a53";

const trolleyCharacteristicUUIDs = {
    coordinate: "9d4f98c6-5459-420b-812f-dd255e636228"
}



export function TrolleysProvider ({children}) {

    const {simpleBluetoothState} = useContext(BluetoothContext);

    const [trolleysState, setTrolleysState] = useState({
        availableTrolleys: {},
        selectedTrolley: null,
    });
    const trolleysStateRef = useRef();
    trolleysStateRef.current = trolleysState;

    const availableTrolleysRef = useRef({}); // Keeps track of timing and so on

    const [trolleyConnected, setTrolleyConnected] = useState("loading");
    const [trolleyData, setTrolleyData] = useState({
        values: {},
        error: false
    });
    const canFetchTrolleyData = useRef(true); // Keeps track of timing and so on

    const selectTrolley = (trolleyName) => {
        if (trolleyName in trolleysState.availableTrolleys) {
            const device = trolleysState.availableTrolleys[trolleyName];
            const selectedTrolley = {
                name: trolleyName,
                id: device.id,
            };
            setTrolleysState({
                ...trolleysState,
                selectedTrolley
            });
            storeSelectedTrolley(selectedTrolley);
        }
        else {
            Toast.show({
                type: 'error',
                visibilityTime: 5000,
                text1: `Failed to connect to ${trolleyName}`,
                text2: "Wrong QR code?"
            });
        }
    }

    const deselectTrolley = () => {
        setTrolleysState((prev) => {
            return {
                ...prev,
                selectedTrolley: null
            }
        });
        setTrolleyData((prev) => {
            return {
                values: prev.values,
                error: false
            }
        })
        storeSelectedTrolley(null);
    }

    useEffect(() => {
        let checkAvailableTrolleysId;
        getSelectedTrolley().then((selectedTrolleyString) => {
            const selectedTrolley = JSON.parse(selectedTrolleyString);
            if (selectedTrolley) {
                setTrolleysState((prev) => {
                    return {
                        ...prev,
                        selectedTrolley
                    }
                });
            }
            checkAvailableTrolleysId = setInterval(() => {
                if (trolleysStateRef.current.selectedTrolley) {
                    return;
                }
                console.log('checkAvailableTrolleys')
                const now = new Date();
                const available = Object.fromEntries(Object.entries(availableTrolleysRef.current)
                .filter(([key, value]) => {
                    return (now.getTime() - value.lastActive.getTime()) <= 5000;
                }));
                if (Object.keys(available).sort().join(',') !== Object.keys(availableTrolleysRef.current).sort().join(',')) {
                    setTrolleysState((prev) => {
                        return {
                            ...prev,
                            availableTrolleys: available
                        }
                    });
                }
                availableTrolleysRef.current = available;
            }, 2500);
        })

        return () => {
            if (checkAvailableTrolleysId !== undefined) {
                clearInterval(checkAvailableTrolleysId);
            }
        }
    }, [])

    useEffect(() => {
        if (simpleBluetoothState === "enabled" && trolleysState.selectedTrolley === null) {
            console.log('Start Scanning')
            bluetoothManager.startDeviceScan([trolleyServiceUUID], null, (error, device) => {
                if (error) {
                    console.log('Scan Error:', error);
                    return;
                }
                if (trolleysStateRef.current.selectedTrolley !== null) {
                    // Stop scanning if selected
                    bluetoothManager.stopDeviceScan();
                    return; 
                }
                console.log('scanning')
                if (!(device.name in availableTrolleysRef.current)) {
                    console.log('added device:', device.name)
                    availableTrolleysRef.current = {
                        ...availableTrolleysRef.current,
                        [device.name]: {
                            id: device.id,
                            lastActive: new Date()
                        }
                    }
                    setTrolleysState((prev) => {
                        return {
                            ...prev,
                            availableTrolleys: availableTrolleysRef.current
                        }
                    });
                }
                availableTrolleysRef.current = Object.fromEntries(Object.entries(availableTrolleysRef.current)
                .map(([key, value]) => {
                    return [
                        key,
                        {
                            ...value,
                            lastActive: new Date()
                        }
                    ]
                }));
            });
            return () => bluetoothManager.stopDeviceScan();
        }
    }, [simpleBluetoothState, trolleysState.selectedTrolley])

    const connectSelectedTrolley = () => {
        if(simpleBluetoothState === "enabled" && trolleysState.selectedTrolley !== null) {
            console.log("Start connecting")
            setTrolleyConnected("loading");
            const errorCallback = (e) => {
                setTrolleyConnected(false);
                console.log(e);
            };
            const { id } = trolleysState.selectedTrolley;
            bluetoothManager.connectToDevice(id, { autoConnect: false }).then((device) => {
                console.log("Successfully connected to: ", device.name);
                device.discoverAllServicesAndCharacteristics().then((device) => {
                    console.log("Successfully discovered services/characteristics");
                    setTrolleyConnected(true);
                    // device.services().then((services) => {
                    //     services.forEach((s) => {
                    //         console.log(s.uuid === trolleyServiceUUID);
                    //     })
                    // }).catch((e) => console.log(e))
                }).catch(errorCallback);
            }).catch(errorCallback);
            return () => bluetoothManager.cancelDeviceConnection(id)
        }
    };

    useEffect(() => {
        if (connectSelectedTrolley) {
            return connectSelectedTrolley();
        } 
    }, [simpleBluetoothState, trolleysState.selectedTrolley])

    useEffect(() => {
        if (trolleyConnected === true) {
            console.log("Start fetching")
            const fetchData = async () => {
                if (trolleysStateRef.current.selectedTrolley === null) {
                    throw new Error("Stop fetching.");
                }
                if (canFetchTrolleyData.current) {
                    canFetchTrolleyData.current = false;
                    const { id } = trolleysStateRef.current.selectedTrolley;
                    console.log('Fetch BLE data: ', id)
                    try {
                        const coordinateChar = await bluetoothManager.readCharacteristicForDevice(
                            id,
                            trolleyServiceUUID, // serviceUUID
                            trolleyCharacteristicUUIDs.coordinate, // characteristicUUID
                        );
                        const coordinate = base64.decode(coordinateChar.value);
                        console.log("Fetched data: ", coordinate);
                        setTrolleyData((prev) => {
                            return {
                                values: {
                                    ...prev.values,
                                    coordinate
                                },
                                error: false
                            }
                        })
                    } catch (e) {
                        console.error(e);
                        setTrolleyData((prev) => {
                            return {
                                ...prev,
                                error: true
                            }
                        });
                    } finally {
                        canFetchTrolleyData.current = true;
                    }
                }
            }
            const fetchDataId = setInterval(() => {
                fetchData().catch((e) => {
                    console.log(e);
                    clearInterval(fetchDataId);
                });
            }, 3500)
            return () => {
                clearInterval(fetchDataId);
            }
        }
    }, [trolleyConnected])

    // const value = useMemo(() => (
    //     {bluetoothState, availableTrolleys, selectedTrolley, selectTrolley}
    // ), [bluetoothState, availableTrolleys, selectedTrolley, selectTrolley]);
    // const simpleTrolleysState = summmarizeTrolleysState(trolleysState);

    return (
        <TrolleysContext.Provider value={{
            trolleysState, trolleyConnected, trolleyData,
            selectTrolley, deselectTrolley, connectSelectedTrolley
        }}
        
        >
            {children}
        </TrolleysContext.Provider>
    )
}

// export function summmarizeTrolleysState(trolleysState, trolleyConnected) {
//     // if (bluetoothState.permitted) {
//     //     if (bluetoothState.bluetoothEnabled === 'loading' || bluetoothState.locationEnabled === 'loading') {
//     //         return "loading";
//     //     }
//     //     else if (bluetoothState.bluetoothEnabled && bluetoothState.locationEnabled) {
//     //         return "connected"
//     //     }
//     //     else {
//     //         return "disabled"
//     //     }
//     //     }
//     // else {
//     //     return "not permitted"
//     // }
// }