import "@testing-library/jest-native/extend-expect";

// Mock react-native-shake
jest.mock('react-native-shake', () => ({
  addListener: jest.fn(() => ({ remove: jest.fn() })),
}));
