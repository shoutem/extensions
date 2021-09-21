import React from 'react';
import moment from 'moment';
import he from 'he';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Image,
  Screen,
  ScrollView,
  ShareButton,
  SimpleHtml,
  Tile,
  Title,
  View,
} from '@shoutem/ui';
import { ext } from '../const';
import { getLeadImageUrl, getAuthorName } from '../services';
import { ArticleDetailsScreen } from './ArticleDetailsScreen';

class ArticleMediumDetailsScreen extends ArticleDetailsScreen {
  static propTypes = {
    ...ArticleDetailsScreen.propTypes,
  };

  getNavBarProps() {
    const { article } = getRouteParams(this.props);

    const shareTitle = he.decode(article.title.rendered) || '';
    const url = article.link;
    const style = getLeadImageUrl(article)
      ? {
          ...composeNavigationStyles(['clear', 'solidify']),
        }
      : {
          ...composeNavigationStyles(['noBorder']),
        };

    return {
      headerRight: props => (
        <ShareButton
          styleName="clear"
          // eslint-disable-next-line react/prop-types
          iconProps={{ style: props.tintColor }}
          title={shareTitle}
          url={url}
        />
      ),
      title: '',
      ...style,
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
    const { article } = getRouteParams(this.props);

    const resolvedTitle = he.decode(article.title.rendered);
    const imageUrl = getLeadImageUrl(article);
    const momentDate = moment(article.modified);

    const dateInfo = momentDate.isAfter(0) ? (
      <Caption styleName="md-gutter-left">{momentDate.fromNow()}</Caption>
    ) : null;

    return (
      <Screen styleName="paper">
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

export default connectStyle(ext('ArticleMediumDetailsScreen'))(
  ArticleMediumDetailsScreen,
);
