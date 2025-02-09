import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MainScreen from '../../app/screens/MainScreen';
import { saveMessage } from '../../utils/storage';
import { calculateFontSize } from '../../utils/textResizer';

jest.mock('../../utils/storage', () => ({
  saveMessage: jest.fn(),
}));

jest.mock('../../utils/textResizer', () => ({
  calculateFontSize: jest.fn(() => 42),
  getWindowDimensions: () => ({ width: 400, height: 800 }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useLocalSearchParams: () => ({
    message: undefined,
  }),
}));

describe('MainScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads initial message from params', () => {
    jest.spyOn(require('expo-router'), 'useLocalSearchParams').mockReturnValue({
      message: 'Initial message',
    });
    
    const { getByTestId } = render(<MainScreen />);
    const input = getByTestId('message-input');
    expect(input.props.value).toBe('Initial message');
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId } = render(<MainScreen />);
    expect(getByTestId('main-screen')).toBeTruthy();
    expect(getByTestId('message-input')).toBeTruthy();
    expect(getByTestId('save-button')).toBeTruthy();
  });

  it('allows typing a message', () => {
    const { getByTestId } = render(<MainScreen />);
    const input = getByTestId('message-input');
    fireEvent.changeText(input, 'Test message');
    expect(input.props.value).toBe('Test message');
  });

  it('saves message when save button is pressed', async () => {
    const { getByTestId } = render(<MainScreen />);
    const input = getByTestId('message-input');
    const saveButton = getByTestId('save-button');

    fireEvent.changeText(input, 'Test message');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(saveMessage).toHaveBeenCalledWith('Test message');
    });
  });

  it('adjusts font size when typing', () => {
    const { getByTestId } = render(<MainScreen />);
    const input = getByTestId('message-input');
    
    fireEvent.changeText(input, 'Test message');
    expect(calculateFontSize).toHaveBeenCalled();
  });

  it('clears input after saving', async () => {
    const { getByTestId } = render(<MainScreen />);
    const input = getByTestId('message-input');
    const saveButton = getByTestId('save-button');

    fireEvent.changeText(input, 'Test message');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
  });
});
