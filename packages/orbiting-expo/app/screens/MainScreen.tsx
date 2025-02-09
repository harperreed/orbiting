import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { saveMessage } from '../../utils/storage';

export default function MainScreen() {
  const [message, setMessage] = useState('');

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
        style={styles.input}
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
