
import React, { useState, useEffect, useRef, useContext, useCallback, useMemo } from "react";
import BottomSheet from '@gorhom/bottom-sheet';
import { Spinner, Layout, Text, Button, Divider, Icon } from "@ui-kitten/components";
import { LocationIcon } from "../Icons";
import { MapContext } from "../../lib/map_context";

const snapPoints = ['15%', '35%'];

function MapBottomSheet({loading, selectedSection}) {

    const { mapState, setTarget } = useContext(MapContext);
    const target = mapState.target;

    const bottomSheetRef = useRef(null);
    const handleSheetChanges = useCallback((index) => {
        if (!target && !selectedSection && index !== 0) {
            bottomSheetRef.current.snapToIndex(0);
        }
    }, [target, selectedSection]);

    useEffect(() => {
        if (!loading) {
            if (selectedSection) {
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

    let targetContentTitle;
    if (target) {
        targetContentTitle = target.name;
    }


    return (
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
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
                            • 18 metres
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
                        <Text category='h6' style={{ paddingBottom: 8 }} >
                            &gt; {selectedSection.name}
                        </Text>
                        <Button style={{
                            marginTop: 8
                        }}
                            // disabled={simpleBluetoothState === 'disabled'}
                            size='medium'
                            accessoryLeft={LocationIcon} status='info'
                            onPress={() => {
                                setTarget({
                                    type: 'section',
                                    ...selectedSection
                                });
                            }}
                        >
                            Locate Section
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
    )
}

export default MapBottomSheet;