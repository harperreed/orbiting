import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Headline, Paragraph, Subheading, ToggleButton,  RadioButton, Button, Text, Switch, Title, Divider } from 'react-native-paper';
import { StateContext } from '../StateContext';


function Settings() {

  const { theme, setTheme } = React.useContext(StateContext);
  const { darkMode, setDarkMode } = React.useContext(StateContext);
  const { enableHistory, setEnableHistory } = React.useContext(StateContext);
  const { enableShake, setEnableShake } = React.useContext(StateContext);
  const { enableDoubleTap, setEnableDoubleTap } = React.useContext(StateContext);
  


  return (
    <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'flex-start', marginLeft: 10 }}>

      <View style={{ flexDirection: 'row', alignItems: 'stretch', border: 1 }}>
        <Title>General</Title>
      </View>
      


      <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
        <Text>Shake to clear</Text>
        <Switch value={enableShake} onValueChange={setEnableShake} />
      </View>


      <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
        <Text>Double tap to flash</Text>
        <Switch value={enableDoubleTap} onValueChange={setEnableDoubleTap} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'left' }}>
        <Text>Save history </Text>
        <Switch value={enableHistory} onValueChange={setEnableHistory} />
      </View>



     

      <Divider style={{ marginTop: 15, marginBottom: 15 }} />

     

      



      
      <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
        <Title>Theme</Title>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
        <Text>Dark Mode {darkMode}</Text>
        
        <Button mode="contained" disabled={(('light' == darkMode) ? true : false) } onPress={() => setDarkMode('light')}>Light</Button>
        <Button mode="contained" disabled={(('dark' == darkMode) ? true : false) } onPress={() => setDarkMode('dark')}>Dark</Button>
        <Button mode="contained" disabled={(('auto' == darkMode) ? true : false) } onPress={() => setDarkMode('auto')}>Auto</Button>
      </View>




      <Text>{theme}</Text>
      <RadioButton.Group onValueChange={theme => setTheme(theme)} value={theme}>
      <RadioButton.Item value="Standard" >
        <Text>Standard</Text>
      </RadioButton.Item>
      <RadioButton.Item label="Second item" value="High Contrast" />
      <RadioButton.Item label="Second item" value="Bubble Gum" />
      <RadioButton.Item label="Second item" value="Bubble Gum" />
    </RadioButton.Group>



    </View>
  );
}


const settingStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default Settings