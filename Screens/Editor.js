import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View, useColorScheme, Platform } from 'react-native';
import { FAB } from 'react-native-paper';
import { useSwipe } from '../hooks/useSwipe'
import { StateContext } from '../StateContext';

function Editor({ navigation }) {

  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themFabStyle = colorScheme === 'light' ? styles.lightThemeFab : styles.darkThemeFab;
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const fabVisible = Platform.OS === 'web' ? true : false;

  const { message, setMessage } = React.useContext(StateContext);
  const { messageHistory, setMessageHistory } = React.useContext(StateContext);

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6)

  function onSwipeLeft() {
    const history = messageHistory;
    history.push(message);
    setMessageHistory(history);
    setMessage('')
    
  }
  function onSwipeRight() {
    console.log("swipe right");
    navigation.navigate('Utility');
  }

  return (
    <View style={[styles.container, themeContainerStyle]} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <TextInput
        style={[styles.editor, themeTextStyle]}
        placeholder="type here"
        placeholderTextColor="gray"

        defaultValue={message}

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

        onChangeText={newMessage => setMessage(newMessage)}
      />
      <StatusBar style="auto" />
      <FAB

        label='🎉'
        style={[styles.fab, themFabStyle]}
        onPress={() => navigation.navigate('Utility')}
        color={themeTextStyle.color}
        visible={fabVisible}
      />
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