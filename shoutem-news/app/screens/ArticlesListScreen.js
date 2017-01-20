import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';
import { navigateTo } from '@shoutem/core/navigation';

import { CmsListScreen } from 'shoutem.cms';

import { ext } from '../const.js';
import ListArticleView from '../components/ListArticleView';
import FeaturedArticleView from '../components/FeaturedArticleView';

function hasFeaturedNews(news) {
  return news.some(article => article.featured);
}

export class ArticlesListScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    navigateTo: React.PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.state = {
      ...this.state,
      schema: ext('articles'),
    };
  }

  openDetailsScreen(article) {
    const { navigateTo } = this.props;
    const nextArticle = this.getNextArticle(article);

    const route = {
      screen: ext('ArticleMediumDetailsScreen'),
      title: article.title,
      props: {
        article,
        nextArticle,
        openArticle: this.openDetailsScreen,
      },
    };

    navigateTo(route);
  }

  getNavBarProps() {
    const navBarProps = super.getNavBarProps();
    const { data } = this.props;
    const newNavBarProps = { ...navBarProps };

    if (hasFeaturedNews(data)) {
      newNavBarProps.styleName = `${newNavBarProps.styleName || ''} featured`;
    }

    return newNavBarProps;
  }

  getNextArticle(article) {
    const { data } = this.props;
    const currentArticleIndex = _.findIndex(data, { id: article.id });
    return data[currentArticleIndex + 1];
  }

  renderRow(article) {
    if (article.featured) {
      return (
        <FeaturedArticleView
          article={article}
          selectedCategoryId={this.props.selectedCategory.id}
          onPress={this.openDetailsScreen}
        />
      );
    }

    return (
      <ListArticleView
        article={article}
        onPress={this.openDetailsScreen}
      />
    );
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  (state) => state[ext()].latestNews
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  navigateTo,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ArticlesListScreen'), {})(ArticlesListScreen)
);
