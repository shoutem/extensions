import React from 'react';
import autoBindReact from 'auto-bind/react';
import he from 'he';
import _ from 'lodash';
import { connect } from 'react-redux';
import { RemoteDataListScreen } from 'shoutem.application';
import { navigateTo as navigateToAction } from 'shoutem.navigation';
import { next } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { FeaturedArticleView } from '../components/FeaturedArticleView';
import { ListArticleView } from '../components/ListArticleView';
import { ext, POSTS_PER_PAGE } from '../const';
import {
  fetchWordpressPosts,
  getFeedCategories,
  fetchPostsMedia,
  fetchPostsAuthor,
  getFeedItems,
  fetchCategories,
} from '../redux';
import { getLeadImageUrl, getAuthorName } from '../services';
export class ArticlesListScreen extends RemoteDataListScreen {
  static propTypes = {
    ...RemoteDataListScreen.propTypes,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  refreshData() {
    return null;
  }

  loadMore() {
    const {
      feedUrl,
      data,
      next,
      fetchPostsMedia,
      fetchPostsAuthor,
    } = this.props;

    next(data).then(res => {
      const options = { ..._.get(res, 'meta.options'), feedUrl };
      const posts = _.get(res, 'payload');

      return Promise.all([
        fetchPostsMedia({ ...options, posts }),
        fetchPostsAuthor({ ...options, posts }),
      ]);
    });
  }

  // Called only on didMount & pull to refresh
  fetchData() {
    const {
      feedUrl,
      fetchCategories,
      fetchWordpressPosts,
      shortcut: { id: shortcutId },
    } = this.props;

    if (_.isEmpty(feedUrl)) {
      return null;
    }

    const options = {
      // We pass page=1 only on initial fetch data.
      // After it is loaded, next page URL is stored in reducer's links.next
      // Each next data fetching is performed using next()
      page: 1,
      feedUrl,
      shortcutId,
      perPage: POSTS_PER_PAGE,
    };

    return fetchCategories(options).then(res => {
      const categories = _.get(res, 'payload');

      fetchWordpressPosts(options, categories);
    });
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

    const article = _.find(
      data,
      _.matchesProperty('id', parseInt(articleId, 10)),
    );
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
  next,
  fetchCategories,
  fetchPostsMedia,
  fetchPostsAuthor,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ArticlesListScreen'))(ArticlesListScreen));
