import ImageResizer from 'react-native-image-resizer';

const COMPRESS_OPTIONS = {
  maxWidth: 1024,
  maxHeight: 1024,
  compressFormat: 'JPEG',
  quality: 30, // 0-100
};

export function createResizedImage(imageUri) {
  return ImageResizer.createResizedImage(
    imageUri,
    COMPRESS_OPTIONS.maxWidth,
    COMPRESS_OPTIONS.maxHeight,
    COMPRESS_OPTIONS.compressFormat,
    COMPRESS_OPTIONS.quality,
  );
}
