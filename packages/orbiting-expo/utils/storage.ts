import AsyncStorage from '@react-native-async-storage/async-storage';

const MESSAGES_KEY = '@orbiting:messages';

export interface Message {
  id: string;
  text: string;
  timestamp: number;
}

/**
 * Retrieves all stored messages
 * @returns Promise<Message[]> Array of messages, newest first
 */
export async function getMessages(): Promise<Message[]> {
  try {
    const data = await AsyncStorage.getItem(MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
}

/**
 * Saves a new message to storage
 * @param text Message content
 * @returns Promise<Message> The saved message object
 */
export async function saveMessage(text: string): Promise<Message> {
  try {
    const messages = await getMessages();
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: Date.now(),
    };
    
    const updatedMessages = [newMessage, ...messages];
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
    return newMessage;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

/**
 * Clears all messages from storage
 */
export async function clearMessages(): Promise<void> {
  try {
    await AsyncStorage.removeItem(MESSAGES_KEY);
  } catch (error) {
    console.error('Error clearing messages:', error);
    throw error;
  }
}
