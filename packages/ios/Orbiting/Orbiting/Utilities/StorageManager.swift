// ABOUTME: Detects App Clip context and provides shared container configuration
// ABOUTME: Used by both main app and App Clip to determine storage location

import Foundation
import SwiftData

class StorageManager {
    /// Returns true if running in App Clip, false if running in main app
    static var isRunningInAppClip: Bool {
        guard let bundleID = Bundle.main.bundleIdentifier else { return false }
        return bundleID.contains(".Clip")
    }

    /// Returns the URL for the shared App Group container
    static var sharedContainerURL: URL? {
        FileManager.default.containerURL(
            forSecurityApplicationGroupIdentifier: "group.com.harperrules.Orbiting"
        )
    }

    /// Returns the URL for SwiftData store in shared container
    static var sharedStoreURL: URL? {
        sharedContainerURL?.appending(path: "default.store")
    }
}
