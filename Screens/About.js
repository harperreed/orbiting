
import { Image,  View} from 'react-native';

import { Avatar, Card, Headline, Paragraph, Subheading, Button, Text, Title} from 'react-native-paper';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

// import i18n from '../localizations';


function About({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
            <Card>
    <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} />
    <Card.Content>
      <Title>Card title</Title>
      <Paragraph>Card content</Paragraph>
    </Card.Content>
    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
    <Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
  </Card>
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