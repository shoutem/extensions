import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Dimensions } from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import he from 'he';
import {
  Screen,
  ScrollView,
  View,
  Tile,
  Title,
  Caption,
  Icon,
  ImageBackground,
  ImageGallery,
  SimpleHtml,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { NavigationBar } from 'shoutem.navigation';

import { NextArticle } from '../components/NextArticle';
import { getLeadImageUrl, getAuthorName } from '../services';
import { ext } from '../const';

export class ArticleDetailsScreen extends PureComponent {
  static propTypes = {
    // The news article to display
    article: PropTypes.object.isRequired,
    // The next article, if this article is defined, the
    // up next view will be displayed on this screen
    nextArticle: PropTypes.object,
    // A function that will open the given article, this
    // function is required to show the up next view
    openArticle: PropTypes.func,
    // Whether the inline gallery should be displayed on the
    // details screen. Inline gallery displays the image
    // attachments that are not directly referenced in the
    // article body.
    showInlineGallery: PropTypes.bool,
    openNextArticle: PropTypes.func,
  };

  renderUpNext() {
    const { nextArticle, openArticle } = this.props;
    if (nextArticle && openArticle) {
      return (
        <NextArticle
          imageUrl={getLeadImageUrl(nextArticle)}
          openArticle={() => openArticle(nextArticle)}
          title={nextArticle.title.rendered}
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
    const images = _.map(article.wp.attachments.href, 'url');

    return (
      <ImageGallery height={300} sources={images} width={Dimensions.get('window').width} />
    );
  }

  render() {
    const { article } = this.props;
    const articleImageUrl = getLeadImageUrl(article);
    const momentDate = moment(article.modified);

    const dateInfo = momentDate.isAfter(0) ? (
      <Caption styleName="md-gutter-left">
        {momentDate.fromNow()}
      </Caption>
    ) : null;

    const resolvedTitle = he.decode(article.title.rendered);

    return (

      <Screen styleName="full-screen paper">
        <NavigationBar
          animationName="solidify"
          share={{
            title: resolvedTitle,
            link: article.link,
          }}
          styleName="clear"
          title={article.title.rendered}
        />
        <ScrollView>
          <ImageBackground
            animationName="hero"
            source={articleImageUrl ? { uri: articleImageUrl } : undefined}
            styleName="large-portrait placeholder"
          >
            <Tile animationName="hero">
              <Title styleName="centered">{resolvedTitle.toUpperCase()}</Title>
              <View styleName="horizontal collapsed" virtual>
                <Caption numberOfLines={1} styleName="collapsible">{getAuthorName(article)}</Caption>
                {dateInfo}
              </View>
              <Icon name="down-arrow" styleName="scroll-indicator" />
            </Tile>
          </ImageBackground>
          <View styleName="solid">
            <SimpleHtml body={article.content.rendered} />
            {this.renderInlineGallery()}
            {this.renderUpNext()}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('ArticleDetailsScreen'))(ArticleDetailsScreen);
