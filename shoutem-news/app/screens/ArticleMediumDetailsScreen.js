import React from 'react';
import { connectStyle } from '@shoutem/theme';
import {
  ScrollView,
  Screen,
  Title,
  Caption,
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

class ArticleMediumDetailsScreen extends React.Component {
  static propTypes = {
    article: React.PropTypes.object.isRequired,
    nextArticle: React.PropTypes.object,
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

  renderImage() {
    const { article } = this.props;

    if (article.image) {
      return (
        <Image
          styleName="large"
          source={{ uri: _.get(article, 'image.url') }}
          animationName="hero"
        />
      );
    }
    return null;
  }

  render() {
    const { article } = this.props;
    const screenStyle = article.image ? 'full-screen paper' : 'paper';
    const styleName = article.image ? 'clear' : undefined;
    const animationName = article.image ? 'solidify' : 'boxing';

    return (
      <Screen styleName={screenStyle}>
        <NavigationBar
          styleName={styleName}
          animationName={animationName}
          share={{
            link: article.link,
            title: article.title,
          }}
          title={article.title}
        />
        <ScrollView>
          {this.renderImage()}

          <View styleName="solid">
            <Tile styleName="text-centric md-gutter-bottom">
              <Title>{article.title.toUpperCase()}</Title>

              <View styleName="horizontal md-gutter-top xl-gutter-bottom">
                <Caption numberOfLines={1}>{article.newsAuthor}</Caption>
                <Caption styleName="md-gutter-left">
                  {moment(article.timeUpdated).fromNow()}
                </Caption>
              </View>
            </Tile>

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

export default connectStyle(ext('ArticleMediumDetailsScreen'))(ArticleMediumDetailsScreen);
