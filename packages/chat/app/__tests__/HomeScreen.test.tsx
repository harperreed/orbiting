import { render, screen, fireEvent } from "@testing-library/react-native";
import { GestureDetector } from "react-native-gesture-handler";
import HomeScreen from "../components/HomeScreen";
import { router } from "expo-router";
import ReactNativeHapticFeedback from "react-native-haptic-feedback"; // P997c

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock gesture handler
jest.mock('react-native-gesture-handler', () => ({
  GestureDetector: jest.fn(({ children }) => children),
  Gesture: {
    Fling: () => ({
      direction: () => ({
        onEnd: (callback) => {
          return {
            callback,
            direction: jest.fn(),
          };
        },
      }),
    }),
    Race: (...gestures) => ({
      gestures,
    }),
  },
}));

// Mock ReactNativeHapticFeedback
jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

describe("HomeScreen", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders initial Hello Orbiting! text", () => {
    render(<HomeScreen />);
    const display = screen.getByTestId("big-text-display");
    expect(display.props.value).toBe("Hello Orbiting!");
  });

  it("updates displayed text when edited", () => {
    render(<HomeScreen />);
    const display = screen.getByTestId("big-text-display");
    
    fireEvent.changeText(display, "New Text");
    
    expect(display.props.value).toBe("New Text");
  });

  it("displays text with large font size for short text", () => {
    render(<HomeScreen />);
    const display = screen.getByTestId("big-text-display");
    expect(display.props.style).toEqual(
      expect.objectContaining({
        fontSize: 48
      })
    );
  });

  it("reduces font size for long text", () => {
    render(<HomeScreen />);
    const display = screen.getByTestId("big-text-display");
    
    fireEvent.changeText(display, "This is a very long text that should cause the font size to decrease");
    
    expect(display.props.style.fontSize).toBeLessThan(48);
    expect(display.props.style.fontSize).toBeGreaterThanOrEqual(24);
  });
});

  it('clears text on left swipe gesture', async () => {
    render(<HomeScreen />);
    const display = screen.getByTestId("big-text-display");
    
    // Set some initial text
    fireEvent.changeText(display, "Test Text");
    expect(display.props.value).toBe("Test Text");
    
    // Simulate left swipe by directly calling the gesture callback
    const gestureProps = (GestureDetector as jest.Mock).mock.calls[0][0];
    const leftSwipeCallback = gestureProps.gesture.gestures[0].callback;
    leftSwipeCallback();
    
    expect(display.props.value).toBe("");
    expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith("impactLight"); // P3070
  });

  it('navigates to history on up swipe gesture', () => {
    const { unmount } = render(<HomeScreen />);
    render(<HomeScreen />);
    
    // Simulate up swipe by directly calling the gesture callback
    const gestureProps = (GestureDetector as jest.Mock).mock.calls[0][0];
    const upSwipeCallback = gestureProps.gesture.gestures[1].callback;
    upSwipeCallback();
    
    expect(router.push).toHaveBeenCalledWith('/history');
    expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith("impactLight"); // P3070
    unmount();
  });

  it('cleans up text state on unmount', () => {
    const { unmount } = render(<HomeScreen />);
    const display = screen.getByTestId("big-text-display");
    
    // Set some text
    fireEvent.changeText(display, "Test Text");
    expect(display.props.value).toBe("Test Text");
    
    // Unmount and verify cleanup
    unmount();
    
    // Re-render to verify state is clean
    render(<HomeScreen />);
    const newDisplay = screen.getByTestId("big-text-display");
    expect(newDisplay.props.value).toBe("");
  });
