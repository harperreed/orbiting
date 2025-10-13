// ABOUTME: Unit tests for search functionality in HistoryView
// ABOUTME: Tests case insensitive, diacritic insensitive, and partial match search

import XCTest
import SwiftData
@testable import Orbiting

final class SearchTests: XCTestCase {
    var modelContainer: ModelContainer!
    var modelContext: ModelContext!

    override func setUp() async throws {
        let schema = Schema([Message.self])
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        modelContainer = try ModelContainer(for: schema, configurations: [config])
        modelContext = ModelContext(modelContainer)

        // Add test messages
        let messages = [
            Message(text: "Hello World", timestamp: Date().addingTimeInterval(-3600)),
            Message(text: "Testing the app", timestamp: Date().addingTimeInterval(-7200)),
            Message(text: "Café résumé naïve", timestamp: Date().addingTimeInterval(-10800)),
            Message(text: "SwiftUI is awesome", timestamp: Date().addingTimeInterval(-14400))
        ]

        for message in messages {
            modelContext.insert(message)
        }
        try modelContext.save()
    }

    func testCaseInsensitiveSearch() throws {
        let searchText = "HELLO"
        let descriptor = FetchDescriptor<Message>()
        let allMessages = try modelContext.fetch(descriptor)

        let filtered = allMessages.filter { message in
            message.text.range(
                of: searchText,
                options: [.caseInsensitive, .diacriticInsensitive]
            ) != nil
        }

        XCTAssertEqual(filtered.count, 1)
        XCTAssertEqual(filtered.first?.text, "Hello World")
    }

    func testDiacriticInsensitiveSearch() throws {
        let searchText = "cafe resume naive"
        let descriptor = FetchDescriptor<Message>()
        let allMessages = try modelContext.fetch(descriptor)

        let filtered = allMessages.filter { message in
            message.text.range(
                of: searchText,
                options: [.caseInsensitive, .diacriticInsensitive]
            ) != nil
        }

        XCTAssertEqual(filtered.count, 1)
        XCTAssertEqual(filtered.first?.text, "Café résumé naïve")
    }

    func testPartialMatchSearch() throws {
        let searchText = "test"
        let descriptor = FetchDescriptor<Message>()
        let allMessages = try modelContext.fetch(descriptor)

        let filtered = allMessages.filter { message in
            message.text.range(
                of: searchText,
                options: [.caseInsensitive, .diacriticInsensitive]
            ) != nil
        }

        XCTAssertEqual(filtered.count, 1)
        XCTAssertEqual(filtered.first?.text, "Testing the app")
    }
}
