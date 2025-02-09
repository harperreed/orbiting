import React from 'react';
import { render } from '@testing-library/react-native';
import HistoryScreen from '../../app/screens/HistoryScreen';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('HistoryScreen', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<HistoryScreen />);
    expect(getByTestId('history-screen')).toBeTruthy();
  });
});
