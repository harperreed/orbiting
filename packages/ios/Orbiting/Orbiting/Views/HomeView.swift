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
    @State private var textPublisher = PassthroughSubject<String, Never>()
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
                fittedSize = CGFloat(settings.startFont)
                setupDebounce(available: CGSize(
                    width: geo.size.width,
                    height: geo.size.height - kb.keyboardHeight
                ))
            }
            .onChange(of: kb.keyboardHeight) {
                setupDebounce(available: CGSize(
                    width: geo.size.width,
                    height: max(1, geo.size.height - kb.keyboardHeight)
                ))
            }
            .onChange(of: typedText) { oldValue, newValue in
                textPublisher.send(newValue)

                // Persist non-empty messages to history
                if !newValue.isEmpty {
                    if let last = messages.first, last.text == newValue { return }
                    modelContext.insert(Message(text: newValue))
                    try? modelContext.save()
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
        feedback.notificationOccurred(.success)
        showingHistory = true
    }

    // Clear the current text
    private func clearText() {
        feedback.notificationOccurred(.warning)
        withAnimation {
            typedText = ""
            fittedSize = CGFloat(settings.startFont)
        }
    }

    // Debounce keystrokes to update font sizing
    private func setupDebounce(available: CGSize) {
        cancellables.removeAll()
        textPublisher
            .debounce(for: .milliseconds(120), scheduler: RunLoop.main)
            .sink { text in
                let size = TextFitter.bestFontSize(text: text, targetSize: available)
                withAnimation(.interactiveSpring()) {
                    self.fittedSize = size
                }
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
