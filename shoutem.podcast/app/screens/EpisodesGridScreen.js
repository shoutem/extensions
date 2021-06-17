import React from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { GridRow } from '@shoutem/ui';
import { cloneStatus } from '@shoutem/redux-io';
import { GridEpisodeView, FeaturedEpisodeView } from '../components';
import { ext } from '../const';
import {
  EpisodesListScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './EpisodesListScreen';

class EpisodesGridScreen extends EpisodesListScreen {
  static propTypes = {
    ...EpisodesListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);
  }

  getNavigationBarProps() {
    const { title } = this.props;

    return {
      title: title || '',
      styleName: 'featured',
    };
  }

  renderFeaturedItem(episode) {
    const { enableDownload, feedUrl, hasFeaturedItem } = this.props;

    return hasFeaturedItem && episode ? (
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
    const { data, hasFeaturedItem } = this.props;

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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EpisodesGridScreen'), {})(EpisodesGridScreen));
