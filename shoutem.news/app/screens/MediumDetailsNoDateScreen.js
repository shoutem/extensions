import React from 'react';
import { getRouteParams } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import { Caption, Tile, Title, View } from '@shoutem/ui';
import { ext } from '../const';
import { ArticleDetailsScreen } from './ArticleDetailsScreen';

export class MediumDetailsNoDateScreen extends ArticleDetailsScreen {
  renderHeader() {
    const { article } = getRouteParams(this.props);

    return (
      <Tile styleName="text-centric md-gutter-bottom">
        <Title>{article.title.toUpperCase()}</Title>
        <View styleName="horizontal md-gutter-top">
          <Caption numberOfLines={1}>{article.newsAuthor}</Caption>
        </View>
      </Tile>
    );
  }
}

export default connectStyle(ext('ArticleDetailsScreen'))(
  MediumDetailsNoDateScreen,
);
