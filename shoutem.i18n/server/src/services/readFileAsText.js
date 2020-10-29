export function readFileAsText(file) {
  return new Promise(function(resolve, reject) {
    if (!file) {
      reject('File parameter is required.');
    }

    const reader = new FileReader();

    reader.onload = function(e) {
      resolve(e.target.result);
    };

    reader.onerror = function(e) {
      reject(new Error(`Error reading file: ${e.target.result}`));
    };

    reader.readAsText(file);
  });
}
