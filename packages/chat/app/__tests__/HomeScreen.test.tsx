import { render, screen } from "@testing-library/react-native";
import HomeScreen from "../components/HomeScreen";

describe("HomeScreen", () => {
  it("renders Hello Orbiting! text", () => {
    render(<HomeScreen />);
    const helloText = screen.getByText("Hello Orbiting!");
    expect(helloText).toBeTruthy();
  });
});
