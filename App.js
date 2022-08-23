import React, { useState, useEffect } from "react";
// import AppLoading from 'expo-app-loading';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NavigationContainer } from '@react-navigation/native';

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'pink' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        fontWeight: '400'
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
        fontWeight: '400'
      }}
      text2Style={{
        fontSize: 15
      }}
    />
  ),
};
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { default as mapping } from './mapping.json';
import SplashScreenView from "./src/components/SplashScreenView";
import MainStack from "./src/screens/MainStack";
import MapScreen from "./src/screens/MapScreen";
import { useFonts, fonts } from "./src/lib/fonts";
import { AuthProvider } from "./src/lib/firebase_auth";
import { BluetoothProvider } from "./src/lib/bluetooth";
import { TrolleysProvider } from "./src/lib/trolleys";
import { MapProvider } from "./src/lib/map_context";
import { LogBox } from "react-native";
import { loadShelfAssets } from "./src/meshes/ShelfMesh";
LogBox.ignoreLogs(["timer"]);
LogBox.ignoreLogs(["THREE.FileLoader: HTTP Status 0 received."]);

const queryClient = new QueryClient();

ExpoSplashScreen.preventAutoHideAsync();

// const config = {
//   animation: 'spring',
//   config: {
//     stiffness: 1000,
//     damping: 500,
//     mass: 3,
//     overshootClamping: true,
//     restDisplacementThreshold: 0.01,
//     restSpeedThreshold: 0.01,
//   },
// };

export default function App() {


  const [ fontsLoaded ] = useFonts(fonts);
  const [ appReady, setAppReady ] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        // Keep the splash screen visible while we fetch resources
        // await ExpoSplashScreen.preventAutoHideAsync();
        await loadShelfAssets();
      } catch (e) {
        console.warn(e);
      } finally {
        await ExpoSplashScreen.hideAsync();
        setAppReady(true);
      }
    }
    prepareApp();
  }, []);


  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light} customMapping={mapping} >
        <QueryClientProvider client={queryClient}>
          {appReady ? 
          <AuthProvider>
            <BluetoothProvider>
              <TrolleysProvider>
                <MapProvider>
                  <SafeAreaView style={{ flex: 1 }}>
                    <NavigationContainer>
                      <MainStack />
                    </NavigationContainer>
                    <MapScreen />
                    <Toast config={toastConfig} />
                  </SafeAreaView>
                </MapProvider>
              </TrolleysProvider>
            </BluetoothProvider>
          </AuthProvider>
          :
          <SplashScreenView />
          }
        </QueryClientProvider>
      </ApplicationProvider>
    </>
  );
}

