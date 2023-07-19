import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ListView, Screen } from '@shoutem/ui';
import { navigateTo } from 'shoutem.navigation';
import { ListEpisodeView } from '../components';
import { ext } from '../const';
import { getFavoritedEpisodes } from '../redux';

export function MyPodcastsScreen({ data }) {
  function openEpisodeWithId(episode) {
    const { enableDownload, feedUrl, id, title } = episode;

    navigateTo(ext('EpisodeDetailsScreen'), {
      id,
      feedUrl,
      enableDownload,
      episode,
      analyticsPayload: {
        itemId: id,
        itemName: title,
      },
    });
  }

  function renderRow(episode) {
    const { enableDownload, feedUrl } = episode;

    return (
      <ListEpisodeView
        key={episode.id}
        enableDownload={enableDownload}
        episode={episode}
        feedUrl={feedUrl}
        onPress={() => openEpisodeWithId(episode)}
      />
    );
  }

  return (
    <Screen>
      <ListView data={data} renderRow={renderRow} initialListSize={1} />
    </Screen>
  );
}

MyPodcastsScreen.propTypes = {
  data: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    data: getFavoritedEpisodes(state),
  };
}

export default connect(mapStateToProps)(
  connectStyle(ext('MyPodcastsScreen'))(MyPodcastsScreen),
);
