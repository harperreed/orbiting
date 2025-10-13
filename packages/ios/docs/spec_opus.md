# Orbiting App Technical Specification

## 1. Executive Summary

Orbiting is a cross-platform messaging application designed for visual communication, allowing users to display text messages in large, auto-scaling format. The app serves users who need to communicate visually in shared spaces, particularly those with different communication needs.

## 2. Product Overview

### 2.1 Purpose

A simple, accessible text display application that automatically scales text to maximize visibility, enabling clear visual communication between people in the same physical space.

### 2.2 Target Platforms

- **Web**: Progressive Web App (PWA)
- **iOS**: Native app via Expo
- **Android**: Native app via Expo
- **Desktop**: Web browser support

### 2.3 Technology Stack

- **Framework**: React Native with Expo
- **UI Library**: React Native Paper (Material Design)
- **Routing**: Expo Router
- **State Management**: React Context API with useReducer
- **Storage**: AsyncStorage
- **Internationalization**: i18next
- **Testing**: Jest with React Testing Library
- **Build Tools**: Expo, Workbox (PWA)

## 3. Functional Requirements

### 3.1 Core Features

#### 3.1.1 Text Display

- **Auto-scaling text**: Dynamically adjusts font size based on content length and viewport
- **Real-time editing**: Immediate visual feedback as user types
- **Placeholder text**: "Type here" in user's selected language
- **Font size range**: Configurable starting size (16-40px), scales down to minimum 1vh
- **Text wrapping**: Automatic word wrapping at whitespace
- **Keyboard handling**: Responsive layout adjustment for virtual keyboards

#### 3.1.2 Message Management

- **Auto-save**: Debounced saving after 1 second of inactivity
- **History storage**: Persistent message history with timestamps
- **Favorites**: Star/unstar messages for quick access
- **Search**: Full-text search across message history
- **Pagination**: Load 20 messages at a time with infinite scroll
- **Deletion**: Individual message deletion with confirmation
- **Clear all**: Bulk delete with confirmation dialog

#### 3.1.3 User Interface

- **Navigation**: Tab-based navigation (Home, History, Help, Settings, About)
- **Themes**: 9 pre-defined color themes (Mono, Classic, Ocean, Forest, Sunset, Neon, Contrast, Candy, Mint)
- **Color schemes**: Light, Dark, and System-follow modes
- **Language support**: 12 languages with RTL support consideration
- **Accessibility**: Screen reader support, keyboard navigation, ARIA labels

### 3.2 Gesture Controls

- **Swipe Left**: Clear current text
- **Swipe Right**: Navigate to history
- **Swipe Up**: Navigate to history
- **Shake Device**: Configurable action (none/clear text/flash screen)

### 3.3 Progressive Web App Features

- **Offline support**: Service Worker for offline functionality
- **Installation**: Add to homescreen capability
- **Manifest**: Web app manifest with icons and metadata
- **Browser detection**: Custom install guides for Safari, Firefox, Chrome

## 4. Non-Functional Requirements

### 4.1 Performance

- **Text scaling**: < 150ms response time for font size calculations
- **Debouncing**: 150ms for text input, 1000ms for auto-save
- **List rendering**: Virtualized lists using FlashList
- **Memory management**: Cleanup of timers and event listeners
- **Pagination**: 20 items per page for history

### 4.2 Reliability

- **Error boundaries**: Graceful error handling with recovery options
- **State persistence**: Settings and messages survive app restarts
- **Data validation**: Input sanitization and boundary checks
- **Fallback behavior**: Default values for missing configuration

### 4.3 Security

- **Storage**: Local-only data storage (no cloud sync)
- **Input validation**: XSS prevention through React's built-in escaping
- **No authentication**: Privacy through local-only storage

### 4.4 Usability

- **Onboarding**: First-time user welcome modal
- **Help documentation**: In-app help screen with usage instructions
- **Responsive design**: Adapts to screen sizes from mobile to desktop
- **Instant feedback**: Real-time text scaling and visual updates

## 5. Data Models

### 5.1 StoredMessage

```typescript
interface StoredMessage {
    id: string; // Timestamp-based unique ID
    text: string; // Message content
    timestamp: number; // Unix timestamp
    isFavorite?: boolean; // Favorite status
}
```

### 5.2 Settings

```typescript
interface Settings {
    colorScheme: "light" | "dark" | "system";
    startingFontSize: number; // 16-40px
    theme: ThemeType;
    shakeMode: "clear" | "flash" | "none";
    isInstalled?: boolean;
}
```

### 5.3 TextState

```typescript
interface TextState {
    text: string;
    lastSaved: number | null;
    isDirty: boolean;
    error: string | null;
    isLoading: boolean;
}
```

## 6. User Interface Specifications

### 6.1 Screen Layouts

#### Home Screen

- Full-screen text input area
- Bottom bar (desktop only): Clear and History buttons
- Gesture-responsive surface
- Keyboard-aware layout

#### History Screen

- Header with title
- Segmented control: All Messages | Favorites
- Search bar
- Scrollable message list
- Clear all button at bottom

#### Settings Screen

- Language selector dropdown
- Appearance section: Color scheme, font size slider, theme selector
- Gestures section: Shake action configuration
- Reset to defaults button

#### Help Screen

- Welcome section with app description
- Quick start guide with gesture instructions
- Features list
- Pro tips section
- About section with author credits

### 6.2 Theme System

Each theme includes:

- Primary and secondary colors
- Surface and background colors
- Text colors for various contexts
- Elevation shadows (5 levels)
- Custom tab bar colors

## 7. API Specifications

### 7.1 Storage APIs

- `storeMessage(text: string): Promise<void>`
- `getMessages(options): Promise<{messages, nextCursor}>`
- `clearHistory(): Promise<void>`
- `deleteMessage(id: string): Promise<void>`
- `toggleFavorite(id: string): Promise<void>`

### 7.2 Settings APIs

- `loadSettings(): Promise<Settings>`
- `saveSettings(settings: Settings): Promise<void>`
- `loadLanguage(): Promise<LanguageCode>`
- `saveLanguage(language: LanguageCode): Promise<void>`

## 8. Testing Requirements

### 8.1 Unit Tests

- Component rendering tests
- Storage utility tests
- Text reducer logic tests
- Accessibility compliance tests

### 8.2 Coverage Targets

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## 9. Deployment Configuration

### 9.1 Web Deployment

- Firebase Hosting configuration
- Netlify deployment settings
- Cloudflare Workers support
- Service Worker generation via Workbox

### 9.2 Native Apps

- iOS: Bundle identifier `com.harperrules.orbiting`
- Android: Package name `com.harperrules.orbiting`
- App Store assets and metadata

## 10. Internationalization

### 10.1 Supported Languages

- English (en)
- German (de)
- Portuguese (pt)
- Spanish (es)
- French (fr)
- Hindi (hi)
- Bengali (bn)
- Indonesian (id)
- Simplified Chinese (zh)
- Traditional Chinese (zh_TW)
- Korean (ko)
- Japanese (ja)

### 10.2 Translation Keys

Organized by namespace (common) with sections for:

- Navigation labels
- UI actions
- Settings descriptions
- Help content
- Error messages

## 11. Accessibility Requirements

- WCAG 2.1 Level AA compliance
- Screen reader announcements for state changes
- Keyboard navigation support
- High contrast theme option
- Meaningful ARIA labels and roles
- Focus management for modals and navigation

## 12. Future Considerations

- Cloud synchronization
- User accounts and authentication
- Real-time collaboration features
- Drawing/handwriting support
- Video message capabilities
- Group chat functionality

This specification provides a comprehensive blueprint for the Orbiting application's current implementation and serves as a reference for maintenance and future development.
