import { useExpoCamera } from '@/hooks/use-expo-camera';
import { useExpoLocation } from '@/hooks/use-expo-location';

import { Stack } from "expo-router";
import { useEffect } from 'react';
import { Button, Text, View } from "react-native";
import ToastManager from 'toastify-react-native';

export default function RootLayout() {

  const { location, errorMsg } = useExpoLocation();
  const { facing, torch, setTorch, permission, requestPermission } = useExpoCamera();

  const k1 = 0.1;
  const k2 = 0.1;
  const omega = 2 * Math.PI / 1000; // one full cycle every 1000 ms

  useEffect(() => {
    const interval = setInterval(() => {
      if (location != null) {
        const sineValue = Math.sin(k1 * location.coords.longitude + k2 * location.coords.latitude - omega * (Date.now()));
        setTorch(sineValue > 0);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={{ padding: 16, backgroundColor: "#fff", marginTop: 100 }}>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  // if (!torch) {
  //   setTorch(true);
  // }

  // function toggleCameraFacing() {
  //   setFacing(current => (current === 'back' ? 'front' : 'back'));
  // }


  return (
    <>
    {/* <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['right', 'top', 'left', 'bottom']}> */}
      <Stack screenOptions={{ headerShown: false }} />
      <ToastManager />
    {/* </SafeAreaView> */}
    </>
    // <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['right', 'top', 'left', 'bottom']}>
    // </SafeAreaView>
        /* <CameraView facing={facing} enableTorch={torch} /> */
          
          /* {errorMsg ? (
            <Text style={{ color: "red" }}>{errorMsg}</Text>
          ) : location ? (
            <Text>
              Lat: {location.coords.latitude}, Lon: {location.coords.longitude}
            </Text>
          ) : (
            <Text>Fetching location...</Text>
          )} */

          /* <Button title="Refresh Location" onPress={() => setToggle((t) => !t)} /> */
          /* <Button title={torch ? "Torch Off" : "Torch On"} onPress={() => setTorch(t => !t)} /> */
  );
}
