import { Stack } from "expo-router";
import { useEffect } from "react";
import { LogBox } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    // Suppress specific warnings during tests
    LogBox.ignoreLogs(['Warning: ...']); // Add specific warnings to ignore
  }, []);

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Orbiting",
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="history" 
        options={{ 
          title: "History",
          headerShown: true 
        }} 
      />
    </Stack>
  );
}
