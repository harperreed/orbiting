import { render, fireEvent, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import HistoryScreen from '../history';
import { clearHistory, storeMessage } from '../utils/storage';

// Mock Alert
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Alert: {
    ...jest.requireActual('react-native').Alert,
    alert: jest.fn()
  }
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('HistoryScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('renders empty state correctly', async () => {
    const { queryByText } = render(<HistoryScreen />);
    await act(async () => {});
    
    expect(queryByText('Clear History')).toBeNull();
  });

  it('displays stored messages', async () => {
    const testMessage = 'Test message';
    await storeMessage(testMessage);

    const { getByText } = render(<HistoryScreen />);
    await act(async () => {});

    expect(getByText(testMessage)).toBeTruthy();
  });

  it('clears history when clear button is pressed', async () => {
    await storeMessage('Test message');
    
    const { getByText, queryByText } = render(<HistoryScreen />);
    await act(async () => {});

    const clearButton = getByText('Clear History');
    fireEvent.press(clearButton);
    
    // Find and press the confirmation "Clear" button
    const alertButtons = require('react-native').Alert.alert.mock.calls[0][2];
    const clearAction = alertButtons.find((button: any) => button.text === 'Clear');
    await act(async () => {
      await clearAction.onPress();
    });

    const messages = await AsyncStorage.getItem('@messages');
    expect(messages).toBe(JSON.stringify([]));
  });
});
