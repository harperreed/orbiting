import { View, StyleSheet, TextInput, Button, Text } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { saveMessage } from '../../utils/storage';
import { calculateFontSize, getWindowDimensions } from '../../utils/textResizer';

export default function MainScreen() {
  const { message: initialMessage } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [fontSize, setFontSize] = useState(72); // Start with max font size
  const { width: windowWidth, height: windowHeight } = getWindowDimensions();

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  const measureText = useCallback((text: string, size: number) => {
    // Approximate text dimensions based on character count and font size
    const avgCharWidth = size * 0.6; // Approximate width per character
    const width = text.length * avgCharWidth;
    const height = size * 1.2; // Approximate line height
    return { width, height };
  }, []);

  const updateFontSize = useCallback((text: string) => {
    const newSize = calculateFontSize(
      text,
      windowWidth,
      windowHeight,
      measureText
    );
    setFontSize(newSize);
  }, [windowWidth, windowHeight, measureText]);

  useEffect(() => {
    updateFontSize(message);
  }, [message, updateFontSize]);

  const handleSave = async () => {
    if (message.trim()) {
      try {
        await saveMessage(message);
        setMessage(''); // Clear input after saving
      } catch (error) {
        console.error('Error saving message:', error);
      }
    }
  };

  return (
    <View testID="main-screen" style={styles.container}>
      <TextInput
        testID="message-input"
        style={[styles.input, { fontSize }]}
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message"
        multiline
      />
      <Button
        testID="save-button"
        title="Save Message"
        onPress={handleSave}
        disabled={!message.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
});
