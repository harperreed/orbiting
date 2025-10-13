// ABOUTME: Full-featured history view with search, favorites, delete, and clear all functionality
// ABOUTME: Uses SwiftData @Query for reactive message list with case/diacritic insensitive search

import SwiftUI
import SwiftData

struct HistoryView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @Query(sort: \Message.timestamp, order: .reverse) private var allMessages: [Message]

    @State private var searchText: String = ""
    @State private var showFavoritesOnly: Bool = false
    @State private var showingClearAlert: Bool = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Search bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundStyle(.secondary)

                    TextField("Search messages", text: $searchText)
                        .textFieldStyle(.plain)
                        .autocorrectionDisabled()

                    if !searchText.isEmpty {
                        Button {
                            searchText = ""
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundStyle(.secondary)
                        }
                    }
                }
                .padding(8)
                .background(Color(.systemGray6))
                .cornerRadius(10)
                .padding(.horizontal)
                .padding(.vertical, 8)

                // Favorites toggle
                Toggle(isOn: $showFavoritesOnly) {
                    Label("Favorites Only", systemImage: "star.fill")
                }
                .padding(.horizontal)
                .padding(.bottom, 8)

                Divider()

                // Message list
                if filteredMessages.isEmpty {
                    ContentUnavailableView {
                        Label("No Messages", systemImage: "message")
                    } description: {
                        Text(searchText.isEmpty ? "Your message history will appear here" : "No messages match your search")
                    }
                } else {
                    List {
                        ForEach(filteredMessages) { message in
                            MessageRow(message: message, onSelect: { text in
                                UIPasteboard.general.string = text
                                dismiss()
                            })
                        }
                        .onDelete(perform: deleteMessages)
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("History")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Menu {
                        NavigationLink("Help") {
                            HelpView()
                        }
                        NavigationLink("About") {
                            AboutView()
                        }
                    } label: {
                        Image(systemName: "info.circle")
                    }
                }

                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") {
                        dismiss()
                    }
                }

                ToolbarItem(placement: .primaryAction) {
                    Button(role: .destructive) {
                        showingClearAlert = true
                    } label: {
                        Label("Clear All", systemImage: "trash")
                    }
                    .disabled(allMessages.isEmpty)
                }
            }
            .alert("Clear All History?", isPresented: $showingClearAlert) {
                Button("Cancel", role: .cancel) {}
                Button("Clear All", role: .destructive) {
                    clearAllMessages()
                }
            } message: {
                Text("This will permanently delete all \(allMessages.count) messages from your history.")
            }
        }
    }

    // Filtered messages based on search and favorites
    private var filteredMessages: [Message] {
        var filtered = allMessages

        // Apply favorites filter
        if showFavoritesOnly {
            filtered = filtered.filter { $0.isFavorite }
        }

        // Apply search filter (case and diacritic insensitive)
        if !searchText.isEmpty {
            filtered = filtered.filter { message in
                message.text.range(
                    of: searchText,
                    options: [.caseInsensitive, .diacriticInsensitive]
                ) != nil
            }
        }

        return filtered
    }

    // Delete specific messages
    private func deleteMessages(at offsets: IndexSet) {
        for index in offsets {
            let message = filteredMessages[index]
            modelContext.delete(message)
        }
        try? modelContext.save()
    }

    // Clear all messages from history
    private func clearAllMessages() {
        for message in allMessages {
            modelContext.delete(message)
        }
        try? modelContext.save()
    }
}

// Individual message row with favorite toggle and tap to copy
struct MessageRow: View {
    @Bindable var message: Message
    let onSelect: (String) -> Void

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Button {
                message.isFavorite.toggle()
            } label: {
                Image(systemName: message.isFavorite ? "star.fill" : "star")
                    .foregroundStyle(message.isFavorite ? .yellow : .secondary)
                    .font(.title3)
            }
            .buttonStyle(.plain)

            VStack(alignment: .leading, spacing: 4) {
                Text(message.text)
                    .font(.body)
                    .foregroundStyle(.primary)

                Text(message.timestamp, style: .relative)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Spacer()
        }
        .padding(.vertical, 4)
        .contentShape(Rectangle())
        .onTapGesture {
            onSelect(message.text)
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(Text("\(message.text). \(message.isFavorite ? "Favorited. " : "")From \(message.timestamp, style: .relative)"))
        .accessibilityHint(Text("Tap to copy to clipboard. Double tap star to toggle favorite."))
    }
}

#Preview {
    let config = ModelConfiguration(isStoredInMemoryOnly: true)
    let container = try! ModelContainer(for: Message.self, configurations: config)

    // Add sample data
    let messages = [
        Message(text: "Hello World", timestamp: Date().addingTimeInterval(-3600), isFavorite: true),
        Message(text: "Testing the app", timestamp: Date().addingTimeInterval(-7200)),
        Message(text: "SwiftUI is awesome", timestamp: Date().addingTimeInterval(-10800), isFavorite: true),
        Message(text: "Another message here", timestamp: Date().addingTimeInterval(-14400))
    ]

    for message in messages {
        container.mainContext.insert(message)
    }

    return HistoryView()
        .modelContainer(container)
}
