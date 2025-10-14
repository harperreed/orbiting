//
//  OrbitingApp.swift
//  Orbiting
//
//  Created by Harper Reed on 10/13/25.
//

import SwiftUI
import SwiftData

@main
struct OrbitingApp: App {
    @State private var settings = AppSettings()
    @State private var showSplash = true

    // Configure shared container
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([Message.self])

        // Use shared App Group container if available
        if let sharedURL = StorageManager.sharedContainerURL {
            let modelConfiguration = ModelConfiguration(
                url: sharedURL.appending(path: "default.store")
            )

            do {
                let container = try ModelContainer(for: schema, configurations: modelConfiguration)
                print("✅ Using shared App Group container at: \(sharedURL.path)")
                return container
            } catch {
                print("⚠️ Failed to configure shared container: \(error)")
                // Fall back to default container
            }
        }

        // Fallback to default container
        do {
            return try ModelContainer(for: schema)
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    var body: some Scene {
        WindowGroup {
            ZStack {
                RootView(settings: settings)

                if showSplash {
                    SplashView()
                        .transition(.opacity)
                        .zIndex(1)
                }
            }
            .onAppear {
                // Hide splash screen after 1.5 seconds
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                    withAnimation(.easeOut(duration: 0.5)) {
                        showSplash = false
                    }
                }
            }
        }
        .modelContainer(sharedModelContainer)
    }
}
