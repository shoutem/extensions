import React from 'react';
import autoBindReact from 'auto-bind/react';
import he from 'he';
import _ from 'lodash';
import { connect } from 'react-redux';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { cloneStatus } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { GridRow } from '@shoutem/ui';
import { FeaturedArticleView } from '../components/FeaturedArticleView';
import { GridArticleView } from '../components/GridArticleView';
import { ext } from '../const';
import { getLeadImageUrl } from '../services';
import {
  ArticlesListScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './ArticlesListScreen';

class ArticlesGridScreen extends ArticlesListScreen {
  static propTypes = {
    ...ArticlesListScreen.propTypes,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  getNavigationBarProps() {
    const { title } = getRouteParams(this.props);

    return { title, ...composeNavigationStyles(['featured']) };
  }

  renderFeaturedItem(article) {
    const { screenSettings } = getRouteParams(this.props);

    return screenSettings.hasFeaturedItem && article ? (
      <FeaturedArticleView
        key={article[0].id}
        articleId={article[0].id.toString()}
        title={he.decode(article[0].title.rendered)}
        imageUrl={getLeadImageUrl(article[0])}
        date={article[0].modified}
        onPress={this.openArticleWithId}
      />
    ) : null;
  }

  renderRow(articles) {
    const articleViews = _.map(articles, article => {
      return (
        <GridArticleView
          key={article.id}
          articleId={article.id.toString()}
          title={he.decode(article.title.rendered)}
          imageUrl={getLeadImageUrl(article)}
          date={article.modified}
          onPress={this.openArticleWithId}
        />
      );
    });

    return <GridRow columns={2}>{articleViews}</GridRow>;
  }

  renderData(articles) {
    const { screenSettings } = getRouteParams(this.props);
    // Group the articles into rows with 2 columns, except for the
    // first article. The first article is treated as a featured article
    let isFirstArticle = screenSettings.hasFeaturedItem;
    const groupedArticles = GridRow.groupByRows(articles, 2, () => {
      if (isFirstArticle) {
        isFirstArticle = false;
        return 2;
      }

      return 1;
    });

    // Transfer the loading status from the original collection
    cloneStatus(articles, groupedArticles);

    return super.renderData(groupedArticles);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ArticlesGridScreen'), {})(ArticlesGridScreen));
