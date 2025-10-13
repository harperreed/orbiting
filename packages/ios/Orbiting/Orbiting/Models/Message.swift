// ABOUTME: SwiftData model for storing messages with text, timestamp, and favorite status
// ABOUTME: Used for persisting message history locally on device

import Foundation
import SwiftData

@Model
final class Message {
    @Attribute(.unique) var id: String
    var text: String
    var timestamp: Date
    var isFavorite: Bool

    init(id: String = UUID().uuidString, text: String, timestamp: Date = .now, isFavorite: Bool = false) {
        self.id = id
        self.text = text
        self.timestamp = timestamp
        self.isFavorite = isFavorite
    }
}
