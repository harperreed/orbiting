import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeSelector } from '../settings'; // We'll need to export this component
import { SettingsProvider } from '../context/SettingsContext';
import { THEMES } from '../themes';

// Mock the AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Wrap component with necessary providers
const renderWithProviders = (ui, options = {}) => {
  return render(
    <SettingsProvider>
      {ui}
    </SettingsProvider>,
    options
  );
};

describe('ThemeSelector', () => {
  it('displays correct theme preview', () => {
    const onSelect = jest.fn();
    const { getByText } = renderWithProviders(
      <ThemeSelector theme="classic" onSelect={onSelect} />
    );
    
    // Find the current theme label
    const classicTheme = THEMES.find(t => t.value === 'classic');
    expect(getByText(classicTheme.label)).toBeTruthy();
  });

  it('opens theme selection modal when clicked', async () => {
    const onSelect = jest.fn();
    const { getByText, queryByText } = renderWithProviders(
      <ThemeSelector theme="classic" onSelect={onSelect} />
    );
    
    // Initially modal content should not be visible
    const oceanTheme = THEMES.find(t => t.value === 'ocean');
    expect(queryByText(oceanTheme.label)).toBeNull();
    
    // Click on the theme preview to open modal
    const classicTheme = THEMES.find(t => t.value === 'classic');
    fireEvent.press(getByText(classicTheme.label));
    
    // Now all theme options should be visible
    await waitFor(() => {
      expect(queryByText(oceanTheme.label)).toBeTruthy();
    });
  });

  it('updates theme when selection made', async () => {
    const onSelect = jest.fn();
    const { getByText } = renderWithProviders(
      <ThemeSelector theme="classic" onSelect={onSelect} />
    );
    
    // Open the modal
    const classicTheme = THEMES.find(t => t.value === 'classic');
    fireEvent.press(getByText(classicTheme.label));
    
    // Select a different theme
    const oceanTheme = THEMES.find(t => t.value === 'ocean');
    await waitFor(() => {
      fireEvent.press(getByText(oceanTheme.label));
    });
    
    // Check if onSelect was called with the correct theme
    expect(onSelect).toHaveBeenCalledWith('ocean');
  });

  it('persists theme selection', async () => {
    // This test requires integration with the SettingsContext
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    const { getByText, getByTestId } = render(
      <SettingsProvider>
        <ThemeSelector 
          theme="classic" 
          onSelect={(theme) => {
            // We'll use a test ID to verify the theme was updated
            return <div data-testid="updated-theme">{theme}</div>;
          }} 
        />
      </SettingsProvider>
    );
    
    // Open the modal
    const classicTheme = THEMES.find(t => t.value === 'classic');
    fireEvent.press(getByText(classicTheme.label));
    
    // Select a different theme
    const oceanTheme = THEMES.find(t => t.value === 'ocean');
    await waitFor(() => {
      fireEvent.press(getByText(oceanTheme.label));
    });
    
    // Verify AsyncStorage was called to persist the setting
    expect(AsyncStorage.setItem).toHaveBeenCalled();
    
    // Check if the component updated with the new theme
    await waitFor(() => {
      expect(getByTestId('updated-theme').props.children).toBe('ocean');
    });
  });
});
