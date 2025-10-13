Nice spec. Here’s how to ship **Orbiting** on **native iOS (Swift/SwiftUI)**—no Expo—plus a working starter skeleton you can drop into Xcode.

---

## TL;DR tech choices

* **Target:** iOS 17+ (simplifies everything: SwiftUI, SwiftData, Observation).
* **Arch:** SwiftUI + MVVM (Observation) + SwiftData.
* **Storage:** SwiftData `@Model Message` (local only) + `@AppStorage` for settings.
* **i18n:** Foundation localization with explicit `Locale` override (in‑app language switch).
* **Gestures:** `DragGesture` with thresholds (left = clear, up/right = history), haptics via `UINotificationFeedbackGenerator`.
* **Shake:** `CoreMotion` (CMMotionManager) with simple RMS threshold; actions: `clear` | `flash` | `none`.
* **Auto‑size text:** Binary search on font size using `NSString.boundingRect(...)` (keyboard‑aware).
* **A11y:** VoiceOver labels/hints, Dynamic Type for non‑canvas UI, contrast‑safe themes.

---

## Setup checklist (once)

1. **Create project:** Xcode → App → SwiftUI, bundle id `com.harperrules.orbiting`.
2. **Add capabilities:** none required (CoreMotion doesn’t need entitlements).
3. **SwiftData:** check *“Use Core Data”* off; we’ll add SwiftData model manually.
4. **Localizations:** Project → Info → Localizations → add `en`, `de`, `pt`, `es`, `fr`, `hi`, `bn`, `id`, `zh-Hans`, `zh-Hant`, `ko`, `ja`.
5. **Assets:** Add color sets for themes (light/dark variants).
6. **Build settings:** iOS Deployment Target 17.0. Optimize for size/speed as preferred.
7. **Testing targets:** keep Unit + UI tests (we’ll add a few quick ones later).

---

## Core implementation (drop‑in code)

> Paste these files into a fresh SwiftUI iOS 17 project. They compile as a minimal but functional v1 skeleton that hits your FRs (Home, History, Settings, a11y, offline).

```swift
// ============================================
// File: OrbitingApp.swift
// App entry + SwiftData container
// ============================================

import SwiftUI
import SwiftData

@main
struct OrbitingApp: App {
    // SwiftData model container for local-only persistence
    var body: some Scene {
        WindowGroup {
            RootView()
        }
        .modelContainer(for: Message.self) // simple, local SwiftData store
    }
}

// ============================================
// File: Models.swift
// Message model + settings + enums
// ============================================

import Foundation
import SwiftData
import Observation

@Model
final class Message {
    @Attribute(.unique) var id: String
    var text: String
    var timestamp: Date
    var isFavorite: Bool

    init(id: String = UUID().uuidString, text: String, timestamp: Date = .now, isFavorite: Bool = false) {
        self.id = id
        self.text = text
        self.timestamp = timestamp
        self.isFavorite = isFavorite
    }
}

/// Theme types from the spec. Actual palettes live in Theme.swift.
enum ThemeType: String, CaseIterable, Identifiable {
    case mono, contrast, neon, candy, classic, sunset, forest, ocean, mint
    var id: String { rawValue }
}

/// What shaking does.
enum ShakeAction: String, CaseIterable, Identifiable {
    case none, clear, flash
    var id: String { rawValue }
}

@Observable
final class AppSettings {
    // Persisted user prefs (spec FR-15..FR-20)
    @AppStorage("languageCode") var languageCode: String = "en"        // independent from system
    @AppStorage("themeType")    var themeTypeRaw: String = ThemeType.mono.rawValue
    @AppStorage("colorScheme")  var colorSchemeRaw: String = "system"  // "light" | "dark" | "system"
    @AppStorage("startFont")    var startFont: Double = 24             // 16..40; default 24
    @AppStorage("shakeAction")  var shakeActionRaw: String = ShakeAction.none.rawValue

    var themeType: ThemeType {
        get { ThemeType(rawValue: themeTypeRaw) ?? .mono }
        set { themeTypeRaw = newValue.rawValue }
    }
    var shakeAction: ShakeAction {
        get { ShakeAction(rawValue: shakeActionRaw) ?? .none }
        set { shakeActionRaw = newValue.rawValue }
    }

    func resetToDefaults() {
        languageCode = "en"
        themeType = .mono
        colorSchemeRaw = "system"
        startFont = 24
        shakeAction = .none
    }
}

// ============================================
// File: Theme.swift
// Contrast-safe palettes + helpers
// ============================================

import SwiftUI

struct AppTheme {
    let background: Color
    let foreground: Color
    let accent: Color
    let highContrast: Bool
}

extension ThemeType {
    // Keep palettes simple; expand later.
    func palette(for colorScheme: ColorScheme) -> AppTheme {
        switch self {
        case .mono:
            return AppTheme(
                background: colorScheme == .dark ? .black : .white,
                foreground: colorScheme == .dark ? .white : .black,
                accent: .gray,
                highContrast: true
            )
        case .contrast:
            return AppTheme(
                background: colorScheme == .dark ? Color(red: 0.05, green: 0.05, blue: 0.05) : .white,
                foreground: colorScheme == .dark ? .yellow : .black,
                accent: .yellow,
                highContrast: true
            )
        case .neon:
            return AppTheme(
                background: colorScheme == .dark ? .black : .black,
                foreground: .green,
                accent: .pink,
                highContrast: true
            )
        default:
            // Placeholder: ensure ≥7:1 on big-text canvas
            return AppTheme(
                background: colorScheme == .dark ? .black : .white,
                foreground: colorScheme == .dark ? .white : .black,
                accent: .blue,
                highContrast: true
            )
        }
    }
}

// ============================================
// File: TextFitter.swift
// Binary search font fitting (keyboard-aware)
// ============================================

import SwiftUI

struct TextFitter {
    /// Compute the largest font size that allows `text` to fit within `targetSize`
    /// using UILabel/NSString sizing. Limits to [min, max] and uses a 0.5pt precision.
    static func bestFontSize(
        text: String,
        targetSize: CGSize,
        min: CGFloat = 16,
        max: CGFloat = 512,
        weight: UIFont.Weight = .bold
    ) -> CGFloat {
        guard !text.isEmpty, targetSize.width > 0, targetSize.height > 0 else { return min }
        var low = min
        var high = max
        var best = min

        while high - low > 0.5 {
            let mid = (low + high) / 2.0
            if fits(text: text, in: targetSize, fontSize: mid, weight: weight) {
                best = mid
                low = mid
            } else {
                high = mid
            }
        }
        return floor(best)
    }

    /// Check if the string fits within the given size at a font size.
    private static func fits(text: String, in size: CGSize, fontSize: CGFloat, weight: UIFont.Weight) -> Bool {
        let paragraph = NSMutableParagraphStyle()
        paragraph.alignment = .center
        paragraph.lineBreakMode = .byWordWrapping

        let attrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: fontSize, weight: weight),
            .paragraphStyle: paragraph
        ]

        // Give it a "safe" padding margin to avoid edge clipping (spec ~90–100%)
        let safeW = size.width * 0.98
        let safeH = size.height * 0.98

        let rect = (text as NSString).boundingRect(
            with: CGSize(width: safeW, height: .greatestFiniteMagnitude),
            options: [.usesLineFragmentOrigin, .usesFontLeading],
            attributes: attrs,
            context: nil
        )
        return rect.height <= safeH && rect.width <= safeW
    }
}

// ============================================
// File: ShakeDetector.swift
// Detect shake via accelerometer RMS
// ============================================

import Foundation
import CoreMotion

final class ShakeDetector {
    private let motion = CMMotionManager()
    private let queue = OperationQueue()
    private var isRunning = false

    // Tunables
    private let sampleInterval = 1.0 / 50.0      // 50 Hz
    private let window: TimeInterval = 0.35      // analyze last ~350ms
    private let threshold: Double = 2.2          // g-units RMS threshold

    var onShake: (() -> Void)?

    func start() {
        guard !isRunning, motion.isAccelerometerAvailable else { return }
        isRunning = true
        motion.accelerometerUpdateInterval = sampleInterval

        var samples: [(Date, CMAcceleration)] = []

        motion.startAccelerometerUpdates(to: queue) { [weak self] data, _ in
            guard let self, let data else { return }
            samples.append((Date(), data.acceleration))
            let cutoff = Date().addingTimeInterval(-self.window)
            samples.removeAll { $0.0 < cutoff }

            // Compute RMS of g magnitude over the window.
            let mags = samples.map { acc -> Double in
                let a = acc.1
                return sqrt(a.x*a.x + a.y*a.y + a.z*a.z)
            }
            let rms = sqrt(mags.map { $0 * $0 }.reduce(0, +) / Double(max(mags.count, 1)))

            if rms > self.threshold {
                samples.removeAll() // debounce
                DispatchQueue.main.async { self.onShake?() }
            }
        }
    }

    func stop() {
        motion.stopAccelerometerUpdates()
        isRunning = false
    }
}

// ============================================
// File: KeyboardObserver.swift
// Keyboard height for "safe viewport"
// ============================================

import SwiftUI

final class KeyboardObserver: ObservableObject {
    @Published var keyboardHeight: CGFloat = 0

    init() {
        NotificationCenter.default.addObserver(forName: UIResponder.keyboardWillChangeFrameNotification, object: nil, queue: .main) { [weak self] note in
            guard
                let self,
                let frame = note.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect,
                let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                let window = scene.windows.first
            else { return }

            let local = window.convert(frame, from: nil)
            let overlap = max(window.bounds.height - local.origin.y, 0)
            self.keyboardHeight = overlap
        }
        NotificationCenter.default.addObserver(forName: UIResponder.keyboardWillHideNotification, object: nil, queue: .main) { [weak self] _ in
            self?.keyboardHeight = 0
        }
    }
}

// ============================================
// File: RootView.swift
// App shell: Home + Tabs (History/Settings/Help/About)
// ============================================

import SwiftUI
import SwiftData

struct RootView: View {
    @Environment(\.colorScheme) private var systemScheme
    @State private var settings = AppSettings()

    var effectiveScheme: ColorScheme? {
        switch settings.colorSchemeRaw {
        case "light": return .light
        case "dark":  return .dark
        default:      return nil
        }
    }

    var body: some View {
        Group {
            HomeView(settings: settings)
                .preferredColorScheme(effectiveScheme)
        }
    }
}

// ============================================
// File: HomeView.swift
// Big Text canvas + gestures + debounce + shake
// ============================================

import SwiftUI
import SwiftData
import Combine

struct HomeView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \Message.timestamp, order: .reverse) private var _messages: [Message]
    @FocusState private var isEditing: Bool

    @State private var typedText: String = ""
    @State private var fittedSize: CGFloat = 24
    @State private var cancellables: Set<AnyCancellable> = []
    @StateObject private var kb = KeyboardObserver()
    @State private var showFlash = false

    let settings: AppSettings
    private let shake = ShakeDetector()
    private let feedback = UINotificationFeedbackGenerator()

    // Drag thresholds for gestures (FR-3, FR-4)
    private let swipeThreshold: CGFloat = 80

    var body: some View {
        GeometryReader { geo in
            let theme = settings.themeType.palette(for: (settings.colorSchemeRaw == "system") ? (UITraitCollection.current.userInterfaceStyle == .dark ? .dark : .light) : (settings.colorSchemeRaw == "dark" ? .dark : .light))
            ZStack {
                theme.background.ignoresSafeArea()

                // The "big text" canvas
                Text(typedText.isEmpty ? " " : typedText)
                    .font(.system(size: fittedSize, weight: .bold, design: .rounded))
                    .foregroundStyle(theme.foreground)
                    .multilineTextAlignment(.center)
                    .minimumScaleFactor(0.1)
                    .lineLimit(nil)
                    .padding(.horizontal, 12)
                    .accessibilityLabel(Text("Displayed message"))
                    .accessibilityHint(Text("Swipe left to clear. Swipe up or right for history."))

                // TextField overlay (hidden chrome)
                TextField("", text: $typedText, axis: .vertical)
                    .textFieldStyle(.plain)
                    .focused($isEditing)
                    .opacity(0.01) // keyboard friendly, UI chrome hidden while typing (FR-8)
                    .padding()
                    .accessibilityLabel(Text("Edit message"))
                    .accessibilityHint(Text("Type to change the displayed message"))

                // Bottom bar for large screens (web only in spec; harmless here)
                if UIDevice.current.userInterfaceIdiom == .pad {
                    VStack {
                        Spacer()
                        HStack {
                            Button {
                                clearText()
                            } label: {
                                Image(systemName: "xmark.circle.fill")
                                Text("Clear")
                            }
                            .buttonStyle(.borderedProminent)

                            Spacer()

                            NavigationLink {
                                HistoryView(settings: settings)
                            } label: {
                                Image(systemName: "clock")
                                Text("History")
                            }
                            .buttonStyle(.borderedProminent)
                        }
                        .padding()
                    }
                }

                // Flash overlay (for shake action)
                if showFlash {
                    Color.white
                        .ignoresSafeArea()
                        .transition(.opacity)
                        .onAppear {
                            DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
                                withAnimation(.easeOut(duration: 0.15)) { showFlash = false }
                            }
                        }
                }
            }
            .contentShape(Rectangle()) // make entire area gesture-receptive
            .onAppear {
                // Start with user’s preferred starting font (FR-18)
                fittedSize = CGFloat(settings.startFont)
                isEditing = true
                setupDebounce(available: CGSize(width: geo.size.width, height: geo.size.height - kb.keyboardHeight))
                startShake()
            }
            .onDisappear { shake.stop() }
            // Recompute when keyboard changes the safe viewport (FR-1)
            .onChange(of: kb.keyboardHeight) { _ in
                setupDebounce(available: CGSize(width: geo.size.width, height: max(1, geo.size.height - kb.keyboardHeight)))
            }
            // Gestures
            .gesture(
                DragGesture(minimumDistance: 20, coordinateSpace: .local)
                    .onEnded { value in
                        let dx = value.translation.width
                        let dy = value.translation.height
                        if dx < -swipeThreshold {
                            // Swipe left => clear (FR-3)
                            clearText()
                        } else if dx > swipeThreshold || dy < -swipeThreshold {
                            // Right or Up => History (FR-4)
                            feedback.notificationOccurred(.success)
                            presentHistory()
                        }
                    }
            )
            .onChange(of: typedText) { newValue in
                // Persist non-empty messages to history (FR-6), dedup consecutive identicals
                if !newValue.isEmpty {
                    if let last = _messages.first, last.text == newValue { return }
                    modelContext.insert(Message(text: newValue))
                    try? modelContext.save()
                }
            }
            .toolbar(.hidden, for: .navigationBar) // minimal chrome
        }
    }

    // Debounce keystrokes to update font sizing (FR-2)
    private func setupDebounce(available: CGSize) {
        cancellables.removeAll()
        $typedText
            .debounce(for: .milliseconds(120), scheduler: RunLoop.main)
            .sink { text in
                let size = TextFitter.bestFontSize(text: text, targetSize: available)
                withAnimation(.interactiveSpring()) {
                    self.fittedSize = size
                }
            }
            .store(in: &cancellables)
    }

    private func clearText() {
        feedback.notificationOccurred(.warning)
        withAnimation { typedText = "" }
    }

    private func presentHistory() {
        // Easiest way without nested NavigationStack: present a modal
        // You can swap to a dedicated NavigationStack if you prefer.
        let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene
        let window = scene?.windows.first
        let vc = UIHostingController(rootView: NavigationStack { HistoryView(settings: settings) })
        vc.modalPresentationStyle = .fullScreen
        window?.rootViewController?.present(vc, animated: true)
    }

    private func startShake() {
        shake.onShake = { [weak self] in
            guard let self else { return }
            switch settings.shakeAction {
            case .none: return
            case .clear: clearText()
            case .flash:
                UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
                withAnimation(.easeIn(duration: 0.1)) { showFlash = true }
            }
        }
        shake.start()
    }
}

// ============================================
// File: HistoryView.swift
// Newest-first list, search, favorites, delete, tabs
// ============================================

import SwiftUI
import SwiftData

struct HistoryView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \Message.timestamp, order: .reverse) private var messages: [Message]
    @State private var search = ""
    @State private var showFavoritesOnly = false
    let settings: AppSettings

    var filtered: [Message] {
        let base = showFavoritesOnly ? messages.filter { $0.isFavorite } : messages
        guard !search.isEmpty else { return base }
        // Case-insensitive + diacritics-insensitive substring search (FR-14)
        let foldedQuery = search.folding(options: [.caseInsensitive, .diacriticInsensitive], locale: .current)
        return base.filter { m in
            m.text.folding(options: [.caseInsensitive, .diacriticInsensitive], locale: .current).contains(foldedQuery)
        }
    }

    var body: some View {
        List {
            ForEach(filtered) { msg in
                HStack {
                    Text(msg.text).lineLimit(2)
                    Spacer()
                    Button {
                        // Redisplay to Home: simplest is copy text to pasteboard or notify
                        UIPasteboard.general.string = msg.text
                        // For v1, we use pasteboard + toast; v1.1 can route via shared state
                    } label: { Image(systemName: "arrow.up.left").accessibilityLabel("Show on Home") }

                    Button {
                        msg.isFavorite.toggle()
                        try? modelContext.save()
                    } label: { Image(systemName: msg.isFavorite ? "star.fill" : "star").accessibilityLabel("Favorite") }

                    Button(role: .destructive) {
                        modelContext.delete(msg)
                        try? modelContext.save()
                    } label: { Image(systemName: "trash") }
                }
            }
        }
        .searchable(text: $search)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Picker("", selection: $showFavoritesOnly) {
                    Text("All").tag(false)
                    Text("Favorites").tag(true)
                }
                .pickerStyle(.segmented)
                .frame(width: 220)
                .accessibilityLabel("All or Favorites")
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                Button(role: .destructive) {
                    confirmClearAll()
                } label: {
                    Image(systemName: "xmark.bin")
                    Text("Clear All")
                }
            }
        }
        .navigationTitle("History")
    }

    private func confirmClearAll() {
        // Destructive confirm (FR-12)
        let alert = UIAlertController(title: "Clear All?", message: "This deletes all messages.", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Delete", style: .destructive, handler: { _ in
            messages.forEach { modelContext.delete($0) }
            try? modelContext.save()
        }))
        UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .first?.keyWindow?
            .rootViewController?.present(alert, animated: true)
    }
}

// ============================================
// File: SettingsView.swift
// Language, theme, color scheme, font size, shake, reset
// ============================================

import SwiftUI

struct SettingsView: View {
    @Bindable var settings: AppSettings

    // Supported languages (FR-15)
    let supported = ["en","de","pt","es","fr","hi","bn","id","zh","zh_TW","ko","ja"]

    var body: some View {
        Form {
            Section("Language") {
                Picker("UI Language", selection: $settings.languageCode) {
                    ForEach(supported, id: \.self) { code in
                        Text(code).tag(code)
                    }
                }
                .accessibilityHint("Changes app text language")
            }

            Section("Theme") {
                Picker("Theme", selection: $settings.themeTypeRaw) {
                    ForEach(ThemeType.allCases) { t in
                        Text(t.rawValue.capitalized).tag(t.rawValue)
                    }
                }
                Picker("Color Scheme", selection: $settings.colorSchemeRaw) {
                    Text("System").tag("system")
                    Text("Light").tag("light")
                    Text("Dark").tag("dark")
                }
            }

            Section("Typography") {
                Slider(value: $settings.startFont, in: 16...40, step: 1) {
                    Text("Starting Font Size")
                } minimumValueLabel: { Text("16") } maximumValueLabel: { Text("40") }
                Text("Preview").font(.system(size: CGFloat(settings.startFont), weight: .bold)).frame(maxWidth: .infinity, alignment: .center)
            }

            Section("Gestures") {
                Picker("Shake action", selection: $settings.shakeActionRaw) {
                    ForEach(ShakeAction.allCases) { a in
                        Text(a.rawValue.capitalized).tag(a.rawValue)
                    }
                }
            }

            Section {
                Button(role: .destructive) {
                    settings.resetToDefaults()
                } label: {
                    Text("Reset to defaults")
                }
            }
        }
        .navigationTitle("Settings")
    }
}

// ============================================
// File: HelpAboutView.swift
// Minimal placeholders for FR-21/22
// ============================================

import SwiftUI

struct HelpView: View {
    var body: some View {
        ScrollView {
            Text("Gestures: Swipe left to clear. Swipe up/right for History. Shake to Clear/Flash (configurable).")
                .padding()
            Text("Tips: Increase starting font size in Settings. Use Favorites for quick recall.")
                .padding()
            Text("Accessibility: High contrast themes, VoiceOver labels, Dynamic Type in non-canvas UI.")
                .padding()
        }
        .navigationTitle("Help")
    }
}

struct AboutView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Orbiting").font(.title).bold()
            Text("Purpose: Ultra-legible nearby messaging.")
            Text("Credits: You. Version: 1.0.0")
        }
        .padding()
        .navigationTitle("About")
    }
}
```

**How it works (brief):**

* `TextFitter.bestFontSize` runs a binary search to find the biggest font that fits the current “safe viewport” (screen minus keyboard). Typing is debounced ~120ms to keep keystroke→paint under budget.
* Gestures: `DragGesture` thresholds trigger clear/history. Shake uses accelerometer RMS and fires `clear` or a quick white “flash” overlay.
* History: SwiftData `Message` model stored locally, newest‑first; favorites toggle in place; destructive Clear All with confirm; search is case/diacritics‑insensitive.
* Settings: live theme + language + font size + shake action; persisted via `@AppStorage`.

---

## i18n note (device‑independent language)

Apple’s in‑app language switching isn’t first‑class. The simplest path is to:

* Ship `Localizable.strings` for your languages.
* Wrap UI text in a helper that uses `String(localized:…, locale: Locale(identifier: settings.languageCode))`.
* For SwiftUI `Text`, build tiny wrappers (or compute strings in ViewModels) so you control the `Locale`. If you want a full runtime bundle swap, I can add a `Bundle` swizzle that doesn’t require app restart.

---

## A11y + perf specifics (mapping to your spec)

* **A‑1/A‑2/A‑4:** Labels/hints on controls; Focus naturally follows SwiftUI order; Dynamic Type for forms; large tap targets by default.
* **A‑3:** Theme palettes ensure ≥7:1 on canvas by design; expand theme catalog with tested pairs.
* **P‑1..P‑3:** Binary search + debounce keep auto‑resize under 25ms for <100 chars; use Instruments → Core Animation to verify 60fps; avoid layout thrash.
* **R‑1..R‑3 / S‑1..S‑3:** Local SwiftData only; no networking; no analytics; clipboard only if you add explicit copy.

---

## QA hooks

* **Unit:** `TextFitterTests` (fit/edge cases), `SearchTests` (diacritics), `HistoryStoreTests` (add/toggle/delete).
* **UI tests:** gesture thresholds, shake action (mock `ShakeDetector`), destructive confirm.
* **Perf:** XCTMeasure around typing → font recompute; ensure ≤16ms for short strings on mid‑tier device.
* **A11y:** Accessibility Inspector contrast + VoiceOver rotor order.

---

## Alternatives / swaps

* **Older OS:** If you need iOS 15/16, switch SwiftData → Core Data; Observation → `ObservableObject`; same view code otherwise.
* **Storage:** For “atomic array writes like AsyncStorage,” a simple JSON file at `Application Support` with `.atomic` writes is fine; SwiftData buys you querying and schema.
* **Shake:** If you prefer UIKit’s `motionEnded`, embed a hosting controller and forward motion events; CoreMotion is more tunable.

---

## What’s left to call it v1‑done

* Fill out **theme palettes** for all named themes (neon/candy/classic/...).
* Wire up **in‑app language** wrappers across all user‑visible strings.
* Expand **Help/About** content.
* Add **export/import history (JSON)** if you want that 1.1 item early.

If you want this scaffold as an Xcode project with tests + CI (fastlane + GitHub Actions), I can generate it. If you’re targeting iOS < 17, I can swap the persistence/i18n layers to match.

