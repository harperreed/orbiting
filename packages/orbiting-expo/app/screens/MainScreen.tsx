import { View, StyleSheet, TextInput, TouchableOpacity, Text, SafeAreaView, Platform } from 'react-native';
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
    <SafeAreaView testID="main-screen" style={styles.container}>
      <View style={styles.content}>
        <TextInput
          testID="message-input"
          style={[styles.input, { fontSize }]}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message"
          multiline
        />
      </View>
      <View style={styles.navbar}>
        <TouchableOpacity
          testID="save-button"
          style={[
            styles.navButton,
            !message.trim() && styles.navButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!message.trim()}
        >
          <Text style={styles.navButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="clear-button"
          style={styles.navButton}
          onPress={() => setMessage('')}
        >
          <Text style={styles.navButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    marginBottom: Platform.OS === 'ios' ? 80 : 70, // Add space for navbar
  },
  input: {
    width: '100%',
    height: '100%',
    padding: 10,
    textAlignVertical: 'top',
  },
  navbar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  navButtonDisabled: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
