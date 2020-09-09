import React from 'react';
import _ from 'lodash';
import autoBind from 'auto-bind';
import { connect } from 'react-redux';
import { find, next, shouldRefresh } from '@shoutem/redux-io';
import { navigateTo as navigateToAction } from 'shoutem.navigation';
import { RssListScreen, getLeadImageUrl } from 'shoutem.rss';
import { ListArticleView } from '../components/ListArticleView';
import { FeaturedArticleView } from '../components/FeaturedArticleView';
import { getNewsFeed, fetchNewsFeed } from '../redux';
import { ext, RSS_NEWS_SCHEMA } from '../const';

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

    autoBind(this);
  }

  componentDidMount() {
    const { data, fetchNewsFeed, shortcutId } = this.props;

    if (shouldRefresh(data)) {
      fetchNewsFeed(shortcutId);
    }
  }

  openArticle(id) {
    const { feedUrl, navigateTo } = this.props;

    const route = {
      screen: ext('ArticleDetailsScreen'),
      props: {
        id,
        feedUrl,
        openArticle: this.openArticle,
      },
    };

    navigateTo(route);
  }

  openArticleWithId(id) {
    const { data } = this.props;

    const article = _.find(data, { id });
    const articleId = _.get(article, 'id');

    if (articleId) {
      this.openArticle(articleId);
    }
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
  const shortcutId = _.get(ownProps, 'shortcut.id');
  const feedUrl = _.get(ownProps, 'shortcut.settings.feedUrl');
  const data = getNewsFeed(state, feedUrl);

  return {
    shortcutId,
    feedUrl,
    data,
  };
};

export const mapDispatchToProps = {
  fetchNewsFeed,
  navigateTo: navigateToAction,
  find,
  next,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesListScreen);
