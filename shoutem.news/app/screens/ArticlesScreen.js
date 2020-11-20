import React from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';

import { CmsListScreen } from 'shoutem.cms';
import { navigateTo } from 'shoutem.navigation';

import { FeaturedArticleView } from '../components/FeaturedArticleView';
import { createListItem, getItemProps } from '../components/ListItemViewFactory';
import { ext } from '../const';

export class ArticlesScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    navigateTo: PropTypes.func.isRequired,
    listType: PropTypes.string.isRequired,
    hasFeaturedItem: PropTypes.bool.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: ext('articles'),
    };
  }

  getNavBarProps() {
    const { hasFeaturedItem } = this.props;
    const styleName = hasFeaturedItem ? 'featured' : '';

    return { ...super.getNavBarProps(), styleName };
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

    const currentArticleIndex = data ? _.findIndex(data, { id: article.id }) : 0;

    return data[currentArticleIndex + 1];
  }

  renderFeaturedItem(item) {
    return item ? (
      <FeaturedArticleView {...getItemProps(item)} onPress={this.openArticleWithId} />
    ) : null;
  }

  renderRow(data) {
    const { listType } = this.props;

    return createListItem(listType, data, this.openArticleWithId);
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  state => state[ext()].latestNews,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  navigateTo,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ArticlesScreen'))(ArticlesScreen),
);
