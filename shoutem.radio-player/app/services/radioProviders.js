/* globals fetch */
import _ from 'lodash';

async function getItunesTrackArtwork({ artist, songName }) {
  // Fetch top 50 results
  const itunesEndpoint = `https://itunes.apple.com/search?term=${encodeURI(
    songName,
  )}&media=music`;

  try {
    const { results } = await fetch(itunesEndpoint).then(res => res.json());

    const originalArtist = _.toLower(artist);

    // Try matching result by artist name first
    const resultForArtistName = _.find(results, result => {
      const resultArtistRegex = new RegExp(_.toLower(result.artistName));
      return originalArtist.match(resultArtistRegex);
    });

    const artwork = resultForArtistName
      ? _.get(resultForArtistName, 'artworkUrl100', null)
      : _.get(results, [0, 'artworkUrl100'], null);

    if (artwork) {
      return artwork.replace('100x100', '500x500');
    }

    return null;
  } catch (error) {
    return null;
  }
}

// https://www.radioking.com/play/my-radio => my-radio
// https://www.radioking.com/play/my-radio/9867 => my-radio
const RADIO_KING_REGEX = new RegExp(
  /^https:\/\/www.radioking.com\/play\/(.*)\/+.*$|^https:\/\/www.radioking.com\/play\/(.*)/,
);

async function getRadioKingTrackArtwork({ streamUrl }) {
  const radioName =
    streamUrl.match(RADIO_KING_REGEX)[1] ||
    streamUrl.match(RADIO_KING_REGEX)[2];

  const trackEndpoint = `https://api.radioking.io/widget/radio/${radioName}/track/current`;

  try {
    const response = await fetch(trackEndpoint).then(res => res.json());

    return _.get(response, 'cover', null);
  } catch (error) {
    console.warn('Fetching RadioKing artwork failed', error);
    return null;
  }
}

const SUPPORTED_PROVIDERS = {
  ITUNES: {
    name: 'ITUNES',
    getTrackData: getItunesTrackArtwork,
  },
  RADIO_KING: {
    name: 'RADIO_KING',
    url: 'https://www.radioking.com',
    getTrackData: getRadioKingTrackArtwork,
  },
};

export function getRadioProvider(streamUrl) {
  const provider = _.find(SUPPORTED_PROVIDERS, provider =>
    _.startsWith(streamUrl, provider.url),
  );

  return provider?.name || SUPPORTED_PROVIDERS.ITUNES.name;
}
/**
 * Function for fetching track data depending on radio provider.
 * @param {{streamUrl: string, artist: string, songName: string}} radio
 * @param {string} provider
 * @returns Url for track artwork, if it exists
 */
export function getTrackArtwork(radio, provider) {
  if (_.has(SUPPORTED_PROVIDERS, provider)) {
    return SUPPORTED_PROVIDERS[provider].getTrackData(radio);
  }

  return null;
}
