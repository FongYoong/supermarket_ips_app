import React, { useState, useEffect, useContext } from "react";
import { useWindowDimensions } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import { ZoomIn, FlyIn, FadeIn } from "../lib/transitions";
import { useTheme, Icon, Layout, Button, Text, Spinner, TopNavigation, TopNavigationAction, Divider, List } from "@ui-kitten/components";
import { Image, ProgressIndicator, resizeModes } from '../components/Image'
import { NavigationBackIcon, LocationIcon } from "../components/Icons";
import ProductCategoryBadge from "../components/ProductCategoryBadge";
import { BluetoothContext } from "../lib/bluetooth";
import { MapContext } from "../lib/map_context";

const ProductDetailsScreen = ({navigation, route}) => {
    const window = useWindowDimensions();
    const { info } = route.params;

    const { simpleBluetoothState } = useContext(BluetoothContext);
    const { setTarget } = useContext(MapContext);

    return (
    <>
        <TopNavigation
            title='Product Info'
            accessoryLeft={
                <TopNavigationAction icon={NavigationBackIcon} 
                    onPress={() => navigation.goBack() }
                />
            }
        />
        <Divider />
        <Layout style={{
            flex: 1,
            paddingHorizontal: 16,
        }}>
            <SharedElement id={`productDetail.${info.id}.image`} >
                <Image 
                    source={{ uri: info.imageUrl }}
                    resizeMode={resizeModes.contain}
                    indicator={ProgressIndicator}
                    indicatorProps={{
                        size: 80,
                        borderWidth: 0,
                        color: 'rgba(150, 150, 150, 1)',
                        unfilledColor: 'rgba(200, 200, 200, 0.2)'
                    }}
                    style={{
                        width: '100%',
                        height: window.height/3
                    }}
                />
            </SharedElement>
            <FlyIn style={{

                //alignItems: 'flex-end',
                //justifyContent: 'space-between'
            }} >
                <Text category="h2" >
                    {info.name}
                </Text>
                <ProductCategoryBadge textCategory="s1" category={info.category}
                    style={{
                        padding: 8,
                        marginTop: 8,
                        marginBottom: 8,
                        alignSelf: 'flex-start'
                    }}
                />
                <Text category='h5' style={{
                    marginVertical: 8,
                    color: '#ff147a',
                    fontWeight: 'bold'
                }} >
                    RM {info.price.toFixed(2)}
                </Text>
                <Text style={{ marginBottom: 24 }}>
                    <Text category='h5' style={{fontWeight: 'bold'}}  >
                        {info.quantity}
                    </Text>
                    <Text category='h5' >
                        &nbsp;in stock
                    </Text>
                </Text>
            </FlyIn>
            <ZoomIn>
                <Button style={{

                }}
                    // disabled={simpleBluetoothState === 'disabled'}
                    size='large'
                    accessoryLeft={LocationIcon} status='info'
                        onPress={() => {
                            setTarget({
                              type: 'product',
                              ...info
                            });
                            navigation.push('Map')
                            //navigation.navigate('Map', { productInfo: info })
                        }}
                    >
                    Locate Item
                </Button>
            </ZoomIn>

        </Layout>
    </>
    )};

export default ProductDetailsScreen;

