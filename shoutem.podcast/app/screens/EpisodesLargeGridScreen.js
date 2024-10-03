import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { cloneStatus, getMeta } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { GridRow } from '@shoutem/ui';
import { unavailableInWeb } from 'shoutem.application';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { FeaturedEpisodeView, LargeGridEpisodeView } from '../components';
import { ext } from '../const';
import { resolveDownloadInProgress } from '../services';
import {
  EpisodesListScreen,
  mapDispatchToProps,
  mapStateToProps,
} from './EpisodesListScreen';

class EpisodesLargeGridScreen extends EpisodesListScreen {
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

  getNavigationBarProps() {
    const { navigation } = this.props;

    navigation.setOptions({
      ...composeNavigationStyles(['featured']),
    });
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
      shortcutFavoritedEpisodes,
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

    const isFavorited = _.some(
      shortcutFavoritedEpisodes,
      favoritedUuid => favoritedUuid === episode.uuid,
    );

    const downloadInProgress = resolveDownloadInProgress(
      episode.id,
      downloadedEpisodes,
    );

    return (
      <FeaturedEpisodeView
        key={episode.id}
        episode={episode}
        appHasFavoritesShortcut={hasFavorites}
        isFavorited={isFavorited}
        shortcutHasDownloadsEnabled={shortcutFavoritedEpisodes}
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
      shortcutFavoritedEpisodes,
      deleteEpisode,
      downloadEpisode,
      saveFavoriteEpisode,
      removeFavoriteEpisode,
      style,
    } = this.props;
    const {
      shortcut: {
        id: shortcutId,
        title: shortcutTitle,
        settings: shortcutSettings,
      },
    } = getRouteParams(this.props);

    const episodeViews = _.map(episodes, episode => {
      const isFavorited = _.some(
        shortcutFavoritedEpisodes,
        favoritedUuid => favoritedUuid === episode.uuid,
      );

      const downloadInProgress = resolveDownloadInProgress(
        episode.id,
        downloadedEpisodes,
      );

      return (
        <LargeGridEpisodeView
          key={episode.id}
          episode={episode}
          appHasFavoritesShortcut={hasFavorites}
          isFavorited={isFavorited}
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

    return (
      <GridRow columns={2} style={style.gridRow}>
        {episodeViews}
      </GridRow>
    );
  }

  renderData(episodes) {
    const { screenSettings } = getRouteParams(this.props);

    // Group items into rows with 2 columns, except for the
    // first episode. The first episode is treated as a featured episode
    let isFirstItem = screenSettings.hasFeaturedItem;

    const groupedItems = GridRow.groupByRows(episodes, 2, () => {
      if (isFirstItem) {
        isFirstItem = false;
        return 2;
      }

      return 1;
    });

    // Transfer the loading status from the original collection
    cloneStatus(episodes, groupedItems);

    return super.renderData(groupedItems);
  }
}

EpisodesLargeGridScreen.propTypes = {
  ...EpisodesListScreen.propTypes,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EpisodesLargeGridScreen'), {})(EpisodesLargeGridScreen));
