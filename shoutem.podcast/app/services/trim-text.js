export default function trimText(str, length) {
  if (str.length > length) {
    return `${str.substring(0, length)}…`;
  }

  return str;
}
