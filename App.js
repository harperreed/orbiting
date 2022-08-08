import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text,  TextInput, View, useColorScheme } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EditorScreen from './Screens/Editor'
import HistoryScreen from './Screens/History'
import SettingsScreen from './Screens/Settings'
import HelpScreen from './Screens/Help'
import AboutScreen from './Screens/About'

const Stack = createNativeStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator  initialRouteName="Editor" >
        <Stack.Screen name="Editor" component={EditorScreen} options={{ headerShown: false  }}/>
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;