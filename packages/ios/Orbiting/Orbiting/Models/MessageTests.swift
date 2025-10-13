import XCTest
import SwiftData
@testable import Orbiting

final class MessageTests: XCTestCase {
    var modelContainer: ModelContainer!
    var modelContext: ModelContext!

    override func setUp() async throws {
        let schema = Schema([Message.self])
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        modelContainer = try ModelContainer(for: schema, configurations: [config])
        modelContext = ModelContext(modelContainer)
    }

    func testMessageCreation() throws {
        let message = Message(text: "Hello")

        XCTAssertNotNil(message.id)
        XCTAssertEqual(message.text, "Hello")
        XCTAssertFalse(message.isFavorite)
        XCTAssertNotNil(message.timestamp)
    }

    func testMessagePersistence() throws {
        let message = Message(text: "Test message")
        modelContext.insert(message)
        try modelContext.save()

        let descriptor = FetchDescriptor<Message>()
        let fetched = try modelContext.fetch(descriptor)

        XCTAssertEqual(fetched.count, 1)
        XCTAssertEqual(fetched.first?.text, "Test message")
    }
}
