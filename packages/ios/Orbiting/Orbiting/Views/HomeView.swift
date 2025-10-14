// ABOUTME: Main canvas view with auto-sizing text and hidden TextField for input
// ABOUTME: Debounces text changes and recalculates optimal font size for viewport

import SwiftUI
import SwiftData
import Combine

struct HomeView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.colorScheme) private var colorScheme
    @Query(sort: \Message.timestamp, order: .reverse) private var messages: [Message]
    @FocusState private var isEditing: Bool

    let settings: AppSettings

    @State private var typedText: String = ""
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

    var body: some View {
        GeometryReader { geo in
            let theme = settings.themeType.theme(for: colorScheme)

            ZStack {
                theme.background.ignoresSafeArea()

                // The "big text" canvas
                Text(typedText.isEmpty ? " " : typedText)
                    .font(.system(size: fittedSize, weight: .bold, design: .rounded))
                    .foregroundStyle(theme.text)
                    .multilineTextAlignment(.leading)
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                    .padding(.horizontal, 12)
                    .accessibilityLabel(Text("Displayed message"))
                    .accessibilityHint(Text("Swipe left to clear. Swipe up or right for history."))

                // TextField overlay (hidden chrome)
                TextField("", text: $typedText, axis: .vertical)
                    .textFieldStyle(.plain)
                    .focused($isEditing)
                    .opacity(0.01) // keyboard friendly, UI chrome hidden
                    .padding()
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
                        width: viewportSize.width - 24,
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
            .onChange(of: geo.size) {
                viewportSize = $1
            }
            .onChange(of: kb.keyboardHeight) {
                // Recalculate size immediately when keyboard changes
                if !typedText.isEmpty {
                    let available = CGSize(
                        width: viewportSize.width - 24,
                        height: max(1, viewportSize.height - kb.keyboardHeight)
                    )
                    let size = TextFitter.bestFontSize(text: typedText, targetSize: available)
                    withAnimation(.interactiveSpring()) {
                        fittedSize = size
                    }
                }
            }
            .onChange(of: typedText) { oldValue, newValue in
                textPublisher.send(newValue)

                // Send to save publisher for debounced saving
                if !newValue.isEmpty {
                    savePublisher.send(newValue)
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
        try? modelContext.save()
    }

    // Clear the current text
    private func clearText() {
        // Save current message before clearing
        if !typedText.isEmpty {
            saveMessage(typedText)
        }

        feedback.notificationOccurred(.warning)
        withAnimation {
            typedText = ""
            fittedSize = CGFloat(settings.startFont)
        }
    }

    // Debounce keystrokes to update font sizing
    private func setupDebounce() {
        cancellables.removeAll()

        // Debounce font sizing (fast)
        textPublisher
            .debounce(for: .milliseconds(120), scheduler: RunLoop.main)
            .sink { text in
                // Recalculate available size from current state
                let available = CGSize(
                    width: self.viewportSize.width - 24,
                    height: self.viewportSize.height - self.kb.keyboardHeight
                )
                let size = TextFitter.bestFontSize(text: text, targetSize: available)
                print("📏 Debounced size: \(size)pt for text: '\(text)' in \(available)")
                withAnimation(.interactiveSpring()) {
                    self.fittedSize = size
                }
            }
            .store(in: &cancellables)

        // Debounce message saving (slow - only after user stops typing)
        savePublisher
            .debounce(for: .seconds(2), scheduler: RunLoop.main)
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
