import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import moment from 'moment';
import { connectStyle } from '@shoutem/theme';
import { Icon } from '@shoutem/ui';
import { Favorite, FavoritesListScreen } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import { LargeListLayout } from 'shoutem.layouts';
import { navigateTo } from 'shoutem.navigation';
import { ext } from '../const';
import { getLatestVideos, VIDEOS_SCHEMA } from '../redux';

export class MyVideosList extends FavoritesListScreen {
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

  renderPlayIcon() {
    return <Icon name="play" />;
  }

  renderData(data) {
    const { loading } = this.state;

    const imageUrlResolver = 'video.thumbnailurl';
    const subtitleRightResolver = 'duration';
    const titleResolver = 'name';

    return (
      <LargeListLayout
        data={data}
        loading={loading}
        hasOverlay
        onLoadMore={this.loadMore}
        onPress={this.openDetailsScreen}
        onRefresh={this.refreshData}
        overlayStyleName="rounded-small"
        renderActions={this.renderActions}
        renderOverlayChild={this.renderPlayIcon}
        emptyStateAction={this.refreshData}
        emptyStateIconName="add-to-favorites-on"
        emptyStateMessage={I18n.t('shoutem.favorites.noFavoritesMessage')}
        imageUrlResolver={imageUrlResolver}
        subtitleLeftResolver={this.resolveLeftSubtitle}
        subtitleRightResolver={subtitleRightResolver}
        titleResolver={titleResolver}
      />
    );
  }
}

MyVideosList.propTypes = {
  ...FavoritesListScreen.propTypes,
};

MyVideosList.defaultProps = {
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
)(connectStyle(ext('MyVideosList'))(MyVideosList));
