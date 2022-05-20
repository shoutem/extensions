import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { cloneStatus } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { GridRow } from '@shoutem/ui';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { FeaturedEpisodeView, GridEpisodeView } from '../components';
import { ext } from '../const';
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
    const { enableDownload, feedUrl } = this.props;

    const episodeViews = _.map(episodes, episode => {
      return (
        <GridEpisodeView
          key={episode.id}
          enableDownload={enableDownload}
          episode={episode}
          feedUrl={feedUrl}
          onPress={this.openEpisodeWithId}
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
