import React from 'react';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';
import { navigateTo } from '@shoutem/core/navigation';

import { connect } from 'react-redux';
import {
  find,
  next,
} from '@shoutem/redux-io';

import { RssListScreen } from 'shoutem.rss';
import { ext } from '../const.js';
import { RSS_NEWS_SCHEMA, getNewsFeed } from '../redux';
import ListArticleView from '../components/ListArticleView';

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

    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  openDetailsScreen(article) {
    const { navigateTo, feedUrl } = this.props;
    const route = {
      screen: ext('ArticleDetailsScreen'),
      title: article.title,
      props: {
        article,
        feedUrl,
        showNext: true,
      },
    };

    navigateTo(route);
  }

  renderRow(article) {
    return (
      <ListArticleView
        article={article}
        onPress={this.openDetailsScreen}
      />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const feedUrl = _.get(ownProps, 'shortcut.settings.feedUrl');
  return {
    feedUrl,
    feed: getNewsFeed(state, feedUrl),
  };
};

export const mapDispatchToProps = { navigateTo, find, next };

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ArticlesListScreen'), {})(ArticlesListScreen),
);
