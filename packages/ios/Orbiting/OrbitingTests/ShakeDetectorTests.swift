// ABOUTME: Test suite for shake detection functionality
// ABOUTME: Validates shake start/stop callbacks and basic lifecycle

import XCTest
@testable import Orbiting

final class ShakeDetectorTests: XCTestCase {
    var shakeDetector: ShakeDetector!

    override func setUp() async throws {
        shakeDetector = ShakeDetector()
    }

    override func tearDown() async throws {
        shakeDetector.stop()
        shakeDetector = nil
    }

    func testShakeDetectorStartStop() throws {
        // Test that detector can start and stop without errors
        shakeDetector.start()
        XCTAssertTrue(shakeDetector.isRunning, "Shake detector should be running after start")

        shakeDetector.stop()
        XCTAssertFalse(shakeDetector.isRunning, "Shake detector should not be running after stop")
    }

    func testShakeDetectorCallbacks() throws {
        let shakeStartExpectation = expectation(description: "Shake start callback")
        let shakeStopExpectation = expectation(description: "Shake stop callback")

        var shakeStartCalled = false
        var shakeStopCalled = false

        shakeDetector.onShakeStart = {
            shakeStartCalled = true
            shakeStartExpectation.fulfill()
        }

        shakeDetector.onShakeStop = {
            shakeStopCalled = true
            shakeStopExpectation.fulfill()
        }

        shakeDetector.start()
        XCTAssertTrue(shakeDetector.isRunning, "Shake detector should be running")

        // Simulate shake by injecting accelerometer data
        shakeDetector.simulateShake()

        wait(for: [shakeStartExpectation, shakeStopExpectation], timeout: 2.0)

        XCTAssertTrue(shakeStartCalled, "Shake start callback should be called")
        XCTAssertTrue(shakeStopCalled, "Shake stop callback should be called")
    }
}
