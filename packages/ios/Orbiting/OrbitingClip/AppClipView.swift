// ABOUTME: App Clip wrapper view showing full app experience with upgrade banner
// ABOUTME: Displays SKOverlay for seamless upgrade to full app

import SwiftUI
import StoreKit

struct AppClipView: View {
    let settings: AppSettings
    let invocationText: String?

    @State private var showingUpgradeOverlay = false
    @Environment(\.openURL) private var openURL

    var body: some View {
        VStack(spacing: 0) {
            // Full app experience
            RootView(settings: settings)

            // App Clip banner
            AppClipBanner {
                presentAppStoreOverlay()
            }
        }
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

    /// Presents SKOverlay for App Store upgrade
    private func presentAppStoreOverlay() {
        guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene else {
            print("⚠️ No window scene available for overlay")
            return
        }

        let config = SKOverlay.AppClipConfiguration(position: .bottom)
        let overlay = SKOverlay(configuration: config)
        overlay.present(in: scene)

        print("📱 Presented App Store overlay")
    }
}

struct AppClipBanner: View {
    let onUpgradeTapped: () -> Void

    var body: some View {
        HStack {
            Text("Using Orbiting App Clip")
                .font(.caption)
                .foregroundStyle(.secondary)

            Spacer()

            Button(action: onUpgradeTapped) {
                Text("Get Full App")
            }
            .buttonStyle(.bordered)
            .controlSize(.small)
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(.regularMaterial)
    }
}

#Preview {
    AppClipView(
        settings: AppSettings(),
        invocationText: nil
    )
}
