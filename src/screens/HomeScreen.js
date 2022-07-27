//import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useMemo, useContext } from "react";
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import AeyonTitle from '../components/logo/AeyonTitle'
import { useTheme, Spinner, Layout, Text, Button, Divider, TopNavigation, TopNavigationAction, Icon } from "@ui-kitten/components";
import { SettingsIcon } from "../components/Icons";
import { BluetoothDisabled, BluetoothNotPermitted } from "../components/home/TopViewBluetooth";
import { ScanQR, TrolleyConnecting, TrolleyConnected, TrolleyDisconnected } from "../components/home/TopViewTrolley";
import { BluetoothContext } from "../lib/bluetooth";
import { TrolleysContext } from "../lib/trolleys";
import { MapContext } from "../lib/map_context";
//import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
// const DrawerIcon = (props) => <Icon {...props} name="arrow-back" />;



const HomeScreen = ({navigation}) => {

  
  // React.useEffect(
  //   () =>
  //     navigation.addListener('beforeRemove', (e) => {
  //       e.preventDefault();
  //       console.log('bruh_home')
  //     }),
  //   [navigation]
  // );

  const { simpleBluetoothState } = useContext(BluetoothContext);
  const { trolleysState, trolleyConnected } = useContext(TrolleysContext);
  const spinner = useMemo(() => <Spinner size='large' />, []);
  let topContent;
  if (simpleBluetoothState === "enabled") {
    if (trolleysState.selectedTrolley === null) {
      topContent = <ScanQR />;
    }
    else {
      if (trolleyConnected === "loading") {
        topContent = <TrolleyConnecting />
      }
      else if (trolleyConnected) {
        topContent = <TrolleyConnected />
      }
      else {
        topContent = <TrolleyDisconnected />
      }
    }
  }
  else {
    switch(simpleBluetoothState) {
      case "checkingPermissions":
        topContent = spinner
        break;
      case "loading":
        topContent = spinner
        break;
      case "disabled":
        topContent = <BluetoothDisabled />;
        break;
      case "not permitted":
        topContent = <BluetoothNotPermitted />
        break;
      default:
    }
  }

  // const theme = useTheme();

  // const [selectedIndex, setSelectedIndex] = useState(0);

  const navTitle = (props) => (
    <View style={{
      paddingLeft: 16,
      flexDirection: 'row',
    }} >
      <AeyonTitle width={120} />
      {/* <Text category='h4' {...props}
        style={{

        }}
      >
        Aeyon
      </Text> */}
    </View>
  );

  const navAccessoryRight = <TopNavigationAction icon={SettingsIcon}/>;

  return (
    <>
      <TopNavigation
        title={navTitle}
        accessoryRight={navAccessoryRight}
      />
      <Divider />
      <Layout
        style={{
          flex: 5,
          padding: 16,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {topContent}
      </Layout>
      <Layout
        style={{
          flex: 3,
          paddingHorizontal: 16,
        }}
      >
        <Button size='large' style={styles.actionButtons}
          accessoryLeft={<Icon name='compass-outline' />} status='info'
          onPress={() => {
            navigation.push('Map')
          }}
        >
          Open Map
        </Button>
        <Button size='large' style={styles.actionButtons} accessoryLeft={<Icon name='shopping-cart-outline' />}
            onPress={() => {
              navigation.push('Products')
            }}
          >
            View Products
        </Button>
        <Button size='large' style={styles.actionButtons} accessoryLeft={<Icon name='people-outline' />} status='danger'
            onPress={() => {
              navigation.push('Customer Support')
            }}
        >
          Request Support
        </Button>
      </Layout>
    </>
)};

export default HomeScreen;

const styles = StyleSheet.create({
  actionButtons: {
    marginVertical: 2,
    width: '100%'
  },
});

{/* <View style={styles.container}>
  <TouchableOpacity
    style={{
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      borderColor: "black",
      borderWidth: 2,
    }}
    onPress={() => {
      console.log("clicked");
    }}
  >
    <Text
      style={{
        borderColor: "black",
        borderWidth: 2,
      }}
    >
      Touch Here
    </Text>
  </TouchableOpacity>
</View> */}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: "column",
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 5,
//   },
// });
