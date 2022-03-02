import React from 'react';
import { connect } from 'react-redux';
import { htmlToText } from 'html-to-text';
import { isBusy, isInitialized } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { Grid122Layout } from 'shoutem.layouts';
import { getRouteParams } from 'shoutem.navigation';
import { ext } from '../const';
import {
  ArticlesScreen,
  mapDispatchToProps,
  mapStateToProps,
} from './ArticlesScreen';

function resolveSubtitle(article) {
  return htmlToText(article.body);
}

export class Grid122ArticlesScreen extends ArticlesScreen {
  renderData(articles) {
    if (this.shouldRenderPlaceholderView()) {
      return this.renderPlaceholderView();
    }

    const {
      screenSettings: { hasFeaturedItem },
    } = getRouteParams(this.props);

    const loading = isBusy(articles) || !isInitialized(articles);

    return (
      <Grid122Layout
        data={articles}
        getSectionId={this.getSectionId}
        hasFeaturedItem={hasFeaturedItem}
        loading={loading}
        onLoadMore={this.loadMore}
        onPress={this.openArticleWithId}
        onRefresh={this.refreshData}
        imageUrlResolver="image.url"
        subtitleResolver={resolveSubtitle}
        titleResolver="title"
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('Grid122ArticlesScreen'))(Grid122ArticlesScreen));
