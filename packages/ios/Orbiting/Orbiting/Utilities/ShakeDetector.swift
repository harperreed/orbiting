// ABOUTME: Shake detection using CoreMotion accelerometer data
// ABOUTME: Uses RMS threshold detection over a rolling time window

import Foundation
import CoreMotion

class ShakeDetector {
    // MARK: - Properties
    private let motionManager = CMMotionManager()
    private let operationQueue = OperationQueue()
    private(set) var isRunning = false

    // Shake detection parameters
    private let shakeThreshold: Double = 2.5  // RMS acceleration threshold
    private let windowSize: Int = 10           // Number of samples in rolling window
    private let shakeDuration: TimeInterval = 0.5  // Minimum shake duration

    // Rolling window for acceleration samples
    private var accelerationWindow: [Double] = []
    private var isShaking = false
    private var shakeStartTime: Date?

    // Callbacks
    var onShakeStart: (() -> Void)?
    var onShakeStop: (() -> Void)?

    // MARK: - Initialization
    init() {
        operationQueue.maxConcurrentOperationCount = 1
        operationQueue.name = "com.orbiting.shakedetector"
    }

    // MARK: - Public Methods
    func start() {
        guard !isRunning else { return }

        isRunning = true
        accelerationWindow.removeAll()
        isShaking = false
        shakeStartTime = nil

        #if targetEnvironment(simulator)
        // On simulator, accelerometer is not available but we still mark as running for testing
        #else
        guard motionManager.isAccelerometerAvailable else {
            print("Accelerometer not available")
            isRunning = false
            return
        }

        motionManager.accelerometerUpdateInterval = 0.1  // 10 Hz update rate
        motionManager.startAccelerometerUpdates(to: operationQueue) { [weak self] data, error in
            guard let self = self, let data = data else { return }

            if let error = error {
                print("Accelerometer error: \(error.localizedDescription)")
                return
            }

            self.processAccelerometerData(data)
        }
        #endif
    }

    func stop() {
        guard isRunning else { return }

        isRunning = false
        motionManager.stopAccelerometerUpdates()
        accelerationWindow.removeAll()

        if isShaking {
            isShaking = false
            DispatchQueue.main.async { [weak self] in
                self?.onShakeStop?()
            }
        }
    }

    // MARK: - Private Methods
    private func processAccelerometerData(_ data: CMAccelerometerData) {
        let acceleration = data.acceleration
        processAcceleration(x: acceleration.x, y: acceleration.y, z: acceleration.z)
    }

    private func processAcceleration(x: Double, y: Double, z: Double) {
        // Calculate magnitude of acceleration vector (subtract gravity)
        let magnitude = sqrt(
            pow(x, 2) +
            pow(y, 2) +
            pow(z, 2)
        ) - 1.0  // Subtract 1g for gravity

        // Add to rolling window
        accelerationWindow.append(abs(magnitude))
        if accelerationWindow.count > windowSize {
            accelerationWindow.removeFirst()
        }

        // Calculate RMS (Root Mean Square) of window
        guard accelerationWindow.count == windowSize else { return }

        let sumOfSquares = accelerationWindow.reduce(0.0) { $0 + pow($1, 2) }
        let rms = sqrt(sumOfSquares / Double(windowSize))

        // Detect shake
        if rms > shakeThreshold {
            if !isShaking {
                // Shake started
                isShaking = true
                shakeStartTime = Date()
                DispatchQueue.main.async { [weak self] in
                    self?.onShakeStart?()
                }
            }
        } else {
            if isShaking {
                // Check if shake duration met
                if let startTime = shakeStartTime,
                   Date().timeIntervalSince(startTime) >= shakeDuration {
                    // Shake stopped
                    isShaking = false
                    shakeStartTime = nil
                    DispatchQueue.main.async { [weak self] in
                        self?.onShakeStop?()
                    }
                }
            }
        }
    }

    // MARK: - Testing Support
    #if DEBUG
    func simulateShake() {
        guard isRunning else { return }

        // Simulate shake by injecting high acceleration values
        let highAcceleration = 3.0

        // Simulate shake start
        for _ in 0..<windowSize {
            processAcceleration(x: highAcceleration, y: highAcceleration, z: highAcceleration)
        }

        // Wait for shake duration
        DispatchQueue.global().asyncAfter(deadline: .now() + shakeDuration + 0.2) { [weak self] in
            guard let self = self else { return }

            // Simulate shake stop (low acceleration)
            for _ in 0..<self.windowSize {
                self.processAcceleration(x: 0.1, y: 0.1, z: 0.1)
            }
        }
    }
    #endif

    deinit {
        stop()
    }
}
