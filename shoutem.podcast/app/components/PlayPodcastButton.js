import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { PlaybackControl } from 'shoutem.audio';
import { ext } from '../const';

const PlayPodcastButton = ({ onPress, style }) => (
  <PlaybackControl
    onPress={onPress}
    iconName="playlist-play"
    style={style.playButton}
  />
);

PlayPodcastButton.propTypes = {
  style: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default connectStyle(ext('PlayPodcastButton'))(PlayPodcastButton);
