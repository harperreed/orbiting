import { StatusBar } from 'expo-status-bar';
import React, { useState }  from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  const [text, setText] = useState('');
  return (
    <View style={containerStyle.container}>
       <TextInput
        style={editStyle.container}
        placeholder="type here"
        onChangeText={newText => setText(newText)}
        defaultValue={text}
        multiline={true}

      />
      <StatusBar style="auto" />
    </View>
  );
}

const containerStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const editStyle = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    height: '100%',
    width: '100%',
    fontSize: 100,
    fontWeight: 'bold',
  },
});