// ABOUTME: ObservableObject that publishes keyboard height changes
// ABOUTME: Used to adjust viewport when keyboard appears/disappears

import SwiftUI
import Combine

final class KeyboardObserver: ObservableObject {
    @Published var keyboardHeight: CGFloat = 0

    init() {
        NotificationCenter.default.addObserver(
            forName: UIResponder.keyboardWillChangeFrameNotification,
            object: nil,
            queue: .main
        ) { [weak self] note in
            guard
                let self,
                let frame = note.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect,
                let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                let window = scene.windows.first
            else { return }

            let local = window.convert(frame, from: nil)
            let overlap = max(window.bounds.height - local.origin.y, 0)
            self.keyboardHeight = overlap
        }

        NotificationCenter.default.addObserver(
            forName: UIResponder.keyboardWillHideNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            self?.keyboardHeight = 0
        }
    }
}
