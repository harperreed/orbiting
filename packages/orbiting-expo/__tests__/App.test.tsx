import { render, screen } from '@testing-library/react-native';
import Index from '../app/index';

describe('Index Screen', () => {
  it('renders the welcome message', () => {
    render(<Index />);
    const welcomeText = screen.getByTestId('welcome-text');
    expect(welcomeText).toBeTruthy();
    expect(welcomeText.props.children).toBe('Edit app/index.tsx to edit this screen.');
  });

  it('renders the main container with correct styling', () => {
    render(<Index />);
    const container = screen.getByTestId('main-container');
    expect(container).toBeTruthy();
    expect(container.props.style).toEqual({
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    });
  });
});
