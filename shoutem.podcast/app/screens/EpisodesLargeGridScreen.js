import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { cloneStatus } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { GridRow } from '@shoutem/ui';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { FeaturedEpisodeView, LargeGridEpisodeView } from '../components';
import { ext } from '../const';
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

  // episode[0] is used because of GridRow.groupByRows, which is used in the
  // renderData() method. It will store the first (featured) episode in an
  // array, because it usually groups two episodes in a single array, which is
  // then mapped into a single row as seen in the renderRow() method.
  renderFeaturedItem(episode) {
    const { enableDownload, feedUrl } = this.props;
    const { screenSettings } = getRouteParams(this.props);

    return screenSettings.hasFeaturedItem && episode ? (
      <FeaturedEpisodeView
        key={episode[0].id}
        enableDownload={enableDownload}
        episode={episode[0]}
        feedUrl={feedUrl}
        onPress={this.openEpisodeWithId}
      />
    ) : null;
  }

  renderRow(episodes) {
    const { enableDownload, feedUrl, style } = this.props;

    const episodeViews = _.map(episodes, episode => {
      return (
        <LargeGridEpisodeView
          key={episode.id}
          enableDownload={enableDownload}
          episode={episode}
          feedUrl={feedUrl}
          onPress={this.openEpisodeWithId}
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
