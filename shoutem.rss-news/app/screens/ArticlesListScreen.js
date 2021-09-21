import React from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { RssListScreen, getLeadImageUrl } from 'shoutem.rss';
import { find, next, shouldRefresh } from '@shoutem/redux-io';
import { FeaturedArticleView } from '../components/FeaturedArticleView';
import { ListArticleView } from '../components/ListArticleView';
import { ext, RSS_NEWS_SCHEMA } from '../const';
import { getNewsFeed, fetchNewsFeed } from '../redux';

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

    autoBindReact(this);
  }

  componentDidMount() {
    const { data, fetchNewsFeed, shortcutId } = this.props;

    if (shouldRefresh(data)) {
      fetchNewsFeed(shortcutId);
    }
  }

  openArticle(id) {
    const { feedUrl } = this.props;

    navigateTo(ext('ArticleDetailsScreen'), {
      id,
      feedUrl,
      openArticle: this.openArticle,
    });
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
    const { screenSettings } = getRouteParams(this.props);

    return screenSettings.hasFeaturedItem && article ? (
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
  const { shortcut } = getRouteParams(ownProps);
  const shortcutId = _.get(shortcut, 'id');
  const feedUrl = _.get(shortcut, 'settings.feedUrl');
  const data = getNewsFeed(state, feedUrl);

  return {
    shortcutId,
    feedUrl,
    data,
  };
};

export const mapDispatchToProps = {
  fetchNewsFeed,
  find,
  next,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesListScreen);
