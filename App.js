// import 'react-native-gesture-handler';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Provider as PaperProvider } from 'react-native-paper';

import CustomNavigationBar from './components/NavBar';
import { MaterialIcons } from "@expo/vector-icons";

// import localizations from './localizations';

// State Context
import { StateContext, StateProvider } from './StateContext';



import EditorScreen from './Screens/Editor'
import HistoryScreen from './Screens/History'
import SettingsScreen from './Screens/Settings'
import HelpScreen from './Screens/Help'
import AboutScreen from './Screens/About'


const UtilityTab = createBottomTabNavigator();

function UtilityStackScreen() {
  return (
    <UtilityTab.Navigator backBehavior='history'  initialRouteName="History" screenOptions={{
      tabBarStyle: { position: 'absolute' },

    }}>
      <UtilityTab.Screen name="History" component={HistoryScreen} options={{
        title: 'History',
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="history" color={color} size={size} />
        ),
      }} />
      <UtilityTab.Screen name="Settings" options={{

        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="settings" color={color} size={size} />
        ),


      }} component={SettingsScreen} />
      <UtilityTab.Screen name="Help" options={{

        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="help" color={color} size={size} />
        ),


      }} component={HelpScreen} />
      <UtilityTab.Screen name="About" options={{

        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="emoji-people" color={color} size={size} />

        ),
      }} component={AboutScreen} />
    </UtilityTab.Navigator>
  );
}



const Stack = createNativeStackNavigator();

function App() {
  return (
    <StateProvider>
      <PaperProvider >
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Editor"
            screenOptions={{
              header: (props) => <CustomNavigationBar {...props} />,
            }}>

            <Stack.Screen name="Editor" component={EditorScreen} options={{ headerShown: false, title: 'Orbiting' }} />
            <Stack.Screen name="Utility" component={UtilityStackScreen} />

          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StateProvider>
  );
}


export default App;