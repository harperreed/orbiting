// ABOUTME: App Clip wrapper view providing the full app experience
// ABOUTME: Pre-populates text from invocation URL if provided

import SwiftUI

struct AppClipView: View {
    let settings: AppSettings
    let invocationText: String?

    var body: some View {
        RootView(settings: settings)
            .onAppear {
                // If invocation text provided, post notification to pre-populate
                if let text = invocationText {
                    NotificationCenter.default.post(
                        name: NSNotification.Name("AppClipTextReceived"),
                        object: text
                    )
                }
            }
    }
}

#Preview {
    AppClipView(
        settings: AppSettings(),
        invocationText: nil
    )
}
