import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';
import { GridRow } from '@shoutem/ui';
import { cloneStatus } from '@shoutem/redux-io';

import { getLeadImageUrl } from 'shoutem.rss';

import { GridEpisodeView } from '../components/GridEpisodeView';
import { FeaturedEpisodeView } from '../components/FeaturedEpisodeView';
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
    this.renderRow = this.renderRow.bind(this);
  }

  getNavigationBarProps() {
    return {
      title: this.props.title || '',
      styleName: 'featured',
    };
  }

  renderFeaturedItem(episode) {
    const { hasFeaturedItem } = this.props;

    return hasFeaturedItem && episode ? (
      <FeaturedEpisodeView
        key={episode[0].id}
        author={episode[0].author}
        date={episode[0].timeUpdated}
        episodeId={episode[0].id}
        imageUrl={getLeadImageUrl(episode[0])}
        onPress={this.openEpisodeWithId}
        title={episode[0].title}
      />
    ) : null;
  }

  renderRow(episodes) {
    const episodeViews = _.map(episodes, (episode) => {
      return (
        <GridEpisodeView
          key={episode.id}
          date={episode.timeUpdated}
          episodeId={episode.id}
          imageUrl={getLeadImageUrl(episode)}
          onPress={this.openEpisodeWithId}
          title={episode.title}
        />
      );
    });

    return (
      <GridRow columns={2}>
        {episodeViews}
      </GridRow>
    );
  }

  renderData(episodes) {
    const { hasFeaturedItem } = this.props;

    // Group items into rows with 2 columns, except for the
    // first episode. The first episode is treated as a featured episode
    let isFirstItem = hasFeaturedItem;

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

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('EpisodesGridScreen'), {})(EpisodesGridScreen),
);
