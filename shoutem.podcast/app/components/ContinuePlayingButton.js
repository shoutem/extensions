import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { PlaybackControl } from 'shoutem.audio';
import { ext } from '../const';
import { usePodcastEpisodePlayer } from '../hooks';
import { getLastPlayed } from '../redux';

const ContinuePlayingButton = ({ playlist, style }) => {
  // isActive updates too late when starting episode. Using this state for better UX, it'll
  // hide button as soon as it is pressed, letting using know their request to play is processing.
  const [shouldHide, setShouldHide] = useState(false);

  const lastPlayedEpisodeTrack = useSelector(state =>
    getLastPlayed(state, playlist.id),
  );

  const {
    isActive,
    isLoadingOrBuffering,
    onPlaybackButtonPress,
  } = usePodcastEpisodePlayer({
    playlist,
    track: lastPlayedEpisodeTrack,
  });

  const handlePress = useCallback(() => {
    setShouldHide(true);
    onPlaybackButtonPress();
  }, [onPlaybackButtonPress]);

  useEffect(() => {
    if (!isActive) {
      setShouldHide(false);
    }
  }, [isActive]);

  if (!lastPlayedEpisodeTrack || shouldHide) {
    return null;
  }

  return (
    <PlaybackControl
      onPress={handlePress}
      iconName="playlist-play"
      isLoadingOrBuffering={isLoadingOrBuffering}
      style={{
        container: style.button,
        spinnerContainer: style.button,
        icon: style.icon,
      }}
    />
  );
};

ContinuePlayingButton.propTypes = {
  playlist: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  style: PropTypes.object,
};

ContinuePlayingButton.defaultProps = {
  style: {},
};

export default connectStyle(ext('ContinuePlayingButton'))(
  ContinuePlayingButton,
);
