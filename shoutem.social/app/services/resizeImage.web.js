import ImageResizer from 'react-image-file-resizer';

const COMPRESS_OPTIONS = {
  maxWidth: 1024,
  maxHeight: 1024,
  compressFormat: 'JPEG',
  quality: 30, // 0-100
  rotation: 0,
};

export function createResizedImage(imageUri) {
  return new Promise(resolve => {
    ImageResizer.imageFileResizer(
      imageUri,
      COMPRESS_OPTIONS.maxWidth,
      COMPRESS_OPTIONS.maxHeight,
      COMPRESS_OPTIONS.compressFormat,
      COMPRESS_OPTIONS.quality,
      COMPRESS_OPTIONS.rotation,
      uri => resolve({ uri }),
    );
  });
}
