import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';
import { find, next } from '@shoutem/redux-io';

import { navigateTo as navigateToAction } from 'shoutem.navigation';
import { RssListScreen, getLeadImageUrl } from 'shoutem.rss';

import { ListArticleView } from '../components/ListArticleView';
import { FeaturedArticleView } from '../components/FeaturedArticleView';
import { RSS_NEWS_SCHEMA, getNewsFeed } from '../redux';
import { ext } from '../const.js';

export class ArticlesListScreen extends RssListScreen {
  static propTypes = {
    ...RssListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      ...this.state,
      schema: RSS_NEWS_SCHEMA,
    };

    this.openArticle = this.openArticle.bind(this);
    this.openArticleWithId = this.openArticleWithId.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderFeaturedItem = this.renderFeaturedItem.bind(this);
  }

  openArticle(article) {
    const { navigateTo } = this.props;
    const nextArticle = this.getNextArticle(article);

    const route = {
      screen: ext('ArticleDetailsScreen'),
      title: article.title,
      props: {
        article,
        nextArticle,
        openArticle: this.openArticle,
      },
    };

    navigateTo(route);
  }

  openArticleWithId(id) {
    const { data } = this.props;
    const article = _.find(data, { id });
    this.openArticle(article);
  }

  getNextArticle(article) {
    const { data } = this.props;
    const currentArticleIndex = _.findIndex(data, { id: article.id });
    return data[currentArticleIndex + 1];
  }

  renderFeaturedItem(article) {
    const { hasFeaturedItem } = this.props;

    return hasFeaturedItem && article ? (
      <FeaturedArticleView
        key={article.id}
        articleId={article.id}
        title={article.title}
        imageUrl={getLeadImageUrl(article)}
        author={article.author}
        date={article.timeUpdated}
        onPress={this.openArticleWithId}
      />
    ) : null;
  }

  renderRow(article) {
    return (
      <ListArticleView
        key={article.id}
        articleId={article.id}
        title={article.title}
        imageUrl={getLeadImageUrl(article)}
        date={article.timeUpdated}
        onPress={this.openArticleWithId}
      />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const feedUrl = _.get(ownProps, 'shortcut.settings.feedUrl');
  return {
    feedUrl,
    data: getNewsFeed(state, feedUrl),
  };
};

export const mapDispatchToProps = { navigateTo: navigateToAction, find, next };

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ArticlesListScreen'))(ArticlesListScreen),
);
