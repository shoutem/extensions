import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';
import { GridRow } from '@shoutem/ui';
import { cloneStatus } from '@shoutem/redux-io';

import { getLeadImageUrl } from 'shoutem.rss';

import { GridArticleView } from '../components/GridArticleView';
import { FeaturedArticleView } from '../components/FeaturedArticleView';
import { ext } from '../const';
import {
  ArticlesListScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './ArticlesListScreen';

class ArticlesGridScreen extends ArticlesListScreen {
  static propTypes = {
    ...ArticlesListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.renderRow = this.renderRow.bind(this);
  }

  getNavigationBarProps() {
    return {
      title: this.props.title || '',
      styleName: 'featured',
    };
  }

  renderFeaturedItem(article) {
    const { hasFeaturedItem } = this.props;

    return hasFeaturedItem && article ? (
      <FeaturedArticleView
        key={article[0].id}
        articleId={article[0].id}
        title={article[0].title}
        imageUrl={getLeadImageUrl(article[0])}
        author={article[0].author}
        date={article[0].timeUpdated}
        onPress={this.openArticleWithId}
      />
    ) : null;
  }

  renderRow(articles) {
    const articleViews = _.map(articles, (article) => {
      return (
        <GridArticleView
          key={article.id}
          articleId={article.id}
          title={article.title}
          imageUrl={getLeadImageUrl(article)}
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
    const { hasFeaturedItem } = this.props;
    // Group the articles into rows with 2 columns, except for the
    // first article. The first article is treated as a featured article
    let isFirstArticle = hasFeaturedItem;
    const groupedArticles = GridRow.groupByRows(articles, 2, () => {
      if (isFirstArticle) {
        isFirstArticle = false;
        return 2;
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
