import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { cloneStatus } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { GridRow } from '@shoutem/ui';
import { getRouteParams, HeaderStyles } from 'shoutem.navigation';
import { getLeadImageUrl } from 'shoutem.rss';
import { FeaturedArticleView } from '../components/FeaturedArticleView';
import { GridArticleView } from '../components/GridArticleView';
import { ext } from '../const';
import {
  ArticlesListScreen,
  mapDispatchToProps,
  mapStateToProps,
} from './ArticlesListScreen';

class ArticlesGridScreen extends ArticlesListScreen {
  static propTypes = {
    ...ArticlesListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    const { title } = getRouteParams(this.props);

    navigation.setOptions({
      title,
      ...HeaderStyles.featured,
    });

    super.componentDidMount();
  }

  renderFeaturedItem(article) {
    const { screenSettings } = getRouteParams(this.props);

    return screenSettings.hasFeaturedItem && article ? (
      <FeaturedArticleView
        key={article[0].id}
        articleId={article[0].id}
        title={article[0].title}
        imageUrl={getLeadImageUrl(article[0])}
        author={article[0].author}
        date={article[0].timeUpdated}
        onPress={this.openArticleWithId}
      />
    ) : null;
  }

  renderRow(articles) {
    const articleViews = _.map(articles, article => {
      return (
        <GridArticleView
          key={article.id}
          articleId={article.id}
          title={article.title}
          imageUrl={getLeadImageUrl(article)}
          date={article.timeUpdated}
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
