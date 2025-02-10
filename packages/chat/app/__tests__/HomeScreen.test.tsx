import { render, screen, fireEvent } from "@testing-library/react-native";
import HomeScreen from "../components/HomeScreen";

describe("HomeScreen", () => {
  it("renders initial Hello Orbiting! text", () => {
    render(<HomeScreen />);
    const helloText = screen.getByText("Hello Orbiting!");
    expect(helloText).toBeTruthy();
  });

  it("updates displayed text when input changes", () => {
    render(<HomeScreen />);
    const input = screen.getByTestId("text-input");
    
    fireEvent.changeText(input, "New Text");
    
    const newText = screen.getByText("New Text");
    expect(newText).toBeTruthy();
  });

  it("displays text with large font size for short text", () => {
    const { getByTestId } = render(<HomeScreen />);
    const bigText = getByTestId("big-text-display");
    expect(bigText.props.style).toEqual(
      expect.objectContaining({
        fontSize: 48
      })
    );
  });

  it("reduces font size for long text", () => {
    render(<HomeScreen />);
    const input = screen.getByTestId("text-input");
    
    fireEvent.changeText(input, "This is a very long text that should cause the font size to decrease");
    
    const bigText = screen.getByTestId("big-text-display");
    expect(bigText.props.style.fontSize).toBeLessThan(48);
    expect(bigText.props.style.fontSize).toBeGreaterThanOrEqual(24);
  });
});
