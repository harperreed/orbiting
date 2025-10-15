// ABOUTME: App Clip entry point with invocation URL handling
// ABOUTME: Parses URL parameters (text, theme) and configures app accordingly

import SwiftUI
import SwiftData

@main
struct OrbitingClip: App {
    @State private var settings = AppSettings()
    @State private var invocationText: String?
    @AppStorage("hasSeenWelcome") private var hasSeenWelcome = false

    // Configure shared container (same as main app)
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([Message.self])

        // Use shared App Group container if available
        if let sharedURL = StorageManager.sharedContainerURL {
            let modelConfiguration = ModelConfiguration(
                url: sharedURL.appending(path: "default.store")
            )

            do {
                let container = try ModelContainer(for: schema, configurations: modelConfiguration)
                print("✅ App Clip using shared container at: \(sharedURL.path)")
                return container
            } catch {
                print("⚠️ App Clip failed to configure shared container: \(error)")
                // Fall back to default container
            }
        }

        // Fallback to default container
        do {
            return try ModelContainer(for: schema)
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    var body: some Scene {
        WindowGroup {
            AppClipView(settings: settings, invocationText: invocationText)
                .onContinueUserActivity(NSUserActivityTypeBrowsingWeb) { userActivity in
                    handleInvocation(userActivity: userActivity)
                }
                .sheet(isPresented: Binding(
                    get: { !hasSeenWelcome },
                    set: { if !$0 { hasSeenWelcome = true } }
                )) {
                    WelcomeView()
                        .interactiveDismissDisabled(false)
                }
        }
        .modelContainer(sharedModelContainer)
    }

    // Constants for App Clip configuration
    private static let expectedDomain = "orbiting.com"
    private static let maxTextLength = 1000 // Maximum characters for pre-populated text

    /// Handles App Clip invocation URL parsing with validation
    private func handleInvocation(userActivity: NSUserActivity) {
        guard let url = userActivity.webpageURL else {
            print("⚠️ No webpage URL in user activity. Activity type: \(userActivity.activityType)")
            return
        }

        print("📱 App Clip invoked with URL: \(url.absoluteString)")

        // Validate URL components
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: true) else {
            print("❌ Failed to parse URL components from: \(url.absoluteString)")
            return
        }

        guard let host = components.host else {
            print("❌ No host found in URL: \(url.absoluteString)")
            return
        }

        // Check domain matches entitlements configuration
        guard host == Self.expectedDomain else {
            print("❌ Invalid App Clip URL host. Expected: \(Self.expectedDomain), Got: \(host)")
            return
        }

        let queryItems = components.queryItems ?? []

        // Extract and validate text parameter
        if let textItem = queryItems.first(where: { $0.name == "text" }),
           let encodedText = textItem.value,
           let text = encodedText.removingPercentEncoding {

            // Validate text length and truncate if needed
            let finalText: String
            if text.count > Self.maxTextLength {
                print("⚠️ Text parameter exceeds maximum length (\(text.count) > \(Self.maxTextLength)). Truncating.")
                finalText = String(text.prefix(Self.maxTextLength))
            } else {
                finalText = text
            }

            // Validate text contains printable characters
            let trimmedText = finalText.trimmingCharacters(in: .whitespacesAndNewlines)
            if !trimmedText.isEmpty {
                invocationText = finalText
                print("📝 Pre-populating with text (\(finalText.count) chars): \(finalText.prefix(50))\(finalText.count > 50 ? "..." : "")")
            } else {
                print("⚠️ Text parameter is empty or whitespace only")
            }
        }

        // Extract and validate theme parameter
        if let themeItem = queryItems.first(where: { $0.name == "theme" }),
           let themeRaw = themeItem.value {

            guard let themeType = ThemeType(rawValue: themeRaw) else {
                print("⚠️ Invalid theme value: '\(themeRaw)'. Available: \(ThemeType.allCases.map { $0.rawValue }.joined(separator: ", "))")
                return
            }

            settings.themeType = themeType
            print("🎨 Setting theme: \(themeRaw)")
        }
    }
}
