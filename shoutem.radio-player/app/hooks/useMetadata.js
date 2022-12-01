import { useEffect, useMemo, useState } from 'react';
import { LayoutAnimation } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import slugify from '@sindresorhus/slugify';
import _ from 'lodash';
import { images } from '../assets';
import { getRadioMetadata, setRadioMetadata } from '../redux';
import { getRadioProvider, getTrackArtwork } from '../services';

export function useMetadata(streamUrl) {
  const dispatch = useDispatch();

  const radioId = useMemo(() => slugify(`radio-${streamUrl}`), [streamUrl]);
  const currentRadio = useSelector(state => getRadioMetadata(state, radioId));

  const [artist, setArtist] = useState(currentRadio?.artist);
  const [songName, setSongName] = useState(currentRadio?.songName);
  const [artwork, setArtwork] = useState({ uri: currentRadio?.artwork?.uri });

  useEffect(() => {
    const provider = getRadioProvider(streamUrl);

    dispatch(
      setRadioMetadata(radioId, {
        provider,
      }),
    );
  }, [dispatch, radioId, streamUrl]);

  async function handleMetadataChange(metadata, manually = false) {
    if (manually) {
      // We have to set state again, because screen is unmounted in
      // non-tab layouts. Metadata sometimes defaults to {},
      // so we read values from redux instead.
      const metadataSource = _.isEmpty(metadata) ? currentRadio : metadata;
      const { artist, artwork: activeArtwork, songName } = metadataSource;

      LayoutAnimation.easeInEaseOut();

      setArtist(artist);
      setSongName(songName);
      setArtwork(activeArtwork);

      return;
    }

    const { artist = '', title = '' } = metadata;
    const artwork = await getTrackArtwork(
      {
        artist,
        songName: title,
        streamUrl,
      },
      currentRadio.provider,
    );
    const resolvedImage = artwork ? { uri: artwork } : images.music;

    dispatch(
      setRadioMetadata(radioId, {
        artist,
        songName: title,
        artwork: resolvedImage,
      }),
    );

    LayoutAnimation.easeInEaseOut();
    setArtist(artist);
    setSongName(title);
    setArtwork(resolvedImage);
  }

  return { artist, songName, artwork, handleMetadataChange };
}
