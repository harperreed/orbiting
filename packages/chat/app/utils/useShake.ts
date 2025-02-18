import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Shake from 'expo-shake';

export function useShake(onShake: () => void) {
  useEffect(() => {
    if (Platform.OS === 'web') {
      return; // Shake detection not supported on web
    }

    const subscription = Shake.addListener(onShake);

    return () => {
      subscription.remove();
    };
  }, [onShake]);
}
