// ABOUTME: Splash screen displayed on app launch showing branding and tagline
// ABOUTME: Fades out after 1.5 seconds to reveal the main app interface

import SwiftUI

struct SplashView: View {
    var body: some View {
        ZStack {
            // Clean white background
            Color.white
                .ignoresSafeArea()

            VStack(spacing: 16) {
                // App name in large, bold text
                Text("Orbiting")
                    .font(.system(size: 48, weight: .bold, design: .default))
                    .foregroundColor(.black)

                // Tagline in smaller, lighter text
                Text("Ultra-legible nearby messaging")
                    .font(.system(size: 18, weight: .regular, design: .default))
                    .foregroundColor(Color(red: 0.3, green: 0.3, blue: 0.3))
            }
        }
    }
}

#Preview {
    SplashView()
}
