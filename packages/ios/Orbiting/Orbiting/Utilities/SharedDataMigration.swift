// ABOUTME: Handles data migration from App Clip to main app during upgrade
// ABOUTME: Imports messages from shared App Group container on first launch

import Foundation
import SwiftData

class SharedDataMigration {
    private static let migrationCompleteKey = "AppClipDataMigrationComplete"

    /// Checks if migration already completed
    static var hasMigrated: Bool {
        UserDefaults.standard.bool(forKey: migrationCompleteKey)
    }

    /// Marks migration as complete
    static func markMigrationComplete() {
        UserDefaults.standard.set(true, forKey: migrationCompleteKey)
    }

    /// Migrates App Clip data to main app if needed
    static func migrateIfNeeded(context: ModelContext) {
        // Skip if already migrated
        guard !hasMigrated else {
            print("✅ App Clip migration already complete, skipping")
            return
        }

        // Skip if no shared container
        guard let sharedURL = StorageManager.sharedContainerURL else {
            print("⚠️ No shared container URL found")
            markMigrationComplete()
            return
        }

        print("🔄 Checking for App Clip data to migrate...")

        // Check if App Clip store exists
        let storeURL = sharedURL.appending(path: "default.store")
        guard FileManager.default.fileExists(atPath: storeURL.path()) else {
            print("ℹ️ No App Clip data found, marking migration complete")
            markMigrationComplete()
            return
        }

        do {
            // Open App Clip's store
            let configuration = ModelConfiguration(url: storeURL)
            let schema = Schema([Message.self])
            let container = try ModelContainer(for: schema, configurations: configuration)
            let clipContext = ModelContext(container)

            // Fetch all messages from App Clip store
            let descriptor = FetchDescriptor<Message>(sortBy: [SortDescriptor(\.timestamp, order: .reverse)])
            let clipMessages = try clipContext.fetch(descriptor)

            guard !clipMessages.isEmpty else {
                print("ℹ️ App Clip store empty, marking migration complete")
                markMigrationComplete()
                return
            }

            print("📦 Found \(clipMessages.count) messages to migrate")

            // Import into main app store
            var importedCount = 0
            for message in clipMessages {
                let newMessage = Message(
                    text: message.text,
                    timestamp: message.timestamp,
                    isFavorite: message.isFavorite
                )
                context.insert(newMessage)
                importedCount += 1
            }

            try context.save()

            print("✅ Migrated \(importedCount) messages from App Clip")

            // Mark migration complete
            markMigrationComplete()

        } catch {
            print("⚠️ Migration failed: \(error)")
            // Don't mark complete so we retry next launch
        }
    }
}
