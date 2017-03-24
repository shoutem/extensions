import React from 'react';
import { Dimensions } from 'react-native';
import { connectStyle } from '@shoutem/theme';
import {
  Screen,
  ScrollView,
  View,
  Tile,
  Title,
  Caption,
  Icon,
  Image,
  ImageGallery,
} from '@shoutem/ui';
import {
  NavigationBar,
} from '@shoutem/ui/navigation';

import {
  RichMedia,
} from '@shoutem/ui-addons';

import * as _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';

import { getLeadImageUrl, getAttachments } from 'shoutem.rss';

import { ext } from '../const';
import { getNewsFeed } from '../redux';
import NextArticle from '../components/NextArticle';

class ArticleDetailsScreen extends React.PureComponent {
  static propTypes = {
    // The news article to display
    article: React.PropTypes.object.isRequired,
    // News articles collection being displayed
    articles: React.PropTypes.array,
    // The URL of the feed that the article belongs to, this
    // prop is only necessary if the showNext is true
    feedUrl: React.PropTypes.string,
    // Whether the inline gallery should be displayed on the
    // details screen. Inline gallery displays the image
    // attachments that are not directly referenced in the
    // article body.
    showInlineGallery: React.PropTypes.bool,
    openNextArticle: React.PropTypes.func,
  };

  shouldRenderNextArticle() {
    return this.props.articles && this.props.openNextArticle;
  }

  renderUpNext() {
    const { article: { id }, articles, openNextArticle } = this.props;
    const currentArticleIndex = _.findIndex(articles, { id });

    const nextArticle = articles[currentArticleIndex + 1];
    if (nextArticle) {
      return (
        <NextArticle
          article={nextArticle}
          openNextArticle={openNextArticle}
        />
      );
    }
    return null;
  }

  renderInlineGallery() {
    const { article, showInlineGallery } = this.props;
    if (!showInlineGallery) {
      return null;
    }
    const images = _.map(article.imageAttachments, 'url');
    return (
      <ImageGallery sources={images} height={300} width={Dimensions.get('window').width} />
    );
  }

  render() {
    const { article } = this.props;
    const articleImage = getLeadImageUrl(article) ? { uri: getLeadImageUrl(article) } : undefined;
    const dateFormat = moment(article.timeUpdated).isBefore(0) ?
      null :
      (
        <Caption styleName="md-gutter-left">
          {moment(article.timeUpdated).fromNow()}
        </Caption>
      );

    return (
      <Screen styleName="full-screen paper">
        <NavigationBar
          styleName="clear"
          animationName="solidify"
          title={article.title}
          share={{
            title: article.title,
            link: article.link,
          }}
        />
        <ScrollView>
          <Image
            styleName="large-portrait placeholder"
            source={articleImage}
            animationName="hero"
          >
            <Tile animationName="hero">
              <Title styleName="centered">{article.title.toUpperCase()}</Title>
              <View styleName="horizontal collapsed" virtual>
                <Caption numberOfLines={1} styleName="collapsible">{article.author}</Caption>
                {dateFormat}
              </View>
              <Icon name="down-arrow" styleName="scroll-indicator" />
            </Tile>
          </Image>
          <View styleName="solid">
            <RichMedia
              body={article.body}
              attachments={getAttachments(article)}
            />
            {this.renderInlineGallery()}
            {this.shouldRenderNextArticle() && this.renderUpNext()}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connect((state, ownProps) => ({
  articles: getNewsFeed(state, ownProps.feedUrl),
}))(connectStyle(ext('ArticleDetailsScreen'), {})(ArticleDetailsScreen));
