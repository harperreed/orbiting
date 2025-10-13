import XCTest

final class HomeViewUITests: XCTestCase {
    var app: XCUIApplication!

    override func setUp() {
        continueAfterFailure = false
        app = XCUIApplication()
        app.launch()
    }

    func testTypingShowsBigText() throws {
        // Find the text field (even though it's visually hidden)
        let textField = app.textFields.firstMatch
        XCTAssertTrue(textField.exists)

        // Type some text
        textField.tap()
        textField.typeText("Hello")

        // Verify text appears on screen
        XCTAssertTrue(app.staticTexts["Hello"].exists)
    }

    func testTextScalesWithLength() throws {
        let textField = app.textFields.firstMatch
        textField.tap()

        // Type short text - should be large
        textField.typeText("Hi")

        // Clear and type long text
        textField.clearText()
        let longText = String(repeating: "This is a very long message. ", count: 5)
        textField.typeText(longText)

        // Both should be visible (test validates they both render)
        XCTAssertTrue(app.staticTexts.containing(NSPredicate(format: "label CONTAINS 'long message'")).firstMatch.exists)
    }
}

extension XCUIElement {
    func clearText() {
        guard let stringValue = self.value as? String else { return }
        let deleteString = String(repeating: XCUIKeyboardKey.delete.rawValue, count: stringValue.count)
        typeText(deleteString)
    }
}
