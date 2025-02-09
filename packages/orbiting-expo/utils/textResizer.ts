import { Dimensions } from 'react-native';

const MIN_FONT_SIZE = 16;
const MAX_FONT_SIZE = 72;
const PADDING_FACTOR = 0.9; // 90% of container size to leave room for padding

interface TextDimensions {
  width: number;
  height: number;
}

export function calculateFontSize(
  text: string,
  containerWidth: number,
  containerHeight: number,
  measureText: (text: string, fontSize: number) => TextDimensions
): number {
  if (!text) return MAX_FONT_SIZE;

  let fontSize = MAX_FONT_SIZE;
  const maxWidth = containerWidth * PADDING_FACTOR;
  const maxHeight = containerHeight * PADDING_FACTOR;

  while (fontSize > MIN_FONT_SIZE) {
    const { width, height } = measureText(text, fontSize);
    
    if (width <= maxWidth && height <= maxHeight) {
      break;
    }
    
    fontSize -= 2;
  }

  return Math.max(fontSize, MIN_FONT_SIZE);
}

export function getWindowDimensions() {
  const { width, height } = Dimensions.get('window');
  return { width, height };
}
