
import React, { useState, useEffect, useRef, useContext, useCallback, useMemo } from "react";
import { View } from "react-native";
import BottomSheet from '@gorhom/bottom-sheet';
import { Spinner, Layout, Text, Button, Divider, Icon } from "@ui-kitten/components";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'; 
import { LocationIcon, RecenterLocationIcon } from "../Icons";
import { TrolleysContext } from "../../lib/trolleys";
import { MapContext } from "../../lib/map_context";
import { gridToPhysicalCoordinates } from "../../lib/supermarket_grid";

const snapPoints = ['15%', '35%'];

function MapBottomSheet({loading, selectedSection, onRecenter}) {

    // const [bottomOffset, setBottomOffset] = useState(snapPoints[0]);
    const bottomOffset = useSharedValue(snapPoints[0]);
    const topElementsStyle = useAnimatedStyle(() => {
        return {
          bottom: bottomOffset.value
        };
    });
    const setBottomOffset = (value) => {
        bottomOffset.value =  withSpring(value, { stiffness: 70 });
    }

    const { trolleyConnected, trolleyData } = useContext(TrolleysContext);
    const { mapState, setTarget } = useContext(MapContext);
    const target = mapState.target;

    const bottomSheetRef = useRef(null);
    const handleSheetChanges = useCallback((index) => {
        if (!target && index !== 0) {
            bottomSheetRef.current.snapToIndex(0);
            setBottomOffset(snapPoints[0]);
        }
        else {
            setBottomOffset(snapPoints[index]);
        }
    }, [target, selectedSection]);

    const handleSheetAnimate = useCallback((fromIndex, toIndex) => {
        bottomOffset.value =  withSpring(snapPoints[toIndex], { stiffness: 70 });
    }, []);

    useEffect(() => {
        if (!loading) {
            if (selectedSection && target) {
                bottomSheetRef.current.snapToIndex(1);
            }
            else {
                bottomSheetRef.current.snapToIndex(0);
            }
        }
    }, [loading, selectedSection]);

    // useEffect(() => {
    //     if (!loading) {
    //         if (selectedSection) {
    //             bottomSheetRef.current.snapToIndex(1);
    //         }
    //     }
    // }, [loading, selectedSection]);

    let selectedIsAlsoTarget = false;
    let targetContentTitle;
    if (target) {
        targetContentTitle = target.name;
        if (selectedSection) {
            selectedIsAlsoTarget = target.id === selectedSection.id;
        }
    }

    let distance;
    if (trolleyConnected === true && trolleyData.values.coordinates && target) {
        const startCoords = trolleyData.values.coordinates;
        const targetNode = target.mapPin;
        const endCoords = gridToPhysicalCoordinates(targetNode.x, targetNode.y);
        distance = Math.sqrt(Math.pow(endCoords.x - startCoords.x, 2) + Math.pow(endCoords.y - startCoords.y, 2));
        // findPhysicalDistanceBetweenGridNodes(trolleyData.values.coordinates)
    }

    return (
        <View
            style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                zIndex: 1
            }}
        >
            <Animated.View style={[{
                    zIndex: 1,
                    position: 'absolute',
                    right: 0,
                    transform: [{translateY: -10}]
                }, topElementsStyle]}
            >
            {trolleyConnected === true ?
                <Button style={{

                    }}
                    size='medium'
                    accessoryLeft={RecenterLocationIcon} status='primary'
                    onPress={onRecenter}
                >
                    Recenter
                </Button>
                :
                <Layout
                    style={{
                        backgroundColor: 'orange',
                        //opacity: 0.7,
                        borderRadius: 12,
                        padding: 8
                    }}
                >
                    <Text category='s1' style={{
                        color: 'white',
                    }}>
                        Trolley disconnected.
                    </Text>
                </Layout>
            }
            </Animated.View>
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                onAnimate={handleSheetAnimate}
            >
                <Layout style={{
                    flex: 1,
                    //padding: 8,
                }} >
                    {target && 
                        <>
                            <Layout
                                style={{
                                    margin: 8,
                                    paddingLeft: 16,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    height: '30%'
                                }}
                            >
                                <Layout
                                    style={{
                                        flex: 1,
                                    }}
                                >
                                    <Text category='s1' appearance='hint' numberOfLines={2} >
                                        {targetContentTitle}
                                    </Text>
                                    <Text category='h5' >
                                        {distance ? `• ${distance.toFixed(2)} metres` : "-"}
                                    </Text>
                                </Layout>
                                <Button
                                    style={{
                                        marginHorizontal: 16,
                                    }}
                                    size='medium'
                                    accessoryLeft={<Icon name='close-outline' />}
                                    appearance='outline'
                                    status='danger'
                                    onPress={() => {
                                        setTarget(undefined)
                                    }}
                                >
                                    Stop Route
                                </Button>
                            </Layout>
                            <Divider style={{ marginVertical: 16 }} />
                        </>
                    }
                    <Layout
                        style={{
                            paddingHorizontal: 16
                        }}
                    >
                        {selectedSection ?
                            <>
                                <Text category='h6' style={{ fontWeight: 'bold', paddingBottom: 8 }} >
                                    &gt; {selectedSection.name}
                                </Text>
                                <Button style={{
                                    marginTop: 8
                                }}
                                    disabled={selectedIsAlsoTarget}
                                    size='medium'
                                    accessoryLeft={LocationIcon} status='info'
                                    onPress={() => {
                                        setTarget({
                                            type: 'section',
                                            ...selectedSection
                                        });
                                    }}
                                >
                                    {selectedIsAlsoTarget ? "Selected" : "Locate Section"}
                                </Button>
                            </>
                            :
                            <Text category='s1' >
                                Tap on a shelf to view its details.
                            </Text>
                        }
                    </Layout>
                </Layout>
            </BottomSheet>
        </View>
    )
}

export default MapBottomSheet;