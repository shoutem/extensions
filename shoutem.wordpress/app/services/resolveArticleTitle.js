// Workaround until server-side decoding can be set up
// TODO: Remove this when server-side decoding is updated
export default function resolveArticleTitle(title) {
  return title.replace('&#8211;', '–');
}
