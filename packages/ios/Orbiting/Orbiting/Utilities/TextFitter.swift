// ABOUTME: Binary search algorithm to find optimal font size that fits text in viewport
// ABOUTME: Uses NSString boundingRect for accurate UIFont size calculations

import SwiftUI
import UIKit

struct TextFitter {
    /// Compute the largest font size that allows `text` to fit within `targetSize`
    /// using UILabel/NSString sizing. Limits to [min, max] and uses a 0.5pt precision.
    static func bestFontSize(
        text: String,
        targetSize: CGSize,
        min: CGFloat = 16,
        max: CGFloat = 512,
        weight: UIFont.Weight = .bold
    ) -> CGFloat {
        guard !text.isEmpty, targetSize.width > 0, targetSize.height > 0 else { return min }
        var low = min
        var high = max
        var best = min

        while high - low > 0.5 {
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
        paragraph.alignment = .center
        paragraph.lineBreakMode = .byWordWrapping

        let attrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: fontSize, weight: weight),
            .paragraphStyle: paragraph
        ]

        // Give it a "safe" padding margin to avoid edge clipping
        let safeW = size.width * 0.98
        let safeH = size.height * 0.98

        let rect = (text as NSString).boundingRect(
            with: CGSize(width: safeW, height: .greatestFiniteMagnitude),
            options: [.usesLineFragmentOrigin, .usesFontLeading],
            attributes: attrs,
            context: nil
        )
        return rect.height <= safeH && rect.width <= safeW
    }
}
