import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { SafeAreaView, StyleSheet, TextInput, View, Button, useColorScheme, Platform, Dimensions } from 'react-native';

import { useSwipe } from '../hooks/useSwipe'
import { StateContext } from '../StateContext';

function Editor({ navigation }) {
  const colorScheme = useColorScheme();
  const { message, setMessage, messageHistory, setMessageHistory } = useContext(StateContext);
  const [fontSize, setFontSize] = useState(100);
  const [targetFontSize, setTargetFontSize] = useState(100);

  const themeStyles = {
    text: colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText,
    fab: colorScheme === 'light' ? styles.lightThemeFab : styles.darkThemeFab,
    container: colorScheme === 'light' ? styles.lightContainer : styles.darkContainer,
  };
  
  const fabVisible = Platform.OS === 'web' ? true : false;

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6);

  const addToHistory = useCallback((message) => {
    setMessageHistory(prevHistory => [...prevHistory, {
      message,
      date: new Date(),
      id: prevHistory.length + 1,
    }]);
  }, [setMessageHistory]);

  const onSwipeLeft = useCallback(() => {
    addToHistory(message);
    setMessage('');
  }, [message, addToHistory, setMessage]);

  const onSwipeRight = useCallback(() => {
    console.log("swipe right");
    navigation.navigate('Utility');
  }, [navigation]);

// Assume these are the dimensions of your text input area and your smallest font size
const textInputWidth = Dimensions.get('window').width;
const textInputHeight = Dimensions.get('window').height;
const smallestFontSize = 50;  // adjust based on your smallest font size

// Assume these are the dimensions of a character at the smallest font size
const charWidth = smallestFontSize / 2;  // adjust based on your font
const charHeight = smallestFontSize;  // adjust based on your font

// Calculate the maximum number of characters that can fit in the text area
const charsPerLine = Math.floor(textInputWidth / charWidth);
const lines = Math.floor(textInputHeight / charHeight);
const maxChars = charsPerLine * lines;

useEffect(() => {
  if (message.length > maxChars) {
    setFontSize(smallestFontSize);
  } else {
    setFontSize(Math.max(smallestFontSize, Math.min(250, Dimensions.get('window').width / Math.sqrt(message.length))));
  }
}, [message]);
  

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} bounces={false} alwaysBounceVertical={false}>
      <TextInput
        style={[styles.editor, themeStyles.text, { fontSize }]}
        placeholder="type here"
        placeholderTextColor="gray"
        scrollEnabled={false}
        defaultValue={message}
        textBreakStrategy='simple'
        autoComplete="off"
        autoCorrect={false}
        autoCapitalize="none"
        spellCheck={false}
        textContentType="none"
        multiline={true}
        numberOfLines={4}
        adjustsFontSizeToFit={true}
        onChangeText={setMessage}
      />
      <StatusBar style="auto" />
      <Button
        title='🎉'
        style={[styles.fab, themeStyles.fab]}
        onPress={() => navigation.navigate('Utility')}
        color={themeStyles.text.color}
        visible={fabVisible}
      >
        Menu
      </Button>
    </SafeAreaView>
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
  },
  fab: {
    position: 'absolute',
    
    margin: 16,
    right: 0,
    bottom: 0,
  },
  lightThemeFab: {
    color: '#242c40',
    backgroundColor: '#000',
  },
  darkThemeFab: {
    color: '#fff',
    backgroundColor: '#fff',
  },
});


export default Editor