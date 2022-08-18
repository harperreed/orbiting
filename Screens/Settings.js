import React from 'react';
import {   View } from 'react-native';
import { Headline, Paragraph, Subheading, TouchableRipple, Button, Text, Switch, Title} from 'react-native-paper';
import { StateContext } from '../StateContext';


function Settings() {

  const { theme, setTheme } = React.useContext(StateContext);
  const { darkMode, setDarkMode } = React.useContext(StateContext);
  const { enableHistory, setEnableHistory } = React.useContext(StateContext);
  const { enableShake, setEnableShake } = React.useContext(StateContext);
  const { enableDoubleTap, setEnableDoubleTap } = React.useContext(StateContext);


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      
      <Headline>General</Headline>
      <Text>{darkMode ? 'Disable' : 'Enable'} dark mode: {darkMode} </Text>
      <Button onPress={() => setDarkMode(!darkMode)}>
        {darkMode ? 'Disable' : 'Enable'}
      </Button>

      <Text>{enableShake ? 'Disable' : 'Enable'}  doubletap to flash: {enableShake} </Text>
      <Button onPress={() => setEnableShake(!enableShake)}>
        {enableShake ? 'Disable' : 'Enable'}
      </Button>

      <Text>{enableDoubleTap ? 'Disable' : 'Enable'}  doubletap to flash: {enableDoubleTap} 
      <Switch value={enableHistory} onValueChange={setEnableHistory} />
       </Text>
      <Button onPress={() => setEnableDoubleTap(!enableDoubleTap)}>
        {enableDoubleTap ? 'Disable' : 'Enable'}
      </Button>
      
      
      

      <Text>{enableHistory ? 'Disable' : 'Enable'} history {enableHistory}</Text>
      <Button onPress={() => setEnableHistory(!enableHistory)}>
        {enableHistory ? 'Disable' : 'Enable'}
      </Button>
      
      <Headline>Theme</Headline>

      <Text>{theme}</Text>
      

      

    </View>
  );
}

export default Settings