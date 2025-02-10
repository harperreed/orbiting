import { render, screen, fireEvent } from "@testing-library/react-native";
import HomeScreen from "../components/HomeScreen";

describe("HomeScreen", () => {
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
    const { getByTestId } = render(<HomeScreen />);
    const display = getByTestId("big-text-display");
    expect(display.props.style).toEqual(
      expect.objectContaining({
        fontSize: 48
      })
    );
  });

  it("reduces font size for long text", () => {
    const { getByTestId } = render(<HomeScreen />);
    const display = screen.getByTestId("big-text-display");
    
    fireEvent.changeText(display, "This is a very long text that should cause the font size to decrease");
    
    expect(display.props.style.fontSize).toBeLessThan(48);
    expect(display.props.style.fontSize).toBeGreaterThanOrEqual(24);
  });
});
