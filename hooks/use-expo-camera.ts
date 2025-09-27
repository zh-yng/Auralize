import { CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from "react";

export function useExpoCamera() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [torch, setTorch] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    return { facing, setFacing, torch, setTorch, permission, requestPermission };
}

// function toggleCameraFacing() {
//     setFacing(current => (current === 'back' ? 'front' : 'back'));
// }