# Orbiting iOS

Ultra-legible nearby messaging for iOS.

## Features

- **Big Text Canvas**: Auto-sizing text that maximizes legibility
- **Message History**: Save, search, and favorite messages
- **Themes**: 9 color themes with light/dark variants
- **Gestures**: Swipe to clear or navigate, shake for actions
- **Accessibility**: High contrast, VoiceOver support, Dynamic Type

## Requirements

- iOS 17.0+
- Xcode 15.0+

## Architecture

- **UI**: SwiftUI with MVVM pattern
- **State**: Observation framework (@Observable)
- **Storage**: SwiftData for local persistence
- **Motion**: CoreMotion for shake detection

## Building

1. Open `Orbiting.xcodeproj` in Xcode
2. Select target device (iOS 17+)
3. Build and run (Cmd+R)

## Testing

Run all tests: Cmd+U

- Unit tests for models, utilities, and search
- UI tests for user flows and interactions
- Performance tests for font fitting (<16ms target)

## Project Structure

```
Orbiting/
├── Models/
│   ├── Message.swift          # SwiftData message model
│   ├── AppSettings.swift      # User preferences
│   └── Theme.swift            # Color theme system
├── Views/
│   ├── HomeView.swift         # Main canvas
│   ├── HistoryView.swift      # Message history
│   ├── SettingsView.swift     # Preferences
│   ├── HelpView.swift         # Documentation
│   └── AboutView.swift        # App info
├── Utilities/
│   ├── TextFitter.swift       # Font size calculator
│   ├── ShakeDetector.swift    # Motion detection
│   └── KeyboardObserver.swift # Keyboard tracking
└── OrbitingApp.swift          # App entry point
```

## License

[Your License Here]

## Credits

Built with SwiftUI and SwiftData
