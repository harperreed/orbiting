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
    var body: some Scene {
        WindowGroup {
            HomeView()
        }
        .modelContainer(for: Message.self)
    }
}
