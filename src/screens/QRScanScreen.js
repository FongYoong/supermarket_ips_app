//import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Spinner, Layout, Text, Button, Divider, TopNavigation, TopNavigationAction, Icon } from "@ui-kitten/components";
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import { Camera } from 'expo-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming, withRepeat, withSequence } from 'react-native-reanimated'; 

const CustomMarker = () => {

  const scale = useSharedValue(1);
  const rotate = useSharedValue('0deg');
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{
        scale: scale.value,
      }, {
        rotateZ: rotate.value
      }],
    };
   });

  useEffect(() => {
    scale.value = withRepeat(
            withSequence(
              withTiming(1.1, { duration: 2000 }),
              withTiming(1, { duration: 2000 }),
            ),
          { numberOfReps: -1 })
    rotate.value = withRepeat(
            withSequence(
              withDelay(1000, withTiming('180deg', { duration: 1000 })),
              withDelay(1000, withTiming('360deg', { duration: 1000 })),
            ),
          { numberOfReps: -1 })
  }, [])

  return (
    <Animated.View style={[{position: 'absolute', left: 0, top: 0, width: '100%', height:'100%',
      alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0)' 
    }, animatedStyles]} >
      <Layout style={{
        width: '70%', height: '70%',
        borderColor: 'white', borderWidth: 6, borderRadius: 200, borderStyle: 'dashed',
        backgroundColor: 'rgba(0,0,0,0)'
      }} />
    </Animated.View>
  )
}

const QRScanScreen = ({navigation, route}) => {

  const { onSuccess } = route.params;

  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    request(PERMISSIONS.ANDROID.CAMERA).then((status) => {
      if (status === RESULTS.GRANTED) {
        setHasPermission(true);
      }
      else {
        navigation.goBack();
      }
    })
    // Camera.requestCameraPermissionsAsync().then(({status}) => {
    //   if (status !== 'granted') {
    //     navigation.goBack();
    //   }
    // })
  }, []);

  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
      {
        hasPermission ?
        <QRCodeScanner
          onRead={(data) => {
            onSuccess(data.data);
            navigation.goBack();
          }}
          cameraProps={{
            autoFocus: RNCamera.Constants.AutoFocus.on,
            autoFocusPointOfInterest: { x: 0.5, y: 0.5 },
            exposure: 0.2,
            //whiteBalance: "shadow"
            //focusDepth: 0.1
            //useCamera2Api: true
          }}
          flashMode={RNCamera.Constants.FlashMode.off}
          topContent={
            <Text>
              Scan QR code displayed on trolley
            </Text>
          }
          showMarker
          customMarker={<CustomMarker />}
        />
      :
        <Spinner size='large' />
      }
    </Layout>
)};

export default QRScanScreen;