import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { getRouteParams } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import { Caption, Icon, ImageBackground, Tile, Title, View } from '@shoutem/ui';
import { ext } from '../const';
import { ArticleDetailsScreen } from './ArticleDetailsScreen';

export class LargeArticleDetailsScreen extends ArticleDetailsScreen {
  renderImageGalleryPage(image) {
    const { article } = getRouteParams(this.props);

    return (
      <ImageBackground
        styleName="large-portrait placeholder"
        source={{ uri: image }}
        animationName="hero"
      >
        <Tile animationName="hero">
          <Title styleName="centered">{article.title.toUpperCase()}</Title>
          {/* Virtual prop makes View pass Tile color style to Caption */}
          <View styleName="horizontal md-gutter-top">
            <Caption styleName="collapsible" numberOfLines={1}>
              {article.newsAuthor}
            </Caption>
            <Caption styleName="md-gutter-left">
              {moment(article.timeUpdated).fromNow()}
            </Caption>
          </View>
        </Tile>
        <Icon name="down-arrow" styleName="scroll-indicator" />
      </ImageBackground>
    );
  }

  renderHeader() {
    return null;
  }
}

export default connectStyle(ext('ArticleDetailsScreen'))(
  LargeArticleDetailsScreen,
);

