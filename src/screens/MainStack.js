import React from 'react';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import HomeScreen from "./HomeScreen";
import QRScanScreen from "./QRScanScreen";
import ProductsScreen from "./ProductsScreen";
import ProductDetailsScreen from "./ProductDetailsScreen";
import MapDummyScreen from './MapDummyScreen';
import SupportScreen from './SupportScreen';
import InfoScreen from './InfoScreen';

const StackNavigator = createSharedElementStackNavigator();

function MainStack() {
    return (
        <StackNavigator.Navigator
            initialRouteName="Home"
            screenOptions={{
            headerShown: false,
            // cardStyleInterpolator: ({ current }) => ({
            //     cardStyle: {
            //       opacity: current.progress,
            //     },
            // })
            }}
        >
            <StackNavigator.Screen name="Home" component={HomeScreen} />
            <StackNavigator.Screen name="QRScan" component={QRScanScreen}
                options={{
                    cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS   
                }}
            />
            <StackNavigator.Screen name="Products" component={ProductsScreen}
                options={{
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS   
                }}
            />
            <StackNavigator.Screen
                name="ProductDetails"
                component={ProductDetailsScreen}
                sharedElements={(route, otherRoute, showing) => {
                    if (otherRoute.name === 'Products') {
                    const { info } = route.params;
                    return [`productDetail.${info.id}.image`];
                    }
                }}
                options={{
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS   
                }}
            />
            <StackNavigator.Screen name="Map" component={MapDummyScreen}
                options={{
                    cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid    
                }}
            />
            <StackNavigator.Screen name="Support" component={SupportScreen}
                options={{
                    cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid   
                }}
            />
            <StackNavigator.Screen name="Info" component={InfoScreen}
                options={{
                    cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid   
                }}
            />
            {/* <StackNavigator.Screen name="Map" component={MapScreen}
            options={{
                cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid    
            }}
            /> */}
        </StackNavigator.Navigator>
    );
}

export default MainStack;