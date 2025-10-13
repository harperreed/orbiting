// ABOUTME: About screen showing app name, purpose, version, and credits
// ABOUTME: Simple VStack layout with informational text

import SwiftUI

struct AboutView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Orbiting")
                .font(.largeTitle)
                .bold()

            Text("Ultra-legible nearby messaging")
                .font(.title3)
                .foregroundColor(.secondary)

            Divider()
                .padding(.vertical, 8)

            Text("Purpose")
                .font(.headline)
            Text("Display messages in the largest possible text to communicate across distances or in noisy environments.")

            Divider()
                .padding(.vertical, 8)

            Text("Version")
                .font(.headline)
            Text("1.0.0")

            Divider()
                .padding(.vertical, 8)

            Text("Credits")
                .font(.headline)
            Text("Built with SwiftUI and SwiftData")
            Text("© 2025")

            Spacer()
        }
        .padding()
        .navigationTitle("About")
    }
}
