# App Clip Technical Specification for Orbiting iOS

## Executive Summary

Orbiting is an ideal candidate for App Clip support due to its simple, focused use case (quick visual messaging), minimal dependencies, and small binary size. The app can be delivered as an App Clip with **zero feature cuts** since all current features are App Clip compatible.

---

## 1. App Clip Size Analysis

### Current App Size Estimate
Based on the implementation:
- SwiftUI views: ~50 KB
- SwiftData models: ~10 KB
- Utilities (TextFitter, ShakeDetector, KeyboardObserver): ~20 KB
- Assets (excluding app icon): ~100 KB
- Compiled binary overhead: ~2-3 MB
- **Estimated total: 3-4 MB uncompressed**

### Size Compliance
✅ **Well under 15 MB limit** for physical invocations (NFC, App Clip Codes)
✅ **Well under 50 MB limit** for digital invocations (Safari, Messages, Maps)

**Conclusion:** No optimization or feature removal needed.

---

## 2. Feature Compatibility Analysis

| Feature | App Clip Compatible | Notes |
|---------|-------------------|-------|
| Big Text Display | ✅ Yes | SwiftUI fully supported |
| Text Fitting Algorithm | ✅ Yes | Pure computation, no restrictions |
| Message History | ✅ Yes | SwiftData supported, but see storage notes |
| Search | ✅ Yes | Local filtering, no issues |
| Favorites | ✅ Yes | Local state management |
| Themes | ✅ Yes | Pure UI styling |
| Settings | ✅ Yes | AppStorage works in App Clips |
| Shake Detection | ✅ Yes | CoreMotion allowed |
| Keyboard Handling | ✅ Yes | Standard iOS APIs |
| Gestures | ✅ Yes | SwiftUI gesture recognizers |
| Localization | ✅ Yes | Standard i18n support |

**Conclusion:** All features are App Clip compatible. No cuts required.

---

## 3. Technical Implementation

### 3.1 Project Structure Changes

```
Orbiting/
├── Orbiting/                    # Main app target (existing)
├── OrbitingClip/                # New App Clip target
│   ├── OrbitingClip.swift       # App Clip entry point
│   ├── Assets.xcassets/
│   │   └── AppIcon.appiconset/  # App Clip icon (required)
│   └── Info.plist
├── Shared/                      # Shared code (move existing code here)
│   ├── Models/
│   ├── Views/
│   ├── Utilities/
│   └── Assets/
└── Orbiting.xcodeproj
```

### 3.2 Xcode Configuration

#### Step 1: Create App Clip Target
```
1. File → New → Target → App Clip
2. Product Name: OrbitingClip
3. Bundle Identifier: com.harperrules.Orbiting.Clip
4. Parent Application: Orbiting
```

#### Step 2: Share Code
Move all existing code to shared framework or add to both targets:
- Models/ (Message.swift, AppSettings.swift, Theme.swift)
- Views/ (all views)
- Utilities/ (all utilities)
- Assets/ (themes, localization)

#### Step 3: Configure Build Settings
```swift
// OrbitingClip target settings
PRODUCT_BUNDLE_IDENTIFIER = com.harperrules.Orbiting.Clip
IPHONEOS_DEPLOYMENT_TARGET = 17.0  // Match main app
ENABLE_BITCODE = NO  // Deprecated anyway
```

### 3.3 App Clip Entry Point

Create `OrbitingClip/OrbitingClip.swift`:

```swift
import SwiftUI
import SwiftData

@main
struct OrbitingClip: App {
    @State private var settings = AppSettings()
    
    var body: some Scene {
        WindowGroup {
            AppClipView(settings: settings)
                .onContinueUserActivity(NSUserActivityTypeBrowsingWeb) { userActivity in
                    // Handle App Clip invocation URL
                    guard let url = userActivity.webpageURL else { return }
                    handleInvocation(url: url)
                }
        }
        .modelContainer(for: Message.self)
    }
    
    private func handleInvocation(url: URL) {
        // Parse URL parameters if needed
        // For Orbiting, we might pre-populate text from URL
        // Example: orbiting.app/clip?text=Hello
    }
}
```

### 3.4 App Clip-Specific View

Create `OrbitingClip/AppClipView.swift`:

```swift
import SwiftUI
import StoreKit

struct AppClipView: View {
    let settings: AppSettings
    @State private var showingUpgradePrompt = false
    
    var body: some View {
        VStack(spacing: 0) {
            // Full HomeView experience
            RootView(settings: settings)
            
            // App Clip banner
            AppClipBanner(showUpgrade: $showingUpgradePrompt)
        }
        .sheet(isPresented: $showingUpgradePrompt) {
            SKOverlay.PresentConfiguration(position: .bottom)
        }
    }
}

struct AppClipBanner: View {
    @Binding var showUpgrade: Bool
    
    var body: some View {
        HStack {
            Text("Using Orbiting App Clip")
                .font(.caption)
                .foregroundStyle(.secondary)
            Spacer()
            Button("Get Full App") {
                showUpgrade = true
            }
            .buttonStyle(.bordered)
            .controlSize(.small)
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(.regularMaterial)
    }
}
```

---

## 4. Entitlements & Capabilities

### 4.1 App Clip Entitlements

Add `OrbitingClip.entitlements`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.parent-application-identifiers</key>
    <array>
        <string>$(AppIdentifierPrefix)com.harperrules.Orbiting</string>
    </array>
    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>appclips:orbiting.app</string>
    </array>
</dict>
</plist>
```

### 4.2 Capabilities Matrix

| Capability | Main App | App Clip |
|------------|----------|----------|
| SwiftData | ✅ | ✅ |
| AppStorage | ✅ | ✅ |
| CoreMotion | ✅ | ✅ |
| Universal Links | ✅ | ✅ (for invocation) |
| Push Notifications | N/A | ⚠️ Limited (ephemeral only) |
| iCloud | N/A | ❌ Not available |

---

## 5. Data Persistence Strategy

### 5.1 App Clip Data Lifecycle

**Challenge:** App Clip data is deleted after ~8 hours of inactivity.

**Solution:** Three-tier storage strategy:

```swift
// StorageManager.swift
enum StorageType {
    case appClip    // Temporary, deleted after inactivity
    case shared     // Shared container with main app
    case main       // Main app only (not accessible from clip)
}

class StorageManager {
    static let isRunningInAppClip: Bool = {
        Bundle.main.bundleIdentifier?.contains(".Clip") ?? false
    }()
    
    static func saveMessage(_ message: Message, to context: ModelContext) {
        context.insert(message)
        try? context.save()
        
        // If App Clip, also save to shared container
        if isRunningInAppClip {
            SharedDataManager.saveForMigration(message)
        }
    }
}

class SharedDataManager {
    // Use shared app group container
    static let sharedContainer = UserDefaults(
        suiteName: "group.com.harperrules.Orbiting"
    )
    
    static func saveForMigration(_ message: Message) {
        // Save recent messages for potential upgrade
        var recentMessages = loadRecentMessages()
        recentMessages.insert(message, at: 0)
        recentMessages = Array(recentMessages.prefix(10))
        
        if let data = try? JSONEncoder().encode(recentMessages) {
            sharedContainer?.set(data, forKey: "pendingMessages")
        }
    }
}
```

### 5.2 App Group Configuration

1. Enable App Groups capability in both targets
2. Create shared container: `group.com.harperrules.Orbiting`
3. Update ModelContainer to use shared container:

```swift
// In both OrbitingApp.swift and OrbitingClip.swift
.modelContainer(for: Message.self, inMemory: false, isAutosaveEnabled: true) { result in
    switch result {
    case .success(let container):
        // Configure shared store if in App Clip
        if Bundle.main.bundleIdentifier?.contains(".Clip") == true {
            // Use shared app group for data
        }
    case .failure(let error):
        print("Failed to create model container: \(error)")
    }
}
```

---

## 6. App Clip Experiences

### 6.1 Invocation Methods

#### Physical Invocations (15 MB limit)
1. **NFC Tags**
   - Encode: `https://orbiting.app/clip?action=start`
   - Use case: Conference room doors, event signage

2. **App Clip Codes**
   - Generated via App Store Connect
   - Scannable QR-like codes with Apple branding
   - Use case: Printed materials, displays

3. **QR Codes**
   - Standard QR codes linking to App Clip URL
   - Use case: General distribution

#### Digital Invocations (50 MB limit)
1. **Safari Smart Banners**
   - Automatic detection on orbiting.app
   - Meta tag: `<meta name="apple-itunes-app" content="app-clip-bundle-id=com.harperrules.Orbiting.Clip">`

2. **Messages**
   - Share App Clip links via iMessage
   - Rich preview with App Clip badge

3. **Maps**
   - Location-based App Clip cards
   - Register business location in App Store Connect

### 6.2 URL Structure

```
Base URL: https://orbiting.app/clip

Parameters:
- action: start (default)
- text: Pre-populated message (URL encoded)
- theme: Theme identifier (mono, neon, etc.)

Examples:
https://orbiting.app/clip
https://orbiting.app/clip?text=Hello%20World
https://orbiting.app/clip?text=Meeting%20in%20progress&theme=contrast
```

### 6.3 Handling Invocation URLs

```swift
// In AppClipView or OrbitingClip.swift
func handleInvocation(url: URL) {
    guard let components = URLComponents(url: url, resolvingAgainstBaseURL: true),
          let host = components.host,
          host == "orbiting.app" else { return }
    
    let queryItems = components.queryItems ?? []
    
    // Extract text parameter
    if let textItem = queryItems.first(where: { $0.name == "text" }),
       let text = textItem.value {
        // Pre-populate HomeView with text
        NotificationCenter.default.post(
            name: .appClipTextReceived,
            object: text
        )
    }
    
    // Extract theme parameter
    if let themeItem = queryItems.first(where: { $0.name == "theme" }),
       let themeRaw = themeItem.value,
       let theme = ThemeType(rawValue: themeRaw) {
        settings.themeType = theme
    }
}
```

---

## 7. App Store Connect Configuration

### 7.1 Advanced App Clip Experiences

Configure in App Store Connect → App Clip Experiences:

```yaml
Experience 1: Default
  URL: https://orbiting.app/clip
  Title: "Quick Message Display"
  Subtitle: "Show text instantly"
  Header Image: 3000x2000px (App Clip card)
  
Experience 2: Event Signage
  URL: https://orbiting.app/clip?action=event
  Title: "Event Messaging"
  Subtitle: "Display event information"
  
Experience 3: Quiet Zone
  URL: https://orbiting.app/clip?action=quiet
  Title: "Quiet Communication"
  Subtitle: "Silent, visual messaging"
```

### 7.2 Associated Domains

Add to main app target:

```
Associated Domains:
  applinks:orbiting.app
  appclips:orbiting.app
```

### 7.3 AASA File (Apple App Site Association)

Host at `https://orbiting.app/.well-known/apple-app-site-association`:

```json
{
  "appclips": {
    "apps": ["N9TDHQ977J.com.harperrules.Orbiting.Clip"]
  },
  "applinks": {
    "apps": [],
    "details": [
      {
        "appIDs": [
          "N9TDHQ977J.com.harperrules.Orbiting",
          "N9TDHQ977J.com.harperrules.Orbiting.Clip"
        ],
        "components": [
          {
            "/": "/clip/*",
            "comment": "App Clip invocation URLs"
          }
        ]
      }
    ]
  }
}
```

---

## 8. Upgrade Flow

### 8.1 SKOverlay Integration

```swift
import StoreKit

extension AppClipView {
    func presentAppStoreOverlay() {
        guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene else {
            return
        }
        
        let config = SKOverlay.AppClipConfiguration(position: .bottom)
        let overlay = SKOverlay(configuration: config)
        overlay.present(in: scene)
    }
}
```

### 8.2 Data Migration

When user upgrades from App Clip to full app:

```swift
// In main OrbitingApp.swift
extension OrbitingApp {
    func migrateAppClipData() {
        guard let pendingData = SharedDataManager.loadPendingMessages() else {
            return
        }
        
        let context = modelContainer.mainContext
        for message in pendingData {
            context.insert(message)
        }
        try? context.save()
        
        // Clear migration data
        SharedDataManager.clearPendingMessages()
    }
}
```

---

## 9. Testing Strategy

### 9.1 Local Testing

**Environment Variables:**
```swift
// In Xcode scheme, add:
_XCAppClipURL=https://orbiting.app/clip?text=Test
```

**Simulator Testing:**
1. Build and run App Clip target
2. Test invocation URL handling
3. Verify size constraints met
4. Test upgrade flow

### 9.2 TestFlight Testing

**App Clip-Specific Tests:**
- Test all invocation methods (QR, NFC, Safari)
- Verify 15 MB size limit for physical codes
- Test data persistence across sessions
- Test upgrade to full app
- Verify shared data migration

### 9.3 Physical Testing Required

❗ **Cannot test in Simulator:**
- NFC tag invocation
- App Clip Code scanning
- Real-world size constraints
- Actual upgrade flow

**Test Devices:**
- iPhone with NFC (iPhone 7+)
- Physical NFC tags or App Clip Codes
- QR code generator

---

## 10. Asset Requirements

### 10.1 App Clip Icon

Required sizes (separate from main app icon):
```
20pt  (@2x: 40x40,   @3x: 60x60)
29pt  (@2x: 58x58,   @3x: 87x87)
38pt  (@2x: 76x76,   @3x: 114x114)
40pt  (@2x: 80x80,   @3x: 120x120)
60pt  (@2x: 120x120, @3x: 180x180)
64pt  (@2x: 128x128, @3x: 192x192)
68pt  (@2x: 136x136, @3x: 204x204)
76pt  (@2x: 152x152, @3x: 228x228)
83.5pt (@2x: 167x167)
1024pt (@1x: 1024x1024)
```

**Design Guidelines:**
- Should be similar to main app icon but distinct
- Often uses a simplified or badge version
- Must not be confusing with main app icon

### 10.2 App Clip Card Header Image

```
Dimensions: 3000 x 2000 pixels
Aspect Ratio: 3:2
Format: JPEG or PNG
File Size: < 500 KB
Safe Area: Center 1800 x 1200 pixels (text readable area)
```

**Design Recommendations:**
- Show the big text canvas in action
- Use high contrast
- Include minimal branding
- Demonstrate clear value proposition

---

## 11. Deployment Checklist

### Pre-Submission
- [ ] App Clip target builds successfully
- [ ] Binary size under 15 MB (use Archive → Organizer → App Thinning Report)
- [ ] All shared code compiles in both targets
- [ ] Info.plist configured correctly
- [ ] Entitlements set up
- [ ] App Groups enabled and configured
- [ ] Associated Domains configured
- [ ] AASA file hosted and validated

### App Store Connect
- [ ] App Clip registered
- [ ] Advanced App Clip Experiences configured
- [ ] App Clip header image uploaded (3000x2000)
- [ ] Invocation URLs configured
- [ ] Privacy policy updated (if needed)
- [ ] App Clip description written

### Testing
- [ ] Local testing with `_XCAppClipURL` completed
- [ ] TestFlight distributed to internal testers
- [ ] Physical invocation methods tested (NFC, QR, App Clip Code)
- [ ] Upgrade flow tested
- [ ] Data migration verified
- [ ] Safari Smart Banner tested

### Post-Launch
- [ ] Monitor App Analytics for App Clip usage
- [ ] Track conversion rate (App Clip → Full App)
- [ ] Monitor crash reports separately for App Clip
- [ ] Collect user feedback on invocation methods

---

## 12. Prohibited Features & Workarounds

### 12.1 What App Clips CANNOT Do

| Feature | Restriction | Orbiting Impact |
|---------|-------------|-----------------|
| Background execution | Limited to 8 minutes | ✅ Not needed |
| Long-term storage | Data deleted after ~8 hours inactive | ⚠️ Use shared container |
| HealthKit | Not available | ✅ Not used |
| HomeKit | Not available | ✅ Not used |
| CloudKit | Not available | ✅ Not used |
| SiriKit | Limited | ✅ Not used |
| App Extensions | Cannot create | ✅ Not needed |

### 12.2 Limitations That Don't Affect Orbiting

- Notifications (ephemeral only) — Not used
- In-app purchases — Not applicable
- Game Center — Not used
- PassKit — Not used
- Wallet — Not used

**Conclusion:** No workarounds needed for Orbiting.

---

## 13. Implementation Timeline

### Phase 1: Setup (2-3 hours)
- Create App Clip target
- Configure build settings
- Set up entitlements
- Organize shared code

### Phase 2: Code (3-4 hours)
- Implement AppClipView
- Add invocation URL handling
- Implement shared data container
- Add SKOverlay upgrade prompt

### Phase 3: Assets (1-2 hours)
- Create App Clip icon variants
- Design header image (3000x2000)
- Generate QR codes for testing

### Phase 4: Configuration (2-3 hours)
- Set up App Store Connect
- Configure Advanced App Clip Experiences
- Host AASA file
- Configure associated domains

### Phase 5: Testing (4-6 hours)
- Local testing
- TestFlight testing
- Physical device testing (NFC, QR)
- Upgrade flow validation

### Phase 6: Deployment (1-2 hours)
- Submit for review
- Monitor initial feedback
- Iterate on experiences

**Total Estimated Time: 13-20 hours**

---

## 14. Cost Analysis

### Development Costs
- ✅ **No additional developer fees** (included in Apple Developer Program)
- ✅ **No additional hosting** required (AASA file is tiny)
- ✅ **No additional dependencies** (uses existing tech stack)

### Operational Costs
- NFC tags: ~$0.50-2.00 per tag (optional)
- QR code printing: Minimal
- App Clip Code generation: Free via App Store Connect

**Total Additional Cost: $0** (assuming you don't need physical NFC tags)

---

## 15. Success Metrics

Track in App Analytics:
- App Clip installations vs. full app installations
- Conversion rate (App Clip → Full App download)
- Most popular invocation method
- Session duration in App Clip
- Error rates during invocation

---

## 16. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Size exceeds limit | Low | High | Monitor with App Thinning Report |
| Data loss after inactivity | Medium | Medium | Use shared container + upgrade prompt |
| Poor conversion rate | Medium | Low | Optimize overlay timing |
| NFC/QR code confusion | Low | Low | Clear signage and instructions |
| AASA file misconfiguration | Medium | High | Test with Apple validator |

---

## 17. Future Enhancements

Once App Clip is live, consider:

1. **Location-Based Experiences**
   - Register venues in Apple Maps
   - Show App Clip at specific locations

2. **App Clip-Specific Themes**
   - Ultra-high contrast for outdoor use
   - Event-branded themes

3. **Analytics Integration**
   - Track which invocation methods are most effective
   - Measure conversion funnel

4. **Smart Upgrade Prompts**
   - Show overlay after 2-3 uses
   - Incentivize with "unlock history" messaging

---

## Conclusion

Orbiting is exceptionally well-suited for App Clip support:

✅ **Zero feature cuts required**
✅ **Well under size limits** (estimated 3-4 MB)
✅ **Simple use case** (perfect for App Clip "instant experience")
✅ **No prohibited APIs** used
✅ **Clear value proposition** (quick visual messaging)

The main implementation effort is:
1. Creating the App Clip target
2. Handling invocation URLs
3. Configuring App Store Connect experiences
4. Testing physical invocation methods

**Recommendation:** Implement App Clip support. It's a natural fit for Orbiting's use case and requires minimal additional work beyond project configuration.
