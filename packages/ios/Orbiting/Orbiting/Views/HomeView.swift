// ABOUTME: Main canvas view with auto-sizing text and hidden TextField for input
// ABOUTME: Debounces text changes and recalculates optimal font size for viewport

import SwiftUI
import SwiftData
import Combine

struct HomeView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.scenePhase) private var scenePhase
    @Query(sort: \Message.timestamp, order: .reverse) private var messages: [Message]
    @FocusState private var isEditing: Bool

    let settings: AppSettings

    @State private var typedText: String = ""
    @State private var isPlaceholder: Bool = true
    @State private var fittedSize: CGFloat = 24
    @State private var viewportSize: CGSize = .zero
    @State private var textPublisher = PassthroughSubject<String, Never>()
    @State private var savePublisher = PassthroughSubject<String, Never>()
    @State private var cancellables: Set<AnyCancellable> = []
    @StateObject private var kb = KeyboardObserver()
    @State private var showingHistory: Bool = false
    @State private var showingSettings: Bool = false
    @State private var showFlash = false
    private let shake = ShakeDetector()
    private let feedback = UINotificationFeedbackGenerator()

    private let placeholderText = "Tap to type"

    // Display either placeholder or actual text
    private var displayText: String {
        if isPlaceholder && typedText.isEmpty {
            return placeholderText
        }
        return typedText.isEmpty ? " " : typedText
    }

    var body: some View {
        GeometryReader { geo in
            let theme = settings.themeType.theme(for: colorScheme)

            ZStack {
                theme.background.ignoresSafeArea()

                // The "big text" canvas
                Text(displayText)
                    .font(.system(size: fittedSize, weight: .bold, design: .rounded))
                    .foregroundStyle(isPlaceholder ? Color.gray.opacity(0.5) : theme.text)
                    .multilineTextAlignment(.leading)
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                    .padding(.horizontal, 12)
                    .accessibilityLabel(Text("Displayed message"))
                    .accessibilityHint(Text("Swipe left to clear. Swipe up or right for history."))
                    .onTapGesture {
                        if isPlaceholder {
                            typedText = ""
                            isPlaceholder = false
                        }
                        isEditing = true
                    }

                // TextField overlay (hidden text, visible cursor)
                TextField("", text: $typedText, axis: .vertical)
                    .textFieldStyle(.plain)
                    .focused($isEditing)
                    .foregroundColor(.clear) // Hide the TextField text completely
                    .opacity(0.01) // Keep TextField nearly invisible
                    .padding()
                    .font(.system(size: fittedSize, weight: .bold, design: .rounded))
                    .tint(theme.text.opacity(0.8)) // Make cursor more visible with slight opacity
                    .accentColor(theme.text) // Ensure cursor uses theme color
                    .accessibilityLabel(Text("Edit message"))
                    .accessibilityHint(Text("Type to change the displayed message"))

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
            .onAppear {
                startShake()
                isEditing = true
                viewportSize = geo.size
                setupDebounce()
                // Trigger initial size calculation if there's already text
                if !typedText.isEmpty {
                    let available = CGSize(
                        width: viewportSize.width - Self.horizontalPadding,
                        height: viewportSize.height - kb.keyboardHeight
                    )
                    let size = TextFitter.bestFontSize(text: typedText, targetSize: available)
                    print("📏 Initial size calculation: \(size)pt for text: '\(typedText)' in \(available)")
                    withAnimation(.interactiveSpring()) {
                        fittedSize = size
                    }
                } else {
                    fittedSize = CGFloat(settings.startFont)
                    print("📏 Using startFont: \(settings.startFont)")
                }
            }
            .onChange(of: geo.size) { oldValue, newValue in
                viewportSize = newValue
                // Recalculate size immediately when viewport size changes
                if !typedText.isEmpty {
                    let available = CGSize(
                        width: viewportSize.width - Self.horizontalPadding,
                        height: viewportSize.height - kb.keyboardHeight
                    )
                    let size = TextFitter.bestFontSize(text: typedText, targetSize: available)
                    print("📏 Viewport size changed: \(size)pt for text in \(available)")
                    withAnimation(.interactiveSpring()) {
                        fittedSize = size
                    }
                }
            }
            .onChange(of: kb.keyboardHeight) {
                // Recalculate size immediately when keyboard changes
                if !typedText.isEmpty {
                    let available = CGSize(
                        width: viewportSize.width - Self.horizontalPadding,
                        height: max(1, viewportSize.height - kb.keyboardHeight)
                    )
                    let size = TextFitter.bestFontSize(text: typedText, targetSize: available)
                    withAnimation(.interactiveSpring()) {
                        fittedSize = size
                    }
                }
            }
            .onChange(of: typedText) { oldValue, newValue in
                // Clear placeholder on first character typed
                if isPlaceholder && !newValue.isEmpty {
                    isPlaceholder = false
                }

                textPublisher.send(newValue)

                // Send to save publisher for debounced saving
                if !newValue.isEmpty {
                    savePublisher.send(newValue)
                }
            }
            .onChange(of: scenePhase) { oldPhase, newPhase in
                // Save current message when app goes to background
                if newPhase == .background && !typedText.isEmpty && !isPlaceholder {
                    saveMessage(typedText)
                    print("💾 Saved message to history on app backgrounding")
                }
            }
            .gesture(
                DragGesture(minimumDistance: 20, coordinateSpace: .local)
                    .onEnded { value in
                        let dx = value.translation.width
                        let dy = value.translation.height
                        let swipeThreshold: CGFloat = 80

                        if dx < -swipeThreshold {
                            // Swipe left => clear
                            clearText()
                        } else if dx > swipeThreshold || dy < -swipeThreshold {
                            // Right or Up => History
                            presentHistory()
                        }
                    }
            )
            .sheet(isPresented: $showingHistory) {
                HistoryView()
            }
            .sheet(isPresented: $showingSettings) {
                NavigationStack {
                    SettingsView(settings: settings)
                        .toolbar {
                            ToolbarItem(placement: .cancellationAction) {
                                Button("Done") {
                                    showingSettings = false
                                }
                            }
                        }
                }
            }
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showingSettings = true
                    } label: {
                        Image(systemName: "gear")
                    }
                    .accessibilityLabel("Settings")
                }
            }
            .onDisappear {
                shake.stop()
            }
        }
    }

    // Present the history view
    private func presentHistory() {
        // Save current message before showing history
        if !typedText.isEmpty {
            saveMessage(typedText)
        }
        feedback.notificationOccurred(.success)
        showingHistory = true
    }

    // Save a message to history (only if it's new or changed)
    private func saveMessage(_ text: String) {
        guard !text.isEmpty else { return }

        // Don't save if it's identical to the most recent message
        if let last = messages.first, last.text == text {
            return
        }

        modelContext.insert(Message(text: text))
        do {
            try modelContext.save()
            print("💾 Saved message to history: '\(text.prefix(50))\(text.count > 50 ? "..." : "")'")
        } catch {
            print("❌ Failed to save message to history: \(error.localizedDescription)")
            // Note: Message is still inserted in context, will be retried on next save
        }
    }

    // Clear the current text
    private func clearText() {
        // Save current message before clearing
        if !typedText.isEmpty && !isPlaceholder {
            saveMessage(typedText)
        }

        feedback.notificationOccurred(.warning)
        withAnimation {
            typedText = ""
            isPlaceholder = true
            fittedSize = CGFloat(settings.startFont)
        }
    }

    // Constants for debouncing behavior
    private static let textDebounceMs = 120
    private static let saveDebounceSeconds = 5
    private static let horizontalPadding: CGFloat = 24

    // Debounce keystrokes to update font sizing
    private func setupDebounce() {
        // Only setup once - check if already configured
        guard cancellables.isEmpty else {
            print("⚠️ Debounce already configured, skipping setup")
            return
        }

        // Debounce font sizing (fast)
        textPublisher
            .debounce(for: .milliseconds(Self.textDebounceMs), scheduler: RunLoop.main)
            .sink { text in
                // Skip size calculation for empty text (placeholder will show at startFont size)
                guard !text.isEmpty && !self.isPlaceholder else {
                    withAnimation(.interactiveSpring()) {
                        self.fittedSize = CGFloat(self.settings.startFont)
                    }
                    return
                }

                // Recalculate available size from current state
                let available = CGSize(
                    width: self.viewportSize.width - Self.horizontalPadding,
                    height: self.viewportSize.height - self.kb.keyboardHeight
                )
                let size = TextFitter.bestFontSize(text: text, targetSize: available)
                print("📏 Debounced size: \(size)pt for text: '\(text)' in \(available)")
                withAnimation(.interactiveSpring()) {
                    self.fittedSize = size
                }
            }
            .store(in: &cancellables)

        // Debounce message saving (longer timeout - 5 seconds after user stops typing)
        savePublisher
            .debounce(for: .seconds(Self.saveDebounceSeconds), scheduler: RunLoop.main)
            .removeDuplicates()
            .sink { text in
                self.saveMessage(text)
            }
            .store(in: &cancellables)
    }

    // Start shake detection
    private func startShake() {
        shake.onShakeStart = {
            switch self.settings.shakeAction {
            case .none: return
            case .clear: self.clearText()
            case .flash:
                UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
                withAnimation(.easeIn(duration: 0.1)) { self.showFlash = true }
            }
        }
        shake.start()
    }
}
