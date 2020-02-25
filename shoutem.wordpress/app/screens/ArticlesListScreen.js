import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';
import { navigateTo as navigateToAction } from 'shoutem.navigation';
import { find, next } from '@shoutem/redux-io';

import { RemoteDataListScreen } from 'shoutem.application';

import { ListArticleView } from '../components/ListArticleView';
import { FeaturedArticleView } from '../components/FeaturedArticleView';
import { getLeadImageUrl, resolveArticleTitle, getAuthorName } from '../services';
import {
  WORDPRESS_NEWS_SCHEMA,
  fetchWordpressPosts,
  getFeedItems,
} from '../redux';
import { ext } from '../const';

export class ArticlesListScreen extends RemoteDataListScreen {
  static propTypes = {
    ...RemoteDataListScreen.propTypes,
    page: PropTypes.number,
    perPage: PropTypes.number,
    loadFeed: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      schema: WORDPRESS_NEWS_SCHEMA,
      page: 1,
      nextPage: null,
      perPage: 20,
    };

    this.openArticle = this.openArticle.bind(this);
    this.openArticleWithId = this.openArticleWithId.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderFeaturedItem = this.renderFeaturedItem.bind(this);
    this.fetchPosts = this.fetchPosts.bind(this);
  }

  fetchPosts() {
    const { feedUrl, shortcut: { id: shortcutId } } = this.props;
    const { perPage, page } = this.state;

    this.props.fetchWordpressPosts({
      feedUrl,
      shortcutId,
      page,
      perPage,
      appendMode: page > 1,
    });
  }

  fetchData() {
    const { feedUrl } = this.props;

    if (_.isEmpty(feedUrl)) {
      return;
    }

    this.setState({
      page: 1,
    },
      this.fetchPosts);
  }

  loadMore() {
    const { page } = this.state;

    this.setState({
      page: page + 1,
    },
      this.fetchPosts);
  }

  openArticle(article) {
    const nextArticle = this.getNextArticle(article);
    const route = {
      screen: ext('ArticleDetailsScreen'),
      title: resolveArticleTitle(article.title.rendered),
      props: {
        article,
        nextArticle,
        openArticle: this.openArticle,
      },
    };

    this.props.navigateToAction(route);
  }

  openArticleWithId(articleId) {
    const { data } = this.props;
    const article = _.find(data, _.matchesProperty('id', parseInt(articleId, 10)));
    this.openArticle(article);
  }

  getNextArticle(article) {
    const { data } = this.props;
    const currentArticleIndex = _.findIndex(data, { id: article.id });
    if (currentArticleIndex < 0) return null;
    return data[currentArticleIndex + 1];
  }

  renderFeaturedItem(article) {
    const { hasFeaturedItem } = this.props;

    return hasFeaturedItem && article ? (
      <FeaturedArticleView
        key={article.id}
        articleId={article.id.toString()}
        author={getAuthorName(article)}
        date={article.modified}
        imageUrl={getLeadImageUrl(article)}
        onPress={this.openArticleWithId}
        title={resolveArticleTitle(article.title.rendered)}
      />
    ) : null;
  }

  renderRow(article) {
    return (
      <ListArticleView
        key={article.id}
        articleId={article.id.toString()}
        date={article.modified}
        imageUrl={getLeadImageUrl(article)}
        onPress={this.openArticleWithId}
        title={resolveArticleTitle(article.title.rendered)}
      />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const feedUrl = _.get(ownProps, 'shortcut.settings.feedUrl');
  const { shortcut } = ownProps;

  return {
    feedUrl,
    shortcut,
    data: getFeedItems(state, feedUrl),
  };
};

export const mapDispatchToProps = {
  navigateToAction,
  fetchWordpressPosts,
  find,
  next,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ArticlesListScreen'))(ArticlesListScreen),
);
