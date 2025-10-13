import XCTest
@testable import Orbiting

final class TextFitterTests: XCTestCase {

    func testEmptyTextReturnsMinimum() {
        let size = TextFitter.bestFontSize(
            text: "",
            targetSize: CGSize(width: 300, height: 500),
            min: 16,
            max: 200
        )
        XCTAssertEqual(size, 16)
    }

    func testZeroViewportReturnsMinimum() {
        let size = TextFitter.bestFontSize(
            text: "Hello",
            targetSize: CGSize(width: 0, height: 0),
            min: 16,
            max: 200
        )
        XCTAssertEqual(size, 16)
    }

    func testShortTextFitsLarge() {
        let size = TextFitter.bestFontSize(
            text: "Hi",
            targetSize: CGSize(width: 400, height: 800),
            min: 16,
            max: 512
        )
        // Short text should get large font
        XCTAssertGreaterThan(size, 200)
    }

    func testLongTextFitsSmaller() {
        let longText = String(repeating: "This is a long message. ", count: 10)
        let size = TextFitter.bestFontSize(
            text: longText,
            targetSize: CGSize(width: 400, height: 800),
            min: 16,
            max: 512
        )
        // Long text should get smaller font
        XCTAssertLessThan(size, 100)
    }

    func testPerformance() {
        let text = "This is a medium length message for performance testing"
        let targetSize = CGSize(width: 375, height: 667)

        measure {
            _ = TextFitter.bestFontSize(text: text, targetSize: targetSize)
        }
        // Should complete in < 16ms for 60fps
    }
}
