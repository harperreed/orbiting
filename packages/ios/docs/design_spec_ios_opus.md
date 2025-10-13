# Native iOS Implementation Specification for Orbiting

## 1. Development Environment & Requirements

### 1.1 Technical Requirements
- **Minimum iOS Version**: iOS 15.0+
- **Development Tools**: Xcode 15+
- **Language**: Swift 5.9+
- **UI Framework**: SwiftUI
- **Architecture**: MVVM with Combine

### 1.2 Project Structure
```
Orbiting/
├── OrbitingApp.swift
├── Models/
│   ├── Message.swift
│   ├── Settings.swift
│   └── Theme.swift
├── Views/
│   ├── HomeView.swift
│   ├── HistoryView.swift
│   ├── SettingsView.swift
│   ├── HelpView.swift
│   └── AboutView.swift
├── ViewModels/
│   ├── TextViewModel.swift
│   ├── HistoryViewModel.swift
│   └── SettingsViewModel.swift
├── Services/
│   ├── StorageService.swift
│   ├── ThemeService.swift
│   └── LocalizationService.swift
├── Components/
│   ├── AutoScalingTextView.swift
│   ├── MessageRow.swift
│   └── ThemePicker.swift
├── Resources/
│   ├── Localizable.strings
│   └── Assets.xcassets
└── Extensions/
    ├── Color+Theme.swift
    └── View+Gestures.swift
```

## 2. Core Components Implementation

### 2.1 Data Models

```swift
// Message.swift
struct Message: Identifiable, Codable {
    let id: String = UUID().uuidString
    let text: String
    let timestamp: Date
    var isFavorite: Bool = false
}

// Settings.swift
struct Settings: Codable {
    var colorScheme: ColorScheme = .system
    var startingFontSize: CGFloat = 24
    var theme: ThemeType = .mono
    var shakeAction: ShakeAction = .none
    var preferredLanguage: String = "en"
    
    enum ColorScheme: String, Codable, CaseIterable {
        case light, dark, system
    }
    
    enum ShakeAction: String, Codable, CaseIterable {
        case none, clear, flash
    }
}

// Theme.swift
struct Theme {
    let primary: Color
    let secondary: Color
    let background: Color
    let surface: Color
    // Additional color properties
}
```

### 2.2 Key Views

```swift
// HomeView.swift - Main text display
struct HomeView: View {
    @StateObject private var viewModel = TextViewModel()
    @State private var fontSize: CGFloat = 48
    @FocusState private var isTextFieldFocused: Bool
    
    var body: some View {
        GeometryReader { geometry in
            AutoScalingTextEditor(
                text: $viewModel.text,
                fontSize: $fontSize,
                containerSize: geometry.size
            )
        }
        .gesture(swipeGestures)
        .onShake {
            handleShakeAction()
        }
    }
}

// Custom auto-scaling text component
struct AutoScalingTextEditor: UIViewRepresentable {
    @Binding var text: String
    @Binding var fontSize: CGFloat
    let containerSize: CGSize
    
    func makeUIView(context: Context) -> UITextView
    func updateUIView(_ uiView: UITextView, context: Context)
}
```

### 2.3 Storage Layer

```swift
// StorageService.swift
actor StorageService {
    private let userDefaults = UserDefaults.standard
    private let documentsDirectory = FileManager.default.urls(
        for: .documentDirectory,
        in: .userDomainMask
    ).first!
    
    func saveMessage(_ message: Message) async throws
    func loadMessages(limit: Int, offset: Int) async throws -> [Message]
    func deleteMessage(id: String) async throws
    func clearAllMessages() async throws
    func toggleFavorite(id: String) async throws
}
```

## 3. iOS-Specific Features

### 3.1 Gesture Recognition
```swift
extension View {
    func onSwipeLeft(perform: @escaping () -> Void) -> some View
    func onSwipeRight(perform: @escaping () -> Void) -> some View
    func onSwipeUp(perform: @escaping () -> Void) -> some View
    func onShake(perform: @escaping () -> Void) -> some View
}
```

### 3.2 Haptic Feedback
```swift
class HapticManager {
    static let shared = HapticManager()
    
    func impact(_ style: UIImpactFeedbackGenerator.FeedbackStyle)
    func notification(_ type: UINotificationFeedbackGenerator.FeedbackType)
    func selection()
}
```

### 3.3 Dynamic Type Support
```swift
struct DynamicTypeModifier: ViewModifier {
    @Environment(\.sizeCategory) var sizeCategory
    
    func body(content: Content) -> some View {
        content
            .dynamicTypeSize(...DynamicTypeSize.xxxLarge)
    }
}
```

## 4. Platform Integration

### 4.1 App Configuration
```swift
// Info.plist additions
- UISupportsDocumentBrowser: NO
- UIApplicationSceneManifest configuration
- Privacy descriptions (if needed)
- Supported interface orientations
- App Transport Security settings
```

### 4.2 App Icons & Launch Screen
- App Icon sizes: 20pt, 29pt, 40pt, 60pt (@2x and @3x)
- Launch storyboard or Launch screen configuration
- Dark mode variants

### 4.3 Localization
```swift
// Localizable.strings structure
"home.placeholder" = "Type here";
"history.title" = "History";
"settings.title" = "Settings";
// ... etc for all 12 languages
```

## 5. ViewModels

### 5.1 TextViewModel
```swift
@MainActor
class TextViewModel: ObservableObject {
    @Published var text: String = ""
    @Published var isAutoSaving: Bool = false
    
    private let storageService = StorageService()
    private var autoSaveTimer: Timer?
    
    func handleTextChange(_ newText: String)
    func clearText()
    func saveMessage() async
}
```

### 5.2 HistoryViewModel
```swift
@MainActor
class HistoryViewModel: ObservableObject {
    @Published var messages: [Message] = []
    @Published var filteredMessages: [Message] = []
    @Published var searchText: String = ""
    @Published var showingFavoritesOnly: Bool = false
    @Published var isLoading: Bool = false
    
    func loadMessages() async
    func deleteMessage(_ message: Message) async
    func toggleFavorite(_ message: Message) async
    func clearHistory() async
}
```

## 6. Navigation Structure

```swift
struct ContentView: View {
    @StateObject private var settingsManager = SettingsManager()
    
    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Label("Home", systemImage: "house")
                }
            
            HistoryView()
                .tabItem {
                    Label("History", systemImage: "clock")
                }
            
            HelpView()
                .tabItem {
                    Label("Help", systemImage: "questionmark.circle")
                }
            
            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gear")
                }
            
            AboutView()
                .tabItem {
                    Label("About", systemImage: "info.circle")
                }
        }
        .environmentObject(settingsManager)
    }
}
```

## 7. Key iOS Advantages Over React Native

### 7.1 Performance Improvements
- Native text rendering (no bridge overhead)
- Direct CoreAnimation access for smoother animations
- Better memory management with ARC
- Native gesture recognizers

### 7.2 Platform Features
- iCloud sync capability (future)
- Widgets support
- Shortcuts app integration
- Share Extension
- Handoff between devices
- Focus modes integration

### 7.3 UI/UX Enhancements
- Native iOS transitions
- SF Symbols throughout
- System haptics
- Pull-to-refresh native implementation
- Native context menus

## 8. Third-Party Dependencies (Minimal)

```swift
// Package.swift
dependencies: [
    // Only if needed for specific features
    .package(url: "https://github.com/SwiftUIX/SwiftUIX", from: "0.1.0"),
]
```

## 9. Testing Structure

```swift
// Unit Tests
OrbitingTests/
├── Models/
├── ViewModels/
└── Services/

// UI Tests
OrbitingUITests/
├── HomeViewTests.swift
├── HistoryViewTests.swift
└── SettingsViewTests.swift
```

## 10. Build & Deployment

### 10.1 Build Configurations
- Debug: Development build with logs
- Release: Production build, optimized
- TestFlight: Beta testing configuration

### 10.2 App Store Requirements
- App Store Connect configuration
- Screenshots for all device sizes
- App description in all supported languages
- Privacy policy URL
- Age rating: 4+

## 11. Migration Strategy from React Native

### 11.1 Data Migration
- Export/import existing AsyncStorage data
- Convert to Core Data or JSON files
- Preserve message history and settings

### 11.2 Feature Parity Checklist
- [ ] Auto-scaling text
- [ ] Message history with search
- [ ] Favorites system
- [ ] 12 language support
- [ ] 9 themes
- [ ] Gesture controls
- [ ] Settings persistence
- [ ] Welcome onboarding

## 12. Estimated Development Timeline

### Phase 1 (2 weeks): Core Functionality
- Basic project setup
- Home screen with auto-scaling text
- Data models and storage

### Phase 2 (2 weeks): Features
- History view with search
- Settings implementation
- Theme system

### Phase 3 (1 week): Polish
- Animations and transitions
- Haptic feedback
- Accessibility

### Phase 4 (1 week): Testing & Deployment
- Unit and UI tests
- Beta testing via TestFlight
- App Store submission

This native iOS implementation would provide better performance, deeper system integration, and a more "iOS-native" feel while maintaining all the core functionality of the current React Native version.
