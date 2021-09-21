import React from 'react';
import { connect } from 'react-redux';
import { getRouteParams } from 'shoutem.navigation';
import { isBusy, isInitialized } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { GridRow, ListView } from '@shoutem/ui';
import { FeaturedArticleView } from '../components/FeaturedArticleView';
import { getItemProps } from '../components/ListItemViewFactory';
import { ext } from '../const';
import {
  ArticlesScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './ArticlesScreen';
import FeaturedGrid122FeaturedRowView from '../components/FeaturedGrid122FeaturedRowView';
import FeaturedGrid122FullRowView from '../components/FeaturedGrid122FullRowView';
import FeaturedGrid122HalfRowView from '../components/FeaturedGrid122HalfRowView';

let row = [];

export class FeaturedGrid122ArticlesScreen extends ArticlesScreen {
  renderRow(article, index) {
    const { data } = this.props;
    const {
      screenSettings: { hasFeaturedItem },
    } = getRouteParams(this.props);

    if (hasFeaturedItem && index === 0) {
      return (
        <FeaturedGrid122FeaturedRowView
          article={article}
          onPress={() => this.openArticleWithId(article.id)}
        />
      );
    }

    if ((!hasFeaturedItem && index === 0) || index % 5 === 0) {
      return (
        <FeaturedGrid122FullRowView
          article={article}
          onPress={() => this.openArticleWithId(article.id)}
        />
      );
    }

    if (row.length === 0 || row.length === 1) {
      row.push(
        <FeaturedGrid122HalfRowView
          article={article}
          onPress={() => this.openArticleWithId(article.id)}
        />,
      );
    }

    if (row.length === 2 || index === data.length - 1) {
      const itemsRow = row;
      row = [];

      return (
        <GridRow styleName="no-padding" columns={2}>
          {itemsRow}
        </GridRow>
      );
    }

    return null;
  }

  renderFeaturedItem(item) {
    return item ? (
      <FeaturedArticleView
        {...getItemProps(item[0])}
        onPress={this.openArticleWithId}
      />
    ) : null;
  }

  renderData(articles) {
    if (this.shouldRenderPlaceholderView()) {
      return this.renderPlaceholderView();
    }

    const loading = isBusy(articles) || !isInitialized(articles);

    return (
      <ListView
        data={articles}
        getSectionId={this.getSectionId}
        initialListSize={1}
        loading={loading}
        onLoadMore={this.loadMore}
        onRefresh={this.refreshData}
        renderRow={this.renderRow}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ArticlesScreen'))(FeaturedGrid122ArticlesScreen));
