// ABOUTME: App Clip entry point with invocation URL handling
// ABOUTME: Parses URL parameters (text, theme) and configures app accordingly

import SwiftUI
import SwiftData

@main
struct OrbitingClip: App {
    @State private var settings = AppSettings()
    @State private var invocationText: String?

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
        }
        .modelContainer(sharedModelContainer)
    }

    /// Handles App Clip invocation URL parsing
    private func handleInvocation(userActivity: NSUserActivity) {
        guard let url = userActivity.webpageURL else {
            print("⚠️ No webpage URL in user activity")
            return
        }

        print("📱 App Clip invoked with URL: \(url)")

        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: true),
              let host = components.host,
              host == "orbiting.app" else {
            print("⚠️ Invalid App Clip URL host")
            return
        }

        let queryItems = components.queryItems ?? []

        // Extract text parameter
        if let textItem = queryItems.first(where: { $0.name == "text" }),
           let text = textItem.value?.removingPercentEncoding {
            invocationText = text
            print("📝 Pre-populating with text: \(text)")
        }

        // Extract theme parameter
        if let themeItem = queryItems.first(where: { $0.name == "theme" }),
           let themeRaw = themeItem.value,
           let themeType = ThemeType(rawValue: themeRaw) {
            settings.themeType = themeType
            print("🎨 Setting theme: \(themeRaw)")
        }
    }
}
