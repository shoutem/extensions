import _ from 'lodash';

export async function getTrackArtwork(songName) {
  const itunesEndpoint = `https://itunes.apple.com/search?term=${encodeURI(
    songName,
  )}&media=music&limit=1`;

  try {
    const response = await fetch(itunesEndpoint).then(res => res.json());

    return _.get(response, ['results', 0, 'artworkUrl100'], null);
  } catch (error) {
    return null;
  }
}
