import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MainScreen from '../../app/screens/MainScreen';
import { saveMessage } from '../../utils/storage';

jest.mock('../../utils/storage', () => ({
  saveMessage: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('MainScreen', () => {
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
