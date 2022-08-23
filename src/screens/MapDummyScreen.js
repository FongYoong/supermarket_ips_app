import React, { useContext, useEffect } from "react";
import { useTheme, Spinner, Layout, Text, Button, Divider, TopNavigation, TopNavigationAction, Icon } from "@ui-kitten/components";
import { MapContext } from "../lib/map_context";
//import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
// const DrawerIcon = (props) => <Icon {...props} name="arrow-back" />;



const MapDummyScreen = ({navigation}) => {

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            hideMap();
        });
        return unsubscribe;
    }, [navigation]);


    const { displayMap, hideMap } = useContext(MapContext);

    useEffect(() => {
        displayMap(navigation);
    }, [])

  return (
      <Layout />
)};

export default MapDummyScreen;