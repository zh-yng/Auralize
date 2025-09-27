import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from "expo-location";

import { Stack } from "expo-router";
import { useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

export default function RootLayout() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toggle, setToggle] = useState(false);

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

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       // Ask permission
  //       const { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== "granted") {
  //         setErrorMsg("Permission to access location was denied");
  //         return;
  //       }

  //       // Get location
  //       const loc = await Location.getCurrentPositionAsync({});
  //       setLocation(loc);
  //     } catch (err) {
  //       setErrorMsg("Error getting location");
  //     }
  //   })();
  // }, [toggle]);

  return (
    <>
      <Stack />
      
      <View style={{ padding: 16, backgroundColor: "#fff" }}>
        <CameraView facing={facing} enableTorch={torch} />
          <View>
            <TouchableOpacity onPress={toggleCameraFacing}>
              <Text>Flip Camera</Text>
            </TouchableOpacity>
          </View>
      
        
        {/* {errorMsg ? (
          <Text style={{ color: "red" }}>{errorMsg}</Text>
        ) : location ? (
          <Text>
            Lat: {location.coords.latitude}, Lon: {location.coords.longitude}
          </Text>
        ) : (
          <Text>Fetching location...</Text>
        )} */}

        {/* <Button title="Refresh Location" onPress={() => setToggle((t) => !t)} /> */}
        
        <Button title={torch ? "Torch On" : "Torch Off"} onPress={() => setTorch(t => !t)} />
        
      </View>
    </>
  );
}
