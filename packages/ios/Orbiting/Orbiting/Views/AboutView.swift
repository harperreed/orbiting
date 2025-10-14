// ABOUTME: About screen showing app creators, inspiration, and feedback link
// ABOUTME: Includes version info and comprehensive app information

import SwiftUI

struct AboutView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // App name and tagline
                VStack(alignment: .leading, spacing: 8) {
                    Text("Orbiting")
                        .font(.largeTitle)
                        .fontWeight(.bold)

                    Text("A simple messaging app for your eyeballs")
                        .font(.title3)
                        .foregroundStyle(.secondary)
                }
                .padding(.top)

                Divider()

                // Purpose section
                VStack(alignment: .leading, spacing: 12) {
                    Text("Purpose")
                        .font(.title2)
                        .fontWeight(.semibold)

                    Text("Display messages loud and clear to communicate with people in the same space.")
                        .font(.body)
                        .foregroundStyle(.secondary)
                }

                Divider()

                // Creators section
                VStack(alignment: .leading, spacing: 12) {
                    Text("Created By")
                        .font(.title2)
                        .fontWeight(.semibold)

                    Text("Christine Sun Kim and Harper Reed")
                        .font(.body)
                }

                Divider()

                // Inspiration section
                VStack(alignment: .leading, spacing: 12) {
                    Text("Inspiration")
                        .font(.title2)
                        .fontWeight(.semibold)

                    Text("Orbiting was inspired by the need to communicate with people in the same space, but with different communication needs.")
                        .font(.body)
                        .foregroundStyle(.secondary)
                }

                Divider()

                // Feedback section
                VStack(alignment: .leading, spacing: 8) {
                    Text("Send Us Feedback")
                        .font(.title2)
                        .fontWeight(.semibold)

                    Text("We want to hear from you!")
                        .font(.body)

                    Link("feedback@orbiting.com", destination: URL(string: "mailto:feedback@orbiting.com")!)
                        .font(.body)
                }

                Divider()

                // Version section
                VStack(alignment: .leading, spacing: 8) {
                    Text("Version")
                        .font(.title2)
                        .fontWeight(.semibold)

                    Text("1.5 (Build 6)")
                        .font(.body)
                        .foregroundStyle(.secondary)

                    Text("© 2025")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                Spacer(minLength: 40)
            }
            .padding()
        }
        .navigationTitle("About")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button("Done") {
                    dismiss()
                }
            }
        }
    }
}
