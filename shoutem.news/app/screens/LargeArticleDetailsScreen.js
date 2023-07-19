import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connectStyle } from '@shoutem/theme';
import { Caption, Icon, ImageBackground, Tile, Title, View } from '@shoutem/ui';
import { getRouteParams } from 'shoutem.navigation';
import { ext } from '../const';
import { ArticleDetailsScreen } from './ArticleDetailsScreen';

export class LargeArticleDetailsScreen extends ArticleDetailsScreen {
  renderImageGalleryPage(image) {
    const { article, shortcut } = getRouteParams(this.props);
    const { screen: canonicalType, screens } = shortcut;
    const { hideModificationTimestamp } = _.find(screens, { canonicalType });

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
            {!!hideModificationTimestamp && (
              <Caption styleName="md-gutter-left">
                {moment(article.timeUpdated).fromNow()}
              </Caption>
            )}
          </View>
        </Tile>
        <Icon name="down-arrow" styleName="scroll-indicator" />
      </ImageBackground>
    );
  }

  renderHeader() {
    const { style } = this.props;
    const { article, shortcut } = getRouteParams(this.props);

    if (article.image) {
      return null;
    }

    const { screen: canonicalType, screens } = shortcut;
    const { hideModificationTimestamp } = _.find(screens, { canonicalType });

    return (
      <View styleName="vertical h-center v-center md-gutter">
        <Title style={style.title}>{article.title.toUpperCase()}</Title>
        <View styleName="horizontal md-gutter-top">
          <Caption styleName="collapsible" numberOfLines={1}>
            {article.newsAuthor}
          </Caption>
          {!!hideModificationTimestamp && (
            <Caption styleName="md-gutter-left">
              {moment(article.timeUpdated).fromNow()}
            </Caption>
          )}
        </View>
      </View>
    );
  }
}

LargeArticleDetailsScreen.propTypes = { ...ArticleDetailsScreen.propTypes };

export default connectStyle(ext('ArticleDetailsScreen'))(
  LargeArticleDetailsScreen,
);
