import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { isBusy, isInitialized } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { Caption, View } from '@shoutem/ui';
import { Favorite } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import { CompactListLayout } from 'shoutem.layouts';
import { navigateTo } from 'shoutem.navigation';
import { ext } from '../const';
import { mapDispatchToProps, mapStateToProps, VideosList } from './VideosList';

export class VideosSmallList extends VideosList {
  componentDidMount() {
    super.componentDidMount();

    // eslint-disable-next-line no-console
    console.warn(
      "VideosSmallList is deprecated and will be removed with next major version of shoutem.video, use VideosCompactList instead, it's identical.",
    );
  }

  openDetailsScreen(video) {
    navigateTo(ext('VideoDetails'), { video });
  }

  renderActions(video) {
    const { schema } = this.state;

    return <Favorite item={video} schema={schema} />;
  }

  renderSubtitle(video) {
    return (
      <View styleName="horizontal stretch space-between">
        <Caption>{moment(video.timeCreated).fromNow()}</Caption>
        <Caption>{video.duration}</Caption>
      </View>
    );
  }

  renderData(data) {
    const loading = isBusy(data) || !isInitialized(data);

    if (loading) {
      return this.renderLoading();
    }

    if (this.shouldRenderPlaceholderView()) {
      return this.renderPlaceholderView();
    }

    const titleResolver = 'name';
    const imageUrlResolver = 'video.thumbnailurl';

    return (
      <CompactListLayout
        data={data}
        onLoadMore={this.loadMore}
        onPress={this.openDetailsScreen}
        onRefresh={this.refreshData}
        emptyStateAction={this.refreshData}
        emptyStateIconName="error"
        emptyStateMessage={I18n.t(
          'shoutem.application.preview.noContentErrorMessage',
        )}
        titleResolver={titleResolver}
        subtitleResolver={this.renderSubtitle}
        imageUrlResolver={imageUrlResolver}
        renderActions={this.renderActions}
      />
    );
  }
}

VideosSmallList.propTypes = {
  ...VideosList.propTypes,
};

VideosSmallList.defaultProps = {
  ...VideosList.defaultProps,
};

export default connectStyle(ext('VideosCompact'))(
  connect(mapStateToProps, mapDispatchToProps)(VideosSmallList),
);
