import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { cloneStatus, getMeta } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { GridRow } from '@shoutem/ui';
import { unavailableInWeb } from 'shoutem.application';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { FeaturedEpisodeView, GridEpisodeView } from '../components';
import { ext } from '../const';
import { resolveDownloadInProgress } from '../services';
import {
  EpisodesListScreen,
  mapDispatchToProps,
  mapStateToProps,
} from './EpisodesListScreen';

class EpisodesGridScreen extends EpisodesListScreen {
  constructor(props, context) {
    super(props, context);

    autoBindReact(this);
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({
      ...composeNavigationStyles(['featured']),
    });

    super.componentDidMount();
  }

  renderFeaturedItem(episodeRow) {
    const { data } = this.props;
    const { screenSettings } = getRouteParams(this.props);

    // episode[0] is used because of GridRow.groupByRows, which is used in the
    // renderData() method. It will store the first (featured) episode in an
    // array, because it usually groups two episodes in a single array, which is
    // then mapped into a single row as seen in the renderRow() method.
    const episode = episodeRow?.[0];

    // TODO
    // Featured item render fn has episodeRow undefined while data = [], on initial load.
    // List shouldn't be rendering rows if there's no data.
    if (!screenSettings.hasFeaturedItem || !episode) {
      return null;
    }

    const {
      downloadedEpisodes,
      hasFavorites,
      isFavorited,
      deleteEpisode,
      downloadEpisode,
      saveFavoriteEpisode,
      removeFavoriteEpisode,
    } = this.props;
    const {
      shortcut: {
        id: shortcutId,
        title: shortcutTitle,
        settings: shortcutSettings,
      },
    } = getRouteParams(this.props);

    const isFavoriteEpisode = isFavorited(episode);

    const downloadInProgress = resolveDownloadInProgress(
      episode.id,
      downloadedEpisodes,
    );

    return (
      <FeaturedEpisodeView
        key={episode.id}
        episode={episode}
        appHasFavoritesShortcut={hasFavorites}
        isFavorited={isFavoriteEpisode}
        downloadInProgress={downloadInProgress}
        shortcutId={shortcutId}
        shortcutTitle={shortcutTitle}
        shortcutSettings={shortcutSettings}
        meta={getMeta(data)}
        onPress={this.openEpisodeWithId}
        onDelete={unavailableInWeb(deleteEpisode)}
        onDownload={unavailableInWeb(downloadEpisode)}
        onSaveToFavorites={saveFavoriteEpisode}
        onRemoveFromFavorites={removeFavoriteEpisode}
      />
    );
  }

  renderRow(episodes) {
    const {
      data,
      downloadedEpisodes,
      hasFavorites,
      isFavorited,
      deleteEpisode,
      downloadEpisode,
      saveFavoriteEpisode,
      removeFavoriteEpisode,
    } = this.props;
    const {
      shortcut: {
        id: shortcutId,
        title: shortcutTitle,
        settings: shortcutSettings,
      },
    } = getRouteParams(this.props);

    const episodeViews = _.map(episodes, episode => {
      const isFavoriteEpisode = isFavorited(episode);

      const downloadInProgress = resolveDownloadInProgress(
        episode.id,
        downloadedEpisodes,
      );

      return (
        <GridEpisodeView
          key={episode.id}
          episode={episode}
          appHasFavoritesShortcut={hasFavorites}
          isFavorited={isFavoriteEpisode}
          downloadInProgress={downloadInProgress}
          shortcutId={shortcutId}
          shortcutTitle={shortcutTitle}
          shortcutSettings={shortcutSettings}
          meta={getMeta(data)}
          onPress={this.openEpisodeWithId}
          onDelete={unavailableInWeb(deleteEpisode)}
          onDownload={unavailableInWeb(downloadEpisode)}
          onSaveToFavorites={saveFavoriteEpisode}
          onRemoveFromFavorites={removeFavoriteEpisode}
        />
      );
    });

    return <GridRow columns={2}>{episodeViews}</GridRow>;
  }

  renderData() {
    const {
      screenSettings: { hasFeaturedItem },
    } = getRouteParams(this.props);
    const { data } = this.props;

    // Group items into rows with 2 columns, except for the
    // first episode. The first episode is treated as a featured episode
    let isFirstItem = hasFeaturedItem;

    const groupedItems = GridRow.groupByRows(data, 2, () => {
      if (isFirstItem) {
        isFirstItem = false;
        return 2;
      }

      return 1;
    });

    // Transfer the loading status from the original collection
    cloneStatus(data, groupedItems);

    return super.renderData(groupedItems);
  }
}

EpisodesGridScreen.propTypes = {
  ...EpisodesListScreen.propTypes,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EpisodesGridScreen'), {})(EpisodesGridScreen));
