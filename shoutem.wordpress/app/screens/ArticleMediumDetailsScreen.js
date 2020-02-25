import React from 'react';
import moment from 'moment';

import {
  ScrollView,
  Screen,
  Title,
  Caption,
  Image,
  Tile,
  View,
  SimpleHtml,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { NavigationBar } from 'shoutem.navigation';

import { ArticleDetailsScreen } from './ArticleDetailsScreen';
import { getLeadImageUrl, resolveArticleTitle, getAuthorName } from '../services';
import { ext } from '../const';

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
        title: resolveArticleTitle(article.title.rendered),
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

    const imageUrl = getLeadImageUrl(article);
    const screenStyle = imageUrl ? 'full-screen paper' : 'paper';
    const momentDate = moment(article.modified);

    const dateInfo = momentDate.isAfter(0) ? (
      <Caption styleName="md-gutter-left">{momentDate.fromNow()}</Caption>
    ) : null;

    const resolvedTitle = resolveArticleTitle(article.title.rendered);

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
