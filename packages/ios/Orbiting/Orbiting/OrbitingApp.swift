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

    var body: some Scene {
        WindowGroup {
            RootView(settings: settings)
        }
        .modelContainer(for: Message.self)
    }
}
