// Mock AsyncStorage before imports
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeMessage, getMessages } from '../utils/storage';

describe('Storage Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock implementation for AsyncStorage.getItem to return empty array by default
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));
  });

  it('should store and retrieve messages', async () => {
    const testMessage = 'Hello, World!';
    
    // Mock implementation for this specific test
    let storedData = [];
    AsyncStorage.setItem.mockImplementation((key, value) => {
      storedData = JSON.parse(value);
      return Promise.resolve();
    });
    
    AsyncStorage.getItem.mockImplementation(() => {
      return Promise.resolve(JSON.stringify(storedData));
    });
    
    await storeMessage(testMessage);
    const messages = await getMessages();
    
    expect(messages).toHaveLength(1);
    expect(messages[0].text).toBe(testMessage);
    expect(messages[0].id).toBeDefined();
    expect(messages[0].timestamp).toBeDefined();
  });

  it('should append new messages to existing ones', async () => {
    // Mock implementation for this specific test
    let storedData = [];
    AsyncStorage.setItem.mockImplementation((key, value) => {
      storedData = JSON.parse(value);
      return Promise.resolve();
    });
    
    AsyncStorage.getItem.mockImplementation(() => {
      return Promise.resolve(JSON.stringify(storedData));
    });
    
    await storeMessage('First message');
    await storeMessage('Second message');
    
    const messages = await getMessages();
    
    expect(messages).toHaveLength(2);
    expect(messages[0].text).toBe('First message');
    expect(messages[1].text).toBe('Second message');
  });

  it('should return empty array when no messages exist', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    
    const messages = await getMessages();
    expect(messages).toEqual([]);
  });
});
