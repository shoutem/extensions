import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import moment from 'moment';
import { isBusy, isInitialized, isValid } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { CmsListScreen } from 'shoutem.cms';
import { Favorite } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import { CompactListLayout } from 'shoutem.layouts';
import { navigateTo } from 'shoutem.navigation';
import { ext } from '../const';
import { getLatestVideos, VIDEOS_SCHEMA } from '../redux';

export class VideosCompactList extends CmsListScreen {
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

    const titleResolver = 'name';
    const imageUrlResolver = 'video.thumbnailurl';
    const rightSubtitleResolver = 'duration';

    return (
      <CompactListLayout
        data={data}
        loading={isBusy(data)}
        onLoadMore={this.loadMore}
        onPress={this.openDetailsScreen}
        onRefresh={this.refreshData}
        renderActions={this.renderActions}
        emptyStateAction={this.refreshData}
        emptyStateIconName="error"
        emptyStateMessage={I18n.t(
          'shoutem.application.preview.noContentErrorMessage',
        )}
        imageUrlResolver={imageUrlResolver}
        subtitleLeftResolver={this.resolveLeftSubtitle}
        subtitleRightResolver={rightSubtitleResolver}
        titleResolver={titleResolver}
      />
    );
  }
}

VideosCompactList.propTypes = {
  ...CmsListScreen.propTypes,
};

VideosCompactList.defaultProps = {
  ...CmsListScreen.defaultProps,
};

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  getLatestVideos,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps();

export default connectStyle(ext('VideosCompact'))(
  connect(mapStateToProps, mapDispatchToProps)(VideosCompactList),
);
