import AsyncStorage from '@react-native-async-storage/async-storage';

const MESSAGES_KEY = '@messages';

export interface StoredMessage {
  id: string;
  text: string;
  timestamp: number;
}

export async function storeMessage(text: string): Promise<void> {
  try {
    const messages = await getMessages();
    const newMessage: StoredMessage = {
      id: Date.now().toString(),
      text,
      timestamp: Date.now(),
    };
    
    messages.push(newMessage);
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error storing message:', error);
    throw error;
  }
}

export async function getMessages(): Promise<StoredMessage[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(MESSAGES_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
}
