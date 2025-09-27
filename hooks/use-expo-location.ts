import * as Location from "expo-location";
import { useEffect, useState } from "react";

export function useExpoLocation() {
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

    return { location, errorMsg, toggle, setToggle };
}