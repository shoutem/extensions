import { Buffer } from 'buffer';

export default function encodeToBase64(stringToEncode) {
  return new Buffer(stringToEncode).toString('base64');
}
