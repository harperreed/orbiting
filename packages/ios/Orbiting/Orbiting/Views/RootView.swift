// ABOUTME: Root view managing color scheme override and settings state
// ABOUTME: Wraps HomeView with theme and color scheme preferences

import SwiftUI

struct RootView: View {
    @Environment(\.colorScheme) private var systemScheme
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
    }
}
