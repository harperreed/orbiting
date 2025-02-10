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

  it("displays text with large font size", () => {
    render(<HomeScreen />);
    const text = screen.getByText("Hello Orbiting!");
    expect(text).toHaveStyle({
      fontSize: 48
    });
  });
});
