import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeMessage, getMessages } from '../utils/storage';

describe('Storage Utils', () => {
  beforeEach(() => {
    AsyncStorage.clear();
  });

  it('should store and retrieve messages', async () => {
    const testMessage = 'Hello, World!';
    
    await storeMessage(testMessage);
    const messages = await getMessages();
    
    expect(messages).toHaveLength(1);
    expect(messages[0].text).toBe(testMessage);
    expect(messages[0].id).toBeDefined();
    expect(messages[0].timestamp).toBeDefined();
  });

  it('should append new messages to existing ones', async () => {
    await storeMessage('First message');
    await storeMessage('Second message');
    
    const messages = await getMessages();
    
    expect(messages).toHaveLength(2);
    expect(messages[0].text).toBe('First message');
    expect(messages[1].text).toBe('Second message');
  });

  it('should return empty array when no messages exist', async () => {
    const messages = await getMessages();
    expect(messages).toEqual([]);
  });
});
