import React, { useMemo, useContext } from "react";
import { StyleSheet, View } from 'react-native';
import AeyonTitle from '../components/logo/AeyonTitle'
import { Spinner, Layout, Button, Divider, TopNavigation, TopNavigationAction, Icon } from "@ui-kitten/components";
import { InfoIcon } from "../components/Icons";
import { BluetoothDisabled, BluetoothNotPermitted } from "../components/home/TopViewBluetooth";
import { ScanQR, TrolleyConnecting, TrolleyConnected, TrolleyDisconnected } from "../components/home/TopViewTrolley";
import { BluetoothContext } from "../lib/bluetooth";
import { TrolleysContext } from "../lib/trolleys";
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

  const navAccessoryRight = <TopNavigationAction icon={InfoIcon} onPress={ () => navigation.push('Info') } />;

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
              navigation.push('Support')
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