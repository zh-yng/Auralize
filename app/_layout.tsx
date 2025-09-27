import { useExpoCamera } from '@/hooks/use-expo-camera';
import { useExpoLocation } from '@/hooks/use-expo-location';
import CameraView from 'expo-camera/build/CameraView';

import { Stack } from "expo-router";
import { Button, Text, View } from "react-native";

export default function RootLayout() {

  const { location, errorMsg } = useExpoLocation();
  const { facing, setFacing, torch, setTorch, permission, requestPermission } = useExpoCamera();
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
      <Stack />
      
      <View style={{ padding: 16, marginBottom: 80, backgroundColor: "#fff" }}>
        <CameraView facing={facing} enableTorch={torch} />
        
        {errorMsg ? (
          <Text style={{ color: "red" }}>{errorMsg}</Text>
        ) : location ? (
          <Text>
            Lat: {location.coords.latitude}, Lon: {location.coords.longitude}
          </Text>
        ) : (
          <Text>Fetching location...</Text>
        )}

        {/* <Button title="Refresh Location" onPress={() => setToggle((t) => !t)} /> */}
        <Button title={torch ? "Torch Off" : "Torch On"} onPress={() => setTorch(t => !t)} />

      </View>
    </>
  );
}
