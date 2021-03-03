export default function getWeServUrl(url, width, height, fit = 'inside') {
  // weserv service expects the URL without a protocol, so we strip the protocol here;
  // the ssl: prefix can be used to force the secure connection when fetching images
  const cleanUrl = url.replace('https://', 'ssl:').replace(/^.*:\/\//g, '');
  const encodedUrl = encodeURIComponent(cleanUrl);

  const h = height || width;

  return `https://images.weserv.nl/?url=${encodedUrl}&w=${width}&h=${h}&fit=${fit}`;
}
