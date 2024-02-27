import _ from 'lodash';

const escapeCharacter = '[';
const escapedEscapeCharacter = escapeCharacter + escapeCharacter;
const escapeCharacterRegExp = /\[/g;

const encodingMap = {
  $: '[dollar]',
  '.': '[dot]',
};

const decodingMap = _.invert(encodingMap);

const encodingRegExpMap = {
  $: /\$/g,
  '.': /\./g,
};

const decodingRegExpMap = {
  '[dollar]': /\[dollar]/g,
  '[dot]': /\[dot]/g,
};

/**
 * Encodes object keys.
 * @param obj Object to encode
 * @returns New encoded object
 */
export function encodeKeys(obj) {
  const encodeCharacters = _.keys(encodingMap);

  return _.mapKeys(obj, (value, key) => {
    let newKey = key.replace(escapeCharacterRegExp, escapedEscapeCharacter);

    _.forEach(encodeCharacters, (encodeChar) => {
      newKey = newKey.replace(encodingRegExpMap[encodeChar], encodingMap[encodeChar]);
    });

    return newKey;
  });
}

/**
 * Decodes object keys.
 * @param obj Object to decode
 * @returns New decoded object
 */
export function decodeKeys(obj) {
  const decodeStrings = _.keys(decodingMap);

  return _.mapKeys(obj, (value, key) => {
    let newKey = key;
    _.forEach(decodeStrings, (decodeStr) => {
      newKey = newKey.replace(decodingRegExpMap[decodeStr], decodingMap[decodeStr]);
    });

    newKey = newKey.replace(escapeCharacterRegExp, escapedEscapeCharacter);

    return newKey;
  });
}
