import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet,  TextInput, View, useColorScheme } from 'react-native';


function Editor() {

  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const [text, setText] = useState('');
  return (
    <View style={[styles.container, themeContainerStyle]}>
      <TextInput
        style={[styles.editor, themeTextStyle]}
        placeholder="type here"
        placeholderTextColor="gray"

        defaultValue={text}

        autoComplete="off"
        autoCorrect={false}
        autoCapitalize="none"
        spellCheck={false}
        textContentType="none"

        multiline={true}
        numberOfLines={4}
        adjustsFontSizeToFit={true}

        // autoFocus={true}
        // clearTextOnFocus={true}

        onChangeText={newText => setText(newText)}
      />
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  lightThemeText: {
    color: '#242c40',
  },
  darkThemeText: {
    color: '#fff',
  },
  editor: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    height: '100%',
    width: '100%',
    fontSize: 100,
    fontWeight: 'bold',
  }
});


export default Editor