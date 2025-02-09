import React from 'react';
import { render } from '@testing-library/react-native';
import MainScreen from '../../app/screens/MainScreen';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('MainScreen', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<MainScreen />);
    expect(getByTestId('main-screen')).toBeTruthy();
  });
});
