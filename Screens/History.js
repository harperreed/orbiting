

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { StateContext } from '../StateContext';



function History() {

  const { message, setMessage } = React.useContext(StateContext);
  const { messageHistory, setMessageHistory } = React.useContext(StateContext);

  return (
    <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'flex-start', marginLeft: 10 }}>
      <Text>History Screen</Text>
      {/* <Paragraph>{messageHistory}</Paragraph> */}
      <Text>{message}</Text>
      {/* <DataTable>
      <DataTable.Header>
        <DataTable.Title>Message</DataTable.Title>

      </DataTable.Header>
      {messageHistory.map(r => (
      <DataTable.Row>
       <DataTable.Cell numeric>{r.message}</DataTable.Cell>


     </DataTable.Row>
      ))}
    </DataTable> */}
    </View>
  );
}

export default History