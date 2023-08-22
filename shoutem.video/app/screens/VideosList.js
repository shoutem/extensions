import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import moment from 'moment';
import { isBusy, isInitialized, isValid } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { Icon } from '@shoutem/ui';
import { CmsListScreen } from 'shoutem.cms';
import { Favorite } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import { LargeListLayout } from 'shoutem.layouts';
import { navigateTo } from 'shoutem.navigation';
import { ext } from '../const';
import { getLatestVideos, VIDEOS_SCHEMA } from '../redux';

export class VideosList extends CmsListScreen {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      ...this.state,
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
    const initialLoad =
      !isValid(data) ||
      (isBusy(data) && (!data || data?.length === 0 || !isInitialized(data)));

    if (initialLoad) {
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
        loading={isBusy(data)}
        onLoadMore={this.loadMore}
        onPress={this.openDetailsScreen}
        onRefresh={this.refreshData}
        renderActions={this.renderActions}
        renderOverlayChild={this.renderPlayIcon}
        emptyStateAction={this.refreshData}
        emptyStateIconName="error"
        emptyStateMessage={I18n.t(
          'shoutem.application.preview.noContentErrorMessage',
        )}
        overlayStyleName="rounded-small"
        imageUrlResolver={imageUrlResolver}
        subtitleLeftResolver={this.resolveLeftSubtitle}
        subtitleRightResolver={subtitleRightResolver}
        titleResolver={titleResolver}
      />
    );
  }
}

VideosList.propTypes = {
  ...CmsListScreen.propTypes,
};

VideosList.defaultProps = {
  ...CmsListScreen.defaultProps,
};

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  getLatestVideos,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps();

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('VideosList'))(VideosList));
