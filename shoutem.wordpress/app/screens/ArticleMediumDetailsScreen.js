import React from 'react';
import moment from 'moment';
import he from 'he';

import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Image,
  Screen,
  ScrollView,
  SimpleHtml,
  Tile,
  Title,
  View,
} from '@shoutem/ui';

import { NavigationBar } from 'shoutem.navigation';

import { ext } from '../const';
import { getLeadImageUrl, getAuthorName } from '../services';
import { ArticleDetailsScreen } from './ArticleDetailsScreen';

class ArticleMediumDetailsScreen extends ArticleDetailsScreen {
  static propTypes = {
    ...ArticleDetailsScreen.propTypes,
  };

  getNavBarProps() {
    const { article } = this.props;

    return {
      styleName: getLeadImageUrl(article) ? 'clear' : 'no-border',
      animationName: getLeadImageUrl(article) ? 'solidify' : '',
      share: {
        title: he.decode(article.title.rendered),
        link: article.link,
      },
    };
  }

  renderImage(imageUrl) {
    return imageUrl ? (
      <Image
        animationName="hero"
        source={{ uri: imageUrl }}
        styleName="large"
      />
    ) : null;
  }

  render() {
    const { article } = this.props;

    const resolvedTitle = he.decode(article.title.rendered);
    const imageUrl = getLeadImageUrl(article);
    const screenStyle = imageUrl ? 'full-screen paper' : 'paper';
    const momentDate = moment(article.modified);

    const dateInfo = momentDate.isAfter(0) ? (
      <Caption styleName="md-gutter-left">{momentDate.fromNow()}</Caption>
    ) : null;

    return (
      <Screen styleName={screenStyle}>
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          {this.renderImage(imageUrl)}
          <View styleName="solid">
            <Tile styleName="text-centric md-gutter-bottom xl-gutter-bottom">
              <Title>{resolvedTitle.toUpperCase()}</Title>

              <View styleName="horizontal md-gutter-top">
                <Caption numberOfLines={1}>{getAuthorName(article)}</Caption>
                {dateInfo}
              </View>
            </Tile>
            <SimpleHtml body={article.content.rendered} />
            {this.renderUpNext()}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('ArticleMediumDetailsScreen'))(ArticleMediumDetailsScreen);
