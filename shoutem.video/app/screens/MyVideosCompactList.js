import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import moment from 'moment';
import { connectStyle } from '@shoutem/theme';
import { Favorite, FavoritesListScreen } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import { CompactListLayout } from 'shoutem.layouts';
import { navigateTo } from 'shoutem.navigation';
import { ext } from '../const';
import { getLatestVideos, VIDEOS_SCHEMA } from '../redux';

export class MyVideosCompactList extends FavoritesListScreen {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      schema: VIDEOS_SCHEMA,
    };
  }

  openDetailsScreen(video) {
    navigateTo(ext('VideoDetails'), {
      video,
      analyticsPayload: {
        itemId: video.id,
        itemName: video.name,
      },
    });
  }

  resolveLeftSubtitle(video) {
    return moment(video.timeCreated).fromNow();
  }

  renderActions(video) {
    const { schema } = this.state;

    return <Favorite item={video} schema={schema} />;
  }

  renderData(data) {
    const { loading } = this.state;

    const titleResolver = 'name';
    const imageUrlResolver = 'video.thumbnailurl';
    const rightSubtitleResolver = 'duration';

    return (
      <CompactListLayout
        data={data}
        loading={loading}
        onLoadMore={this.loadMore}
        onPress={this.openDetailsScreen}
        onRefresh={this.refreshData}
        renderActions={this.renderActions}
        emptyStateAction={this.refreshData}
        emptyStateIconName="add-to-favorites-on"
        emptyStateMessage={I18n.t('shoutem.favorites.noFavoritesMessage')}
        imageUrlResolver={imageUrlResolver}
        subtitleLeftResolver={this.resolveLeftSubtitle}
        subtitleRightResolver={rightSubtitleResolver}
        titleResolver={titleResolver}
      />
    );
  }
}

MyVideosCompactList.propTypes = {
  ...FavoritesListScreen.propTypes,
};

MyVideosCompactList.defaultProps = {
  ...FavoritesListScreen.defaultProps,
};

export const mapStateToProps = FavoritesListScreen.createMapStateToProps(
  VIDEOS_SCHEMA,
  getLatestVideos,
);

export const mapDispatchToProps = FavoritesListScreen.createMapDispatchToProps();

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('MyVideosCompactList'))(MyVideosCompactList));
