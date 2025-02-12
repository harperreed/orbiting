import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import HomeScreen from '../components/HomeScreen';
import BottomBar from '../components/BottomBar';
import TabBar from '../components/TabBar';
import BigTextDisplay from '../components/BigTextDisplay';

describe('Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('BigTextDisplay', () => {
    it('has proper accessibility props', () => {
      const { getByTestId } = render(
        <BigTextDisplay text="" onChangeText={() => {}} />
      );
      const input = getByTestId('big-text-display');
      expect(input.props.accessibilityLabel).toBe('Main text input');
      expect(input.props.accessibilityRole).toBe('textbox');
    });
  });

  describe('BottomBar', () => {
    it('has accessible buttons', () => {
      const { getByTestId } = render(
        <BottomBar onClearPress={() => {}} onHistoryPress={() => {}} />
      );
      const clearButton = getByTestId('clear-button');
      const historyButton = getByTestId('history-button');
      
      expect(clearButton.props.accessibilityLabel).toBe('Clear text');
      expect(historyButton.props.accessibilityLabel).toBe('Show history');
    });
  });

  describe('TabBar', () => {
    it('has accessible navigation', () => {
      const { getByA11yLabel } = render(<TabBar />);
      const nav = getByA11yLabel('Main navigation');
      expect(nav).toBeTruthy();
    });
  });

  describe('Screen reader announcements', () => {
    it('announces errors', () => {
      const mockAnnounce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
      const { rerender } = render(<HomeScreen />);
      
      // Simulate an error
      rerender(<HomeScreen error="Test error" />);
      
      expect(mockAnnounce).toHaveBeenCalledWith('Test error');
    });
  });
});
