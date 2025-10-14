// ABOUTME: Root view managing color scheme override and settings state
// ABOUTME: Wraps HomeView with theme and color scheme preferences

import SwiftUI
import SwiftData

struct RootView: View {
    @Environment(\.colorScheme) private var systemScheme
    @Environment(\.modelContext) private var modelContext
    let settings: AppSettings

    var effectiveScheme: ColorScheme? {
        switch settings.colorSchemeRaw {
        case "light": return .light
        case "dark": return .dark
        default: return nil
        }
    }

    var body: some View {
        NavigationStack {
            HomeView(settings: settings)
        }
        .preferredColorScheme(effectiveScheme)
        .onAppear {
            // Migrate App Clip data if user upgraded from App Clip (main app only)
            // Only run in main app, not in App Clip
            if !StorageManager.isRunningInAppClip {
                performMigrationIfAvailable()
            }
        }
    }

    private func performMigrationIfAvailable() {
        // Migrate App Clip data to main app if this is first launch after upgrade
        SharedDataMigration.migrateIfNeeded(context: modelContext)
    }
}
