import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import moment from 'moment';
import { isBusy, isInitialized } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { Icon } from '@shoutem/ui';
import { CmsListScreen } from 'shoutem.cms';
import { Favorite } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import { LargeListLayout } from 'shoutem.layouts';
import { navigateTo } from 'shoutem.navigation';
import { ext } from '../const';
import { getLatestVideos, VIDEOS_SCHEMA } from '../redux';

export class VideosLargeList extends CmsListScreen {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: VIDEOS_SCHEMA,
    };

    // eslint-disable-next-line no-console
    console.warn(
      "VideosLargeList is deprecated and will be removed with next major version of shoutem.video, use VideosList instead, it's identical.",
    );
  }

  openDetailsScreen(video) {
    navigateTo(ext('VideoDetails'), { video });
  }

  renderActions(video) {
    const { schema } = this.state;

    return <Favorite item={video} schema={schema} />;
  }

  renderPlayIcon() {
    return <Icon name="play" />;
  }

  resolveLeftSubtitle(video) {
    return moment(video.timeCreated).fromNow();
  }

  renderData(data) {
    const loading = isBusy(data) || !isInitialized(data);

    if (loading) {
      return this.renderLoading();
    }

    if (this.shouldRenderPlaceholderView()) {
      return this.renderPlaceholderView();
    }

    const imageUrlResolver = 'video.thumbnailurl';
    const subtitleRightResolver = 'duration';
    const titleResolver = 'name';

    return (
      <LargeListLayout
        data={data}
        hasOverlay
        imageUrlResolver={imageUrlResolver}
        onLoadMore={this.loadMore}
        onPress={this.openDetailsScreen}
        onRefresh={this.refreshData}
        emptyStateAction={this.refreshData}
        emptyStateIconName="error"
        emptyStateMessage={I18n.t(
          'shoutem.application.preview.noContentErrorMessage',
        )}
        overlayStyleName="rounded-small"
        renderActions={this.renderActions}
        renderOverlayChild={this.renderPlayIcon}
        subtitleLeftResolver={this.resolveLeftSubtitle}
        subtitleRightResolver={subtitleRightResolver}
        titleResolver={titleResolver}
      />
    );
  }
}

VideosLargeList.propTypes = {
  ...CmsListScreen.propTypes,
};

VideosLargeList.defaultProps = {
  ...CmsListScreen.defaultProps,
};

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  getLatestVideos,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps();

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('VideosLargeList'))(VideosLargeList));
