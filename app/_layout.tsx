import { useExpoLocation } from '@/hooks/use-expo-location';
import { CameraType, useCameraPermissions } from 'expo-camera';

import { Stack } from "expo-router";
import { useState } from "react";
import { Button, Text, View } from "react-native";

export default function RootLayout() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const { location, errorMsg, toggle, setToggle } = useExpoLocation();

  // if (!permission) {
  //   // Camera permissions are still loading.
  //   return <View />;
  // }

  // if (!permission.granted) {
  //   // Camera permissions are not granted yet.
  //   return (
  //     <View style={{ padding: 16, backgroundColor: "#fff", marginTop: 100 }}>
  //       <Text>We need your permission to show the camera</Text>
  //       <Button onPress={requestPermission} title="grant permission" />
  //     </View>
  //   );
  // }

  // function toggleCameraFacing() {
  //   setFacing(current => (current === 'back' ? 'front' : 'back'));
  // }

  return (
    <>
      <Stack />
      
      <View style={{ padding: 16, backgroundColor: "#fff" }}>
        {/* <CameraView facing={facing} enableTorch={torch} />
          <View>
            <TouchableOpacity onPress={toggleCameraFacing}>
              <Text>Flip Camera</Text>
            </TouchableOpacity>
          </View> */}
      
        
        {errorMsg ? (
          <Text style={{ color: "red" }}>{errorMsg}</Text>
        ) : location ? (
          <Text>
            Lat: {location.coords.latitude}, Lon: {location.coords.longitude}
          </Text>
        ) : (
          <Text>Fetching location...</Text>
        )}

        <Button title="Refresh Location" onPress={() => setToggle((t) => !t)} />
        
        {/* <Button title={torch ? "Torch On" : "Torch Off"} onPress={() => setTorch(t => !t)} /> */}
        
      </View>
    </>
  );
}
