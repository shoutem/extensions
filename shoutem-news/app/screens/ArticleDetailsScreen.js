import React from 'react';
import { connectStyle } from '@shoutem/theme';
import {
  ScrollView,
  Screen,
  Title,
  Caption,
  Icon,
  Image,
  Tile,
  RichMedia,
  View,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import * as _ from 'lodash';
import moment from 'moment';

import { ext } from '../const';
import NextArticle from '../components/NextArticle';

class ArticleDetailsScreen extends React.Component {
  static propTypes = {
    // The news article to display
    article: React.PropTypes.object.isRequired,
    // News articles collection being displayed
    articles: React.PropTypes.array,
    // The next article, if this article is defined, the
    // up next view will be displayed on this screen
    nextArticle: React.PropTypes.object,
    // A function that will open the given article, this
    // function is required to show the up next view
    openArticle: React.PropTypes.func,
  };

  renderUpNext() {
    const { nextArticle, openArticle } = this.props;
    if (nextArticle && openArticle) {
      return (
        <NextArticle article={nextArticle} openArticle={openArticle} />
      );
    }

    return null;
  }

  render() {
    const { article } = this.props;

    return (
      <Screen styleName="full-screen paper">
        <NavigationBar
          styleName="clear"
          animationName="solidify"
          share={{
            title: article.title,
            text: article.summary,
            link: article.link,
          }}
        />
        <ScrollView>
          <Image
            styleName="large-portrait"
            source={{ uri: _.get(article, 'image.url') }}
            animationName="hero"
          >
            <Tile animationName="hero">
              <Title styleName="centered">{article.title.toUpperCase()}</Title>
              {/* Virtual prop makes View pass Tile color style to Caption */}
              <View styleName="horizontal md-gutter-top" virtual>
                <Caption styleName="collapsible" numberOfLines={1}>{article.newsAuthor}</Caption>
                <Caption styleName="md-gutter-left">
                  {moment(article.timeUpdated).fromNow()}
                </Caption>
              </View>
            </Tile>
            <Icon name="down-arrow" styleName="scroll-indicator" />
          </Image>
          <View styleName="solid">
            <RichMedia
              body={article.body}
              attachments={article.attachments}
            />
            {this.renderUpNext()}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('ArticleDetailsScreen'))(ArticleDetailsScreen);
