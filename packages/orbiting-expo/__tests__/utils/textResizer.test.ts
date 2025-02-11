import { calculateFontSize } from '../../utils/textResizer';

describe('calculateFontSize', () => {
  const mockMeasureText = (text: string, fontSize: number) => ({
    width: text.length * fontSize * 0.5,  // Simple simulation
    height: fontSize * 1.2,  // Approximate line height
  });

  it('returns max font size for empty text', () => {
    const size = calculateFontSize('', 500, 500, mockMeasureText);
    expect(size).toBe(72); // MAX_FONT_SIZE
  });

  it('reduces font size for long text', () => {
    const longText = 'This is a very long text that should cause the font size to decrease';
    const size = calculateFontSize(longText, 300, 200, mockMeasureText);
    expect(size).toBeLessThan(72); // Should be smaller than MAX_FONT_SIZE
    expect(size).toBeGreaterThanOrEqual(16); // Should not go below MIN_FONT_SIZE
  });

  it('maintains minimum font size for extremely long text', () => {
    const veryLongText = 'x'.repeat(1000);
    const size = calculateFontSize(veryLongText, 100, 100, mockMeasureText);
    expect(size).toBe(16); // MIN_FONT_SIZE
  });

  it('adjusts size based on container dimensions', () => {
    const text = 'Sample text';
    const largeSize = calculateFontSize(text, 1000, 1000, mockMeasureText);
    const smallSize = calculateFontSize(text, 200, 200, mockMeasureText);
    expect(largeSize).toBeGreaterThan(smallSize);
  });
});
