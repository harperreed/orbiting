

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Headline, Paragraph, Subheading, ToggleButton, RadioButton, Button, Text, Switch, Title, Divider } from 'react-native-paper';
import { StateContext } from '../StateContext';




function History() {

  const { message, setMessage } = React.useContext(StateContext);
  const { messageHistory, setMessageHistory } = React.useContext(StateContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Headline>History Screen2</Headline>
      <Paragraph>{messageHistory}</Paragraph>
      <Text>{message}</Text>
    </View>
  );
}

export default History