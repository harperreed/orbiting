
import { Image,  View} from 'react-native';

import { Headline, Paragraph, Subheading, Button, Text, Title} from 'react-native-paper';


// import i18n from '../localizations';


function About({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Headline>About Orbiting</Headline>
      <Subheading>a christine sun kim and harper reed collaboration</Subheading>
   
      <Title>Timeline</Title>
      <Paragraph>originally built in berlin, 2018 by ck, harper, and nick ng. </Paragraph>
      
      <Button
         icon="camera" mode="contained"
        onPress={() => navigation.navigate('Editor')}
      >Go to editor</Button>
       <Button
         icon="camera" mode="contained"
        onPress={() => navigation.navigate('Help')}
      >Go to Help</Button>
    </View>
  );
}

export default About