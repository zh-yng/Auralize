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
    const { location, errorMsg } = useExpoLocation();

    const k1 = 0.1;
    const k2 = 0.1;
    const omega = 2 * Math.PI / 1000; // one full cycle every 1000 ms

    useEffect(() => {
        const interval = setInterval(() => {
          if (location != null) {
            switch (props.aura) {
                case 'ripple':
                    const sineValue = Math.sin(k1 * location.coords.longitude + k2 * location.coords.latitude - omega * (Date.now()));
                    setTorch(sineValue > 0);
                    break;
                default:
                    setTorch(false);
                    break;
                // case 'heart':
                //     const heartValue = Math.pow(Math.sin((k1 * location.coords.longitude + k2 * location.coords.latitude - omega * (Date.now()))), 3);
                //     setTorch(heartValue > 0);
                //     break; 
            }
            console.log(props.aura);
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