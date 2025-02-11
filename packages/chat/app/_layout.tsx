import { Tabs } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';

export default function RootLayout() {
  // Client-side only rendering
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <View />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {RootLayoutContent()}
    </GestureHandlerRootView>
  );
}

function RootLayoutContent() {
  return (
    <Tabs 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          display: route.name === 'index' ? 'none' : 'flex'
        }
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
