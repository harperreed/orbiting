// ABOUTME: Help documentation showing gesture controls, tips, and accessibility info
// ABOUTME: Simple ScrollView with informational text

import SwiftUI

struct HelpView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Group {
                    Text("Gestures")
                        .font(.title2)
                        .bold()
                    Text("• Swipe left to clear message")
                    Text("• Swipe up or right to open history")
                    Text("• Shake device to clear or flash (configurable in settings)")
                }

                Group {
                    Text("Tips")
                        .font(.title2)
                        .bold()
                    Text("• Increase starting font size in Settings for larger default text")
                    Text("• Use Favorites (star icon) in History for quick recall")
                    Text("• Search in History is case and accent insensitive")
                    Text("• Messages auto-save as you type")
                }

                Group {
                    Text("Accessibility")
                        .font(.title2)
                        .bold()
                    Text("• High contrast themes available in Settings")
                    Text("• VoiceOver labels on all controls")
                    Text("• Dynamic Type supported in menus and settings")
                    Text("• Large tap targets throughout")
                }
            }
            .padding()
        }
        .navigationTitle("Help")
    }
}
