import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';

import { cloneStatus } from '@shoutem/redux-io';

import {
  GridRow,
} from '@shoutem/ui';

import {
  ArticlesListScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './ArticlesListScreen';

import FeaturedArticleView from '../components/FeaturedArticleView';
import GridArticleView from '../components/GridArticleView';
import { ext } from '../const';

class ArticlesGridScreen extends ArticlesListScreen {
  static propTypes = {
    ...ArticlesListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.renderRow = this.renderRow.bind(this);
  }

  renderRow(articles) {
    // Featured articles are rendered in full width
    if (articles[0].featured) {
      return (
        <FeaturedArticleView
          article={articles[0]}
          onPress={this.openDetailsScreen}
        />
      );
    }

    // Render the GridArticleView within a GridRow for all
    // other articles (i.e., the ones that are not featured).
    const articleViews = _.map(articles, (article) => {
      return (
        <GridArticleView
          key={article.id}
          article={article}
          onPress={this.openDetailsScreen}
        />
      );
    });
    return (
      <GridRow columns={2}>
        {articleViews}
      </GridRow>
    );
  }

  renderData(articles) {
    // Group the articles into rows with 2 columns
    const groupedArticles = GridRow.groupByRows(articles, 2,
      article => (article.featured ? 2 : 1),
    );

    // Transfer the loading status from the original collection
    cloneStatus(articles, groupedArticles);

    return super.renderData(groupedArticles);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ArticlesGridScreen'), {})(ArticlesGridScreen),
);
