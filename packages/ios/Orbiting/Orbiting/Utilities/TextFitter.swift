// ABOUTME: Binary search algorithm to find optimal font size that fits text in viewport
// ABOUTME: Uses NSString boundingRect for accurate UIFont size calculations

import SwiftUI
import UIKit

struct TextFitter {
    // Constants for text fitting algorithm
    private static let binarySearchPrecision: CGFloat = 0.5 // Font size precision in points
    private static let safeAreaMargin: CGFloat = 0.98 // Margin to avoid edge clipping (2% padding)

    /// Compute the largest font size that allows `text` to fit within `targetSize`
    /// using UILabel/NSString sizing. Limits to [min, max] and uses binary search with 0.5pt precision.
    static func bestFontSize(
        text: String,
        targetSize: CGSize,
        min: CGFloat = 16,
        max: CGFloat = 100,
        weight: UIFont.Weight = .bold
    ) -> CGFloat {
        guard !text.isEmpty, targetSize.width > 0, targetSize.height > 0 else { return min }
        var low = min
        var high = max
        var best = min

        while high - low > binarySearchPrecision {
            let mid = (low + high) / 2.0
            if fits(text: text, in: targetSize, fontSize: mid, weight: weight) {
                best = mid
                low = mid
            } else {
                high = mid
            }
        }
        return floor(best)
    }

    /// Check if the string fits within the given size at a font size.
    private static func fits(text: String, in size: CGSize, fontSize: CGFloat, weight: UIFont.Weight) -> Bool {
        let paragraph = NSMutableParagraphStyle()
        paragraph.alignment = .left  // Match HomeView's .leading alignment
        paragraph.lineBreakMode = .byWordWrapping

        let attrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: fontSize, weight: weight),
            .paragraphStyle: paragraph
        ]

        // Apply safe area margin to avoid edge clipping
        let safeW = size.width * safeAreaMargin
        let safeH = size.height * safeAreaMargin

        // First check: ensure no individual word is wider than available width
        // This prevents mid-word breaks
        let words = text.components(separatedBy: .whitespacesAndNewlines).filter { !$0.isEmpty }
        for word in words {
            let wordRect = (word as NSString).boundingRect(
                with: CGSize(width: CGFloat.greatestFiniteMagnitude, height: CGFloat.greatestFiniteMagnitude),
                options: [.usesLineFragmentOrigin, .usesFontLeading],
                attributes: attrs,
                context: nil
            )
            // If any single word is too wide, this font size won't work
            if wordRect.width > safeW {
                return false
            }
        }

        // Second check: ensure full text fits in height when wrapped
        let rect = (text as NSString).boundingRect(
            with: CGSize(width: safeW, height: CGFloat.greatestFiniteMagnitude),
            options: [.usesLineFragmentOrigin, .usesFontLeading],
            attributes: attrs,
            context: nil
        )
        return rect.height <= safeH
    }
}
