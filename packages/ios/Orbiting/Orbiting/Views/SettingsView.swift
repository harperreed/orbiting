// ABOUTME: Settings UI for language, theme, color scheme, font size, and shake behavior
// ABOUTME: Uses Form layout with pickers and sliders for user preferences

import SwiftUI

struct SettingsView: View {
    @Bindable var settings: AppSettings
    @State private var showingHelp = false
    @State private var showingAbout = false

    // Supported languages
    let supported = ["en","de","pt","es","fr","hi","bn","id","zh","zh_TW","ko","ja"]

    var body: some View {
        Form {
            Section("Language") {
                Picker("UI Language", selection: $settings.languageCode) {
                    ForEach(supported, id: \.self) { code in
                        Text(code).tag(code)
                    }
                }
                .accessibilityHint("Changes app text language")
            }

            Section("Theme") {
                Picker("Theme", selection: $settings.themeTypeRaw) {
                    ForEach(ThemeType.allCases) { t in
                        Text(t.rawValue.capitalized).tag(t.rawValue)
                    }
                }
                Picker("Color Scheme", selection: $settings.colorSchemeRaw) {
                    Text("System").tag("system")
                    Text("Light").tag("light")
                    Text("Dark").tag("dark")
                }
            }

            Section("Typography") {
                Slider(value: $settings.startFont, in: 16...40, step: 1) {
                    Text("Starting Font Size")
                } minimumValueLabel: { Text("16") } maximumValueLabel: { Text("40") }
                Text("Preview")
                    .font(.system(size: CGFloat(settings.startFont), weight: .bold))
                    .frame(maxWidth: .infinity, alignment: .center)
            }

            Section("Gestures") {
                Picker("Shake action", selection: $settings.shakeActionRaw) {
                    ForEach(ShakeAction.allCases) { a in
                        Text(a.rawValue.capitalized).tag(a.rawValue)
                    }
                }
            }

            Section("Help & About") {
                Button {
                    showingHelp = true
                } label: {
                    HStack {
                        Image(systemName: "questionmark.circle")
                        Text("How to Use")
                        Spacer()
                        Image(systemName: "chevron.right")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }

                Button {
                    showingAbout = true
                } label: {
                    HStack {
                        Image(systemName: "info.circle")
                        Text("About Orbiting")
                        Spacer()
                        Image(systemName: "chevron.right")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }

                Link(destination: URL(string: "mailto:feedback@orbiting.com")!) {
                    HStack {
                        Image(systemName: "envelope")
                        Text("Send Feedback")
                        Spacer()
                        Image(systemName: "arrow.up.right")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }

            Section {
                Button(role: .destructive) {
                    settings.resetToDefaults()
                } label: {
                    Text("Reset to defaults")
                }
            }
        }
        .navigationTitle("Settings")
        .sheet(isPresented: $showingHelp) {
            WelcomeView()
        }
        .sheet(isPresented: $showingAbout) {
            AboutView()
        }
    }
}
