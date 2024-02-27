import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon } from '@shoutem/ui';
import { ext } from '../const';

const PlaybackIcon = ({ isPlaying, style }) => {
  return <Icon name={isPlaying ? 'play' : 'pause'} style={style.icon} />;
};

PlaybackIcon.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  style: PropTypes.object,
};

PlaybackIcon.defaultProps = {
  style: {},
};

export default connectStyle(ext('PlaybackIcon'))(React.memo(PlaybackIcon));
