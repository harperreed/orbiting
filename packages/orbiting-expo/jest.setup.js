import '@testing-library/jest-native/extend-expect';

// Mock expo-router
jest.mock('expo-router', () => ({
  Stack: () => 'Stack',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
