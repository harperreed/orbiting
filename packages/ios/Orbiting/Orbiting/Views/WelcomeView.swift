// ABOUTME: First-launch welcome screen with app introduction and gesture guide
// ABOUTME: Shows once on initial app launch, dismissible with Get Started button

import SwiftUI

struct WelcomeView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Hero graphic section
                    VStack(spacing: 16) {
                        // Try to use custom image first, fallback to SF Symbol
                        if let _ = UIImage(named: "WelcomeHero") {
                            Image("WelcomeHero")
                                .resizable()
                                .scaledToFit()
                                .frame(maxHeight: 150)
                                .frame(maxWidth: .infinity)
                        } else {
                            // Fallback to SF Symbol
                            Image(systemName: "bubble.left.and.bubble.right.fill")
                                .font(.system(size: 80))
                                .foregroundStyle(.blue.gradient)
                                .frame(maxWidth: .infinity)
                        }
                    }
                    .padding(.top)

                    // Welcome header
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Welcome to Orbiting")
                            .font(.largeTitle)
                            .fontWeight(.bold)

                        Text("A simple messaging app for your eyeballs. Type and display messages loud and clear to those around you.")
                            .font(.body)
                            .foregroundStyle(.secondary)
                    }

                    Divider()

                    // How to use section
                    VStack(alignment: .leading, spacing: 16) {
                        Text("How to Use")
                            .font(.title2)
                            .fontWeight(.semibold)

                        Text("Tap anywhere and start typing. Your message will display loud and clear!")
                            .font(.body)

                        // Gesture guide
                        VStack(alignment: .leading, spacing: 12) {
                            GestureRow(icon: "arrow.left", text: "Swipe left to clear")
                            GestureRow(icon: "arrow.up", text: "Swipe up or right for history")
                            GestureRow(icon: "gearshape", text: "Tap the gear icon for settings")
                        }
                    }

                    Divider()

                    // About section
                    VStack(alignment: .leading, spacing: 12) {
                        Text("About Orbiting")
                            .font(.title2)
                            .fontWeight(.semibold)

                        Text("Created by Christine Sun Kim and Harper Reed. Inspired by the need to communicate with people in the same space, but with different communication needs.")
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

                    Spacer(minLength: 40)
                }
                .padding()
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .bottomBar) {
                    Button(action: { dismiss() }) {
                        Text("Get Started")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.accentColor)
                            .foregroundColor(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                    .padding()
                }
            }
        }
    }
}

struct GestureRow: View {
    let icon: String
    let text: String

    var body: some View {
        HStack(spacing: 16) {
            Image(systemName: icon)
                .font(.system(size: 32))
                .foregroundStyle(.blue.gradient)
                .frame(width: 44, height: 44)
                .background(
                    Circle()
                        .fill(.blue.opacity(0.1))
                )

            Text(text)
                .font(.body)
        }
    }
}

#Preview {
    WelcomeView()
}
