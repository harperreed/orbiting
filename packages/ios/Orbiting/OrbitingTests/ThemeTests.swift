import XCTest
import SwiftUI
@testable import Orbiting

final class ThemeTests: XCTestCase {

    func testThemeHasLightAndDarkVariants() {
        let themes: [ThemeType] = [.mono, .contrast, .neon, .candy, .classic, .sunset, .forest, .ocean, .mint]

        for themeType in themes {
            let lightTheme = themeType.theme(for: .light)
            let darkTheme = themeType.theme(for: .dark)

            XCTAssertNotNil(lightTheme, "\(themeType) should have a light variant")
            XCTAssertNotNil(darkTheme, "\(themeType) should have a dark variant")
            XCTAssertNotEqual(lightTheme.background, darkTheme.background, "\(themeType) light and dark backgrounds should differ")
        }
    }

    func testThemeContainsRequiredColors() {
        let theme = ThemeType.mono.theme(for: .light)

        // Verify all required color properties exist
        XCTAssertNotNil(theme.background)
        XCTAssertNotNil(theme.text)
        XCTAssertNotNil(theme.primary)
        XCTAssertNotNil(theme.secondary)
        XCTAssertNotNil(theme.accent)
    }

    func testAllThemesHaveAccessibleContrast() {
        let themes: [ThemeType] = [.mono, .contrast, .neon, .candy, .classic, .sunset, .forest, .ocean, .mint]
        let colorSchemes: [ColorScheme] = [.light, .dark]

        for themeType in themes {
            for scheme in colorSchemes {
                let theme = themeType.theme(for: scheme)

                // Test that text has sufficient contrast with background
                // WCAG AA requires 4.5:1 for normal text
                let contrast = calculateContrastRatio(theme.text, theme.background)
                XCTAssertGreaterThanOrEqual(contrast, 4.5,
                    "\(themeType) \(scheme) text contrast ratio should be at least 4.5:1 (got \(contrast))")
            }
        }
    }

    // Helper function to calculate contrast ratio
    private func calculateContrastRatio(_ color1: Color, _ color2: Color) -> Double {
        let l1 = relativeLuminance(color1)
        let l2 = relativeLuminance(color2)
        let lighter = max(l1, l2)
        let darker = min(l1, l2)
        return (lighter + 0.05) / (darker + 0.05)
    }

    private func relativeLuminance(_ color: Color) -> Double {
        // Convert Color to RGB components
        let uiColor = UIColor(color)
        var red: CGFloat = 0
        var green: CGFloat = 0
        var blue: CGFloat = 0
        var alpha: CGFloat = 0

        uiColor.getRed(&red, green: &green, blue: &blue, alpha: &alpha)

        // Apply gamma correction
        let r = red <= 0.03928 ? red / 12.92 : pow((red + 0.055) / 1.055, 2.4)
        let g = green <= 0.03928 ? green / 12.92 : pow((green + 0.055) / 1.055, 2.4)
        let b = blue <= 0.03928 ? blue / 12.92 : pow((blue + 0.055) / 1.055, 2.4)

        // Calculate relative luminance
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
}
