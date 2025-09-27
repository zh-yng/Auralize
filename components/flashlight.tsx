import { useExpoCamera } from '@/hooks/use-expo-camera';
import { useExpoLocation } from '@/hooks/use-expo-location';
import { CameraView } from 'expo-camera';
import { useEffect } from 'react';
import { Button, Text, View } from 'react-native';

type FlashlightProps = {
  aura: string;
};

const Flashlight = (props: FlashlightProps) => {
    const { facing, torch, setTorch, permission, requestPermission } = useExpoCamera();
    const { location, initialLocation, errorMsg } = useExpoLocation();

    const k1 = 0.1;
    const k2 = 0.1;
    const omega = 2 * Math.PI / 1000; // one full cycle every 1000 ms

    useEffect(() => {
        const interval = setInterval(() => {
          if (location != null && initialLocation != null) {
            switch (props.aura) {
                case 'ripple':
                    const sineValue = Math.sin(k1 * location.coords.longitude + k2 * location.coords.latitude - omega * (Date.now()));
                    setTorch(sineValue > 0);
                    break;
                case 'twinkle':
                    const randomValue = Math.random();
                    setTorch(randomValue > 0.8);
                    break;
                // create the heart case with 2d heart function that does not move and shows light above 0.5
                case 'heart':
                    const heartValue = Math.pow(k1*Math.pow(initialLocation.coords.longitude, 2) + Math.pow(k2 * initialLocation.coords.latitude, 2) - 1, 3) - Math.pow(k1 * initialLocation.coords.longitude, 2) * Math.pow(k2* initialLocation.coords.latitude, 3);
                    setTorch(heartValue > 0.5);
                    break;
                case 'shine':
                    setTorch(true);
                    break;
                default:
                    setTorch(false);
                    break;
            }
          }
        }, 200);
    
        return () => clearInterval(interval);
      }, [props.aura, location]);
    
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

    return ( <CameraView facing={facing} enableTorch={torch} /> );
}
 
export default Flashlight;