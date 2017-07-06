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

import { FeaturedArticleView } from '../components/FeaturedArticleView';
import { GridArticleView } from '../components/GridArticleView';
import { ext } from '../const';

const ITEMS_PER_ROW = 2;

class ArticlesGridScreen extends ArticlesListScreen {
  static propTypes = {
    ...ArticlesListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.renderRow = this.renderRow.bind(this);
  }

  getNavBarProps() {
    return { ...super.getNavBarProps(), styleName: 'featured' };
  }

  renderRow(articles, sectionId, index) {
    // Featured articles are rendered in full width
    if (index === '0') {
      const article = articles[index];
      return (
        <FeaturedArticleView
          key={article.id}
          articleId={article.id}
          title={article.title}
          imageUrl={_.get(article, 'image.url')}
          author={article.newsAuthor}
          date={article.timeUpdated}
          onPress={this.openArticleWithId}
        />
      );
    }

    // Render the GridArticleView within a GridRow for all
    // other articles (i.e., the ones that are not featured).
    const articleViews = _.map(articles, (article) => {
      return (
        <GridArticleView
          key={article.id}
          articleId={article.id}
          title={article.title}
          imageUrl={_.get(article, 'image.url')}
          date={article.timeUpdated}
          onPress={this.openArticleWithId}
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
    let isFirstArticle = false;
    const groupedArticles = GridRow.groupByRows(articles, ITEMS_PER_ROW, () => {
      if (isFirstArticle) {
        // The first article is featured, and it
        // should take up the entire width of the grid
        isFirstArticle = false;
        return ITEMS_PER_ROW;
      }

      return 1;
    });

    // Transfer the loading status from the original collection
    cloneStatus(articles, groupedArticles);

    return super.renderData(groupedArticles);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ArticlesGridScreen'), {})(ArticlesGridScreen),
);
