
import {   View } from 'react-native';
import { Headline, Paragraph, Subheading, Button, Text, Title} from 'react-native-paper';

function Settings() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      
      <Headline>General</Headline>
      <Text>Enable shake to clear</Text>
      <Text>Enable doubletap to flash</Text>
      <Text>Enable history</Text>
      <Headline>Colors</Headline>
      <Text>Theme 1</Text>
      <Text>Theme 2</Text>
      <Text>Theme 3</Text>
      <Text>Theme 4</Text>

      

    </View>
  );
}

export default Settings