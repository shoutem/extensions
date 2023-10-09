import React, { PureComponent } from 'react';
import { Dimensions } from 'react-native';
import he from 'he';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Icon,
  ImageBackground,
  ImageGallery,
  Screen,
  ScrollView,
  ShareButton,
  SimpleHtml,
  Tile,
  Title,
  View,
} from '@shoutem/ui';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { NextArticle } from '../components/NextArticle';
import { ext } from '../const';
import { getAuthorName, getLeadImageUrl } from '../services';

export class ArticleDetailsScreen extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setOptions(this.getNavBarProps());
  }

  getNavBarProps() {
    const { article } = getRouteParams(this.props);
    const shareTitle = he.decode(article.title.rendered) || '';
    const url = article.link;

    return {
      ...composeNavigationStyles(['clear', 'solidify']),
      headerRight: props => (
        <ShareButton
          // eslint-disable-next-line react/prop-types
          iconProps={{ style: props.tintColor }}
          styleName="clear"
          title={shareTitle}
          url={url}
        />
      ),
      title: '',
    };
  }

  renderUpNext() {
    const { nextArticle, openArticle } = getRouteParams(this.props);

    if (!nextArticle || !_.isFunction(openArticle)) {
      return null;
    }

    return (
      <NextArticle
        imageUrl={getLeadImageUrl(nextArticle)}
        openArticle={() => openArticle(nextArticle)}
        title={he.decode(nextArticle.title.rendered)}
      />
    );
  }

  renderInlineGallery() {
    const { article } = this.props;
    const images = _.map(article.wp.attachments.href, 'url');

    return (
      <ImageGallery
        height={300}
        sources={images}
        width={Dimensions.get('window').width}
      />
    );
  }

  render() {
    const { article, showInlineGallery } = getRouteParams(this.props);

    const articleImageUrl = getLeadImageUrl(article);
    const resolvedTitle = he.decode(article.title.rendered);
    const momentDate = moment(article.modified);

    const dateInfo = momentDate.isAfter(0) ? (
      <Caption styleName="md-gutter-left">{momentDate.fromNow()}</Caption>
    ) : null;

    return (
      <Screen styleName="paper">
        <ScrollView>
          <ImageBackground
            animationName="hero"
            source={articleImageUrl ? { uri: articleImageUrl } : undefined}
            styleName="large-portrait placeholder"
          >
            <Tile animationName="hero">
              <Title styleName="centered">{resolvedTitle.toUpperCase()}</Title>
              <View styleName="horizontal collapsed">
                <Caption numberOfLines={1} styleName="collapsible">
                  {getAuthorName(article)}
                </Caption>
                {dateInfo}
              </View>
              <Icon name="down-arrow" styleName="scroll-indicator" />
            </Tile>
          </ImageBackground>
          <View styleName="solid">
            <SimpleHtml body={article.content.rendered} />
            {showInlineGallery && this.renderInlineGallery()}
            {this.renderUpNext()}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('ArticleDetailsScreen'))(ArticleDetailsScreen);
