import { readFileAsText } from './readFileAsText'

export function validateJson(file) {
  return readFileAsText(file)
    .then((fileText) => {
      try {
        JSON.parse(fileText);
      }
      catch(e) {
        throw new Error("File upload failed, invalid JSON file.");
      }
      return;
    });
}
