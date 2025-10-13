// ABOUTME: Defines theme color palettes with light and dark variants
// ABOUTME: Each theme provides accessibility-compliant colors with proper contrast ratios

import SwiftUI

/// A complete theme palette with colors for all UI elements
struct AppTheme {
    let background: Color
    let text: Color
    let primary: Color
    let secondary: Color
    let accent: Color
}

extension ThemeType {
    /// Returns the theme palette for the specified color scheme
    func theme(for colorScheme: ColorScheme) -> AppTheme {
        switch colorScheme {
        case .light:
            return lightTheme()
        case .dark:
            return darkTheme()
        @unknown default:
            return lightTheme()
        }
    }

    private func lightTheme() -> AppTheme {
        switch self {
        case .mono:
            return AppTheme(
                background: Color(red: 0.98, green: 0.98, blue: 0.98),
                text: Color(red: 0.15, green: 0.15, blue: 0.15),
                primary: Color(red: 0.20, green: 0.20, blue: 0.20),
                secondary: Color(red: 0.50, green: 0.50, blue: 0.50),
                accent: Color(red: 0.30, green: 0.30, blue: 0.30)
            )
        case .contrast:
            return AppTheme(
                background: Color.white,
                text: Color.black,
                primary: Color.black,
                secondary: Color(red: 0.30, green: 0.30, blue: 0.30),
                accent: Color.black
            )
        case .neon:
            return AppTheme(
                background: Color(red: 0.95, green: 0.95, blue: 0.98),
                text: Color(red: 0.10, green: 0.10, blue: 0.20),
                primary: Color(red: 0.60, green: 0.00, blue: 0.90),
                secondary: Color(red: 0.00, green: 0.90, blue: 0.90),
                accent: Color(red: 1.00, green: 0.00, blue: 0.80)
            )
        case .candy:
            return AppTheme(
                background: Color(red: 1.00, green: 0.95, blue: 0.97),
                text: Color(red: 0.30, green: 0.10, blue: 0.20),
                primary: Color(red: 0.90, green: 0.20, blue: 0.50),
                secondary: Color(red: 0.70, green: 0.40, blue: 0.80),
                accent: Color(red: 1.00, green: 0.50, blue: 0.70)
            )
        case .classic:
            return AppTheme(
                background: Color(red: 0.96, green: 0.95, blue: 0.93),
                text: Color(red: 0.20, green: 0.18, blue: 0.16),
                primary: Color(red: 0.25, green: 0.35, blue: 0.55),
                secondary: Color(red: 0.45, green: 0.40, blue: 0.35),
                accent: Color(red: 0.70, green: 0.25, blue: 0.25)
            )
        case .sunset:
            return AppTheme(
                background: Color(red: 1.00, green: 0.97, blue: 0.92),
                text: Color(red: 0.25, green: 0.15, blue: 0.10),
                primary: Color(red: 0.85, green: 0.35, blue: 0.15),
                secondary: Color(red: 0.90, green: 0.60, blue: 0.30),
                accent: Color(red: 0.95, green: 0.45, blue: 0.25)
            )
        case .forest:
            return AppTheme(
                background: Color(red: 0.95, green: 0.97, blue: 0.93),
                text: Color(red: 0.15, green: 0.25, blue: 0.15),
                primary: Color(red: 0.20, green: 0.50, blue: 0.30),
                secondary: Color(red: 0.40, green: 0.55, blue: 0.35),
                accent: Color(red: 0.55, green: 0.70, blue: 0.30)
            )
        case .ocean:
            return AppTheme(
                background: Color(red: 0.94, green: 0.97, blue: 0.98),
                text: Color(red: 0.10, green: 0.20, blue: 0.30),
                primary: Color(red: 0.15, green: 0.45, blue: 0.70),
                secondary: Color(red: 0.30, green: 0.60, blue: 0.75),
                accent: Color(red: 0.00, green: 0.65, blue: 0.85)
            )
        case .mint:
            return AppTheme(
                background: Color(red: 0.95, green: 0.98, blue: 0.96),
                text: Color(red: 0.15, green: 0.30, blue: 0.25),
                primary: Color(red: 0.20, green: 0.65, blue: 0.55),
                secondary: Color(red: 0.40, green: 0.75, blue: 0.65),
                accent: Color(red: 0.30, green: 0.85, blue: 0.70)
            )
        }
    }

    private func darkTheme() -> AppTheme {
        switch self {
        case .mono:
            return AppTheme(
                background: Color(red: 0.12, green: 0.12, blue: 0.12),
                text: Color(red: 0.92, green: 0.92, blue: 0.92),
                primary: Color(red: 0.85, green: 0.85, blue: 0.85),
                secondary: Color(red: 0.60, green: 0.60, blue: 0.60),
                accent: Color(red: 0.75, green: 0.75, blue: 0.75)
            )
        case .contrast:
            return AppTheme(
                background: Color.black,
                text: Color.white,
                primary: Color.white,
                secondary: Color(red: 0.80, green: 0.80, blue: 0.80),
                accent: Color.white
            )
        case .neon:
            return AppTheme(
                background: Color(red: 0.08, green: 0.08, blue: 0.12),
                text: Color(red: 0.90, green: 0.90, blue: 0.95),
                primary: Color(red: 0.80, green: 0.30, blue: 1.00),
                secondary: Color(red: 0.30, green: 1.00, blue: 1.00),
                accent: Color(red: 1.00, green: 0.30, blue: 0.90)
            )
        case .candy:
            return AppTheme(
                background: Color(red: 0.15, green: 0.08, blue: 0.12),
                text: Color(red: 0.95, green: 0.85, blue: 0.90),
                primary: Color(red: 1.00, green: 0.40, blue: 0.70),
                secondary: Color(red: 0.85, green: 0.55, blue: 0.90),
                accent: Color(red: 1.00, green: 0.60, blue: 0.80)
            )
        case .classic:
            return AppTheme(
                background: Color(red: 0.12, green: 0.11, blue: 0.10),
                text: Color(red: 0.90, green: 0.88, blue: 0.85),
                primary: Color(red: 0.50, green: 0.65, blue: 0.85),
                secondary: Color(red: 0.65, green: 0.60, blue: 0.55),
                accent: Color(red: 0.90, green: 0.45, blue: 0.45)
            )
        case .sunset:
            return AppTheme(
                background: Color(red: 0.12, green: 0.08, blue: 0.06),
                text: Color(red: 0.95, green: 0.90, blue: 0.85),
                primary: Color(red: 0.95, green: 0.50, blue: 0.30),
                secondary: Color(red: 0.95, green: 0.70, blue: 0.45),
                accent: Color(red: 1.00, green: 0.60, blue: 0.40)
            )
        case .forest:
            return AppTheme(
                background: Color(red: 0.08, green: 0.12, blue: 0.08),
                text: Color(red: 0.88, green: 0.92, blue: 0.85),
                primary: Color(red: 0.40, green: 0.75, blue: 0.55),
                secondary: Color(red: 0.55, green: 0.70, blue: 0.50),
                accent: Color(red: 0.70, green: 0.85, blue: 0.50)
            )
        case .ocean:
            return AppTheme(
                background: Color(red: 0.06, green: 0.10, blue: 0.14),
                text: Color(red: 0.85, green: 0.92, blue: 0.95),
                primary: Color(red: 0.35, green: 0.65, blue: 0.85),
                secondary: Color(red: 0.45, green: 0.75, blue: 0.85),
                accent: Color(red: 0.30, green: 0.80, blue: 0.95)
            )
        case .mint:
            return AppTheme(
                background: Color(red: 0.08, green: 0.14, blue: 0.12),
                text: Color(red: 0.88, green: 0.95, blue: 0.92),
                primary: Color(red: 0.40, green: 0.85, blue: 0.75),
                secondary: Color(red: 0.55, green: 0.85, blue: 0.75),
                accent: Color(red: 0.50, green: 0.95, blue: 0.85)
            )
        }
    }
}
