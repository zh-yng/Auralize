import * as Location from "expo-location";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

export default function RootLayout() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Ask permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        // Get location
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } catch (err) {
        setErrorMsg("Error getting location");
      }
    })();
  }, [toggle]);

  return (
    <>
      <Stack />
      <View style={{ padding: 16, backgroundColor: "#fff" }}>
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
      </View>
    </>
  );
}
