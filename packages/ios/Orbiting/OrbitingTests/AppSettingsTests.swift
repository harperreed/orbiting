import XCTest
@testable import Orbiting

final class AppSettingsTests: XCTestCase {

    func testDefaultSettings() {
        let settings = AppSettings()

        XCTAssertEqual(settings.languageCode, "en")
        XCTAssertEqual(settings.themeType, .mono)
        XCTAssertEqual(settings.colorSchemeRaw, "system")
        XCTAssertEqual(settings.startFont, 24)
        XCTAssertEqual(settings.shakeAction, .none)
    }

    func testThemeTypeConversion() {
        let settings = AppSettings()

        settings.themeType = .neon
        XCTAssertEqual(settings.themeTypeRaw, "neon")

        settings.themeTypeRaw = "candy"
        XCTAssertEqual(settings.themeType, .candy)
    }

    func testShakeActionConversion() {
        let settings = AppSettings()

        settings.shakeAction = .clear
        XCTAssertEqual(settings.shakeActionRaw, "clear")

        settings.shakeActionRaw = "flash"
        XCTAssertEqual(settings.shakeAction, .flash)
    }

    func testResetToDefaults() {
        let settings = AppSettings()

        // Change settings
        settings.languageCode = "es"
        settings.themeType = .neon
        settings.startFont = 40

        // Reset
        settings.resetToDefaults()

        // Verify defaults
        XCTAssertEqual(settings.languageCode, "en")
        XCTAssertEqual(settings.themeType, .mono)
        XCTAssertEqual(settings.startFont, 24)
    }
}
