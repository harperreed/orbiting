# 📚 Project README.md

## 💡 Summary of Project

Welcome to the **Chat App**! This application is built using the **Expo** framework for React Native, providing a seamless experience for capturing and managing text inputs in real-time. The app not only allows users to enter and edit text, but it also incorporates features to store messages, load them later, and clear history as needed. The main goal is to create an intuitive and efficient text management tool on mobile devices. 

## 🚀 How to Use

1. **Installation**:
   - First, clone the repository:

2. **Starting the App**:
   - Run the Expo command to start the app:
     ```bash
     npx expo start
     ```
   - After running the command, you will see options to open the app in:
     - **Development build**
     - **Android emulator**
     - **iOS simulator**
     - **Expo Go**, a sandbox for trying out app development with Expo

3. **Using the App**:
   - Type or paste your text in the Home screen.
   - The text will automatically adjust its size to fit the screen.
   - Access your message history and clear it as needed by navigating through the tabs.

4. **Additional Features**:
   - The app supports auto-saving, allowing you to continue where you left off.
   - Text scaling adjusts automatically based on message length.

5. **Explore Settings**: 
   - Go to the settings tab to explore app preferences and configurations.

## 🔧 Tech Info

- **Framework**: Expo (React Native)
- **Testing Library**: Jest, React Testing Library
- **State Management**: Context API
- **Storage**: AsyncStorage for persistent message storage
- **Components**: Built with reusable React components, following best practices for accessibility and responsiveness.
- **Testing**: Includes a suite of tests for components and utilities.
  
For detailed architecture and features, refer to the full directory structure and available components within the app:

```
app/
  ├─ __tests__/
  ├─ components/
  ├─ context/
  ├─ utils/
  ├─ _layout.tsx
  ├─ history.tsx
  ├─ about.tsx
  ├─ help.tsx
  └─ settings.tsx
```

Feel free to contribute! Open issues for bugs or features you'd like to see improved, or submit a pull request with your enhancements! 

Happy coding! 🎉
