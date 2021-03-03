import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { NavigationBar } from 'shoutem.navigation';
import { getLeadImageUrl, createRenderAttachment } from 'shoutem.rss';
import { connectStyle } from '@shoutem/theme';
import {
  ScrollView,
  Screen,
  Title,
  Caption,
  Image,
  Tile,
  View,
  Html,
} from '@shoutem/ui';
import { ext } from '../const';
import {
  ArticleDetailsScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './ArticleDetailsScreen';

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
        title: article.title,
        link: article.link,
      },
    };
  }

  renderImage(imageUrl) {
    return imageUrl ? (
      <Image
        animationName="hero"
        styleName="large"
        source={{ uri: imageUrl }}
      />
    ) : null;
  }

  render() {
    const { article } = this.props;
    const imageUrl = getLeadImageUrl(article);

    const momentDate = moment.utc(article.timeUpdated);
    const dateInfo = moment.utc(momentDate).isAfter(0) ? (
      <Caption styleName="md-gutter-left">
        {moment.utc(momentDate).fromNow()}
      </Caption>
    ) : null;

    return (
      <Screen styleName="paper">
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          {this.renderImage(imageUrl)}
          <View styleName="solid">
            <Tile styleName="text-centric md-gutter-bottom xl-gutter-bottom">
              <Title>{article.title.toUpperCase()}</Title>

              <View styleName="horizontal md-gutter-top">
                <Caption numberOfLines={1}>{article.author}</Caption>
                {dateInfo}
              </View>
            </Tile>
            <Html
              body={article.body}
              renderElement={createRenderAttachment(article, 'image')}
            />
            {this.renderUpNext()}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  connectStyle(
    ext('ArticleMediumDetailsScreen'),
    {},
  )(ArticleMediumDetailsScreen),
);
