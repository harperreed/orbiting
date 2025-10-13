// ABOUTME: Observable settings model with AppStorage persistence
// ABOUTME: Manages user preferences for language, theme, font size, and shake behavior

import Foundation
import SwiftUI
import Observation

/// Theme types from the spec
enum ThemeType: String, CaseIterable, Identifiable {
    case mono, contrast, neon, candy, classic, sunset, forest, ocean, mint
    var id: String { rawValue }
}

/// What shaking does
enum ShakeAction: String, CaseIterable, Identifiable {
    case none, clear, flash
    var id: String { rawValue }
}

@Observable
final class AppSettings {
    @ObservationIgnored @AppStorage("languageCode") var languageCode: String = "en"
    @ObservationIgnored @AppStorage("themeType") var themeTypeRaw: String = ThemeType.mono.rawValue
    @ObservationIgnored @AppStorage("colorScheme") var colorSchemeRaw: String = "system"
    @ObservationIgnored @AppStorage("startFont") var startFont: Double = 24
    @ObservationIgnored @AppStorage("shakeAction") var shakeActionRaw: String = ShakeAction.none.rawValue

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
