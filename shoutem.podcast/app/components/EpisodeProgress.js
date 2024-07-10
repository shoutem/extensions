import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { getAudioTrackProgress } from 'shoutem.audio';
import { ProgressBar } from 'shoutem.audio/components';
import { ext, getEpisodeTrackId } from '../const';

const EpisodeProgress = ({ episode, style }) => {
  const progressPercentage = useSelector(state =>
    getAudioTrackProgress(state, ext(), getEpisodeTrackId(episode.id)),
  );

  return (
    <View style={style.container}>
      <View style={style.iconContainer} />
      <ProgressBar
        percentage={progressPercentage.completionPercentage}
        style={style.progressBar}
      />
    </View>
  );
};

EpisodeProgress.propTypes = {
  episode: PropTypes.object.isRequired,
  style: PropTypes.object,
};

EpisodeProgress.defaultProps = {
  style: {},
};

export default connectStyle(ext('EpisodeProgress'))(EpisodeProgress);
