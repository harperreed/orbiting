import XCTest

final class IntegrationTests: XCTestCase {
    var app: XCUIApplication!

    override func setUp() {
        continueAfterFailure = false
        app = XCUIApplication()
        app.launch()
    }

    func testCompleteUserFlow() throws {
        // Type a message
        let textField = app.textFields.firstMatch
        textField.tap()
        textField.typeText("Hello World")

        // Verify it appears
        XCTAssertTrue(app.staticTexts["Hello World"].exists)

        // Navigate to history (swipe up)
        let canvas = app.otherElements.firstMatch
        canvas.swipeUp()

        // Give navigation time
        sleep(1)

        // Verify history shows the message
        XCTAssertTrue(app.staticTexts["Hello World"].exists)

        // Tap favorite
        let favoriteButton = app.buttons.matching(identifier: "star").firstMatch
        if favoriteButton.exists {
            favoriteButton.tap()
        }

        // Go back (dismiss)
        app.swipeDown()

        // Clear message (swipe left)
        canvas.swipeLeft()

        // Verify cleared
        XCTAssertFalse(app.staticTexts["Hello World"].exists)
    }
}
