import { getRadioProvider, getTrackArtwork } from './radioProviders';

export const resolveMetadata = async (url, songInformation) => {
  const provider = getRadioProvider(url);

  const metaInfos = songInformation?.split(' - ');

  const artist = metaInfos[0]?.trim();
  const title = metaInfos[1]?.trim();

  const artwork = await getTrackArtwork(
    {
      artist,
      title,
      streamUrl: url,
    },
    provider,
  );

  return {
    artist,
    title,
    artwork,
  };
};
