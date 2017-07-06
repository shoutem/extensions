import React from 'react';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';
import { connect } from 'react-redux';

import {
  ArticlesListScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './ArticlesListScreen';

import { ext } from '../const.js';
import { ListArticleView } from '../components/ListArticleView';
import { FeaturedArticleView } from '../components/FeaturedArticleView';

export class ArticlesFeaturedListScreen extends ArticlesListScreen {
  static propTypes = {
    ...ArticlesListScreen.propTypes,
    onPress: React.PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.renderRow = this.renderRow.bind(this);
  }

  getNavBarProps() {
    return {
      ...super.getNavBarProps(),
      styleName: 'featured',
    };
  }

  renderRow(article, sectionId, index) {
    if (index === '0') {
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

    return (
      <ListArticleView
        key={article.id}
        articleId={article.id}
        title={article.title}
        imageUrl={_.get(article, 'image.url')}
        date={article.timeUpdated}
        onPress={this.openArticleWithId}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
connectStyle(ext('ArticlesFeaturedListScreen'), {})(ArticlesFeaturedListScreen),
);
