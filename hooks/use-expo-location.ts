import * as Location from "expo-location";
import { useEffect, useState } from "react";

export function useExpoLocation() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [initialLocation, setInitialLocation] = useState<Location.LocationObject | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
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
                    if (!initialLocation) {
                        setInitialLocation(loc);
                    }
                } catch (err) {
                    setErrorMsg("Error getting location");
                }
            })();
        }, 1000); // Update location every 1 second

        // Cleanup function to clear the interval
        return () => clearInterval(interval);
    }, []);

    return { location, initialLocation, errorMsg };
}