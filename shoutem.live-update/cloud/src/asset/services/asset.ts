import path from 'path';

export function getAssetName(fileName: string) {
  const timestamp = new Date().getTime();
  const fileExt = path.extname(fileName);

  const name = path.basename(fileName, fileExt);
  const uniqueName = name ? `${name}-${timestamp}` : `${timestamp}`;

  if (fileExt) {
    return `${uniqueName}${fileExt}`;
  }

  return uniqueName;
}
