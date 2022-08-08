// import 'react-native-gesture-handler';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import localizations from './localizations';


import EditorScreen from './Screens/Editor'
import HistoryScreen from './Screens/History'
import SettingsScreen from './Screens/Settings'
import HelpScreen from './Screens/Help'
import AboutScreen from './Screens/About'

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator  initialRouteName="About" >
        <Stack.Screen name="Editor" component={EditorScreen} options={{ headerShown: false, title:'Orbiting' }}/>
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;