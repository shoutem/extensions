import React from 'react';
import autoBindReact from 'auto-bind/react';
import he from 'he';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { find, next, shouldRefresh } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';

import { RemoteDataListScreen } from 'shoutem.application';
import { navigateTo as navigateToAction } from 'shoutem.navigation';

import { ListArticleView } from '../components/ListArticleView';
import { FeaturedArticleView } from '../components/FeaturedArticleView';
import { getLeadImageUrl, getAuthorName } from '../services';
import { fetchWordpressPosts, getFeedCategories, getFeedItems } from '../redux';
import { ext, POSTS_PER_PAGE } from '../const';

export class ArticlesListScreen extends RemoteDataListScreen {
  static propTypes = {
    ...RemoteDataListScreen.propTypes,
    page: PropTypes.number,
    loadFeed: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      page: 1,
    };
  }

  refreshData(prevProps = {}) {
    const { categories, data } = this.props;

    if (shouldRefresh(data, true) && shouldRefresh(categories, true)) {
      this.fetchData();
    }
  }

  fetchPosts() {
    const { feedUrl, fetchWordpressPosts, shortcut: { id: shortcutId } } = this.props;
    const { page } = this.state;

    fetchWordpressPosts({
      feedUrl,
      shortcutId,
      page,
      perPage: POSTS_PER_PAGE,
      appendMode: page > 1,
    });
  }

  fetchData() {
    const { feedUrl } = this.props;

    if (_.isEmpty(feedUrl)) {
      return;
    }

    this.setState({ page: 1 }, this.fetchPosts);
  }

  openArticle(article) {
    const nextArticle = this.getNextArticle(article);
    const route = {
      screen: ext('ArticleDetailsScreen'),
      title: he.decode(article.title.rendered),
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

    return currentArticleIndex < 0 ? null : data[currentArticleIndex + 1];
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
        title={he.decode(article.title.rendered)}
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
        title={he.decode(article.title.rendered)}
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
    categories: getFeedCategories(state, feedUrl),
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
