import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  HorizontalPager,
  Image,
  PageIndicators,
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
import { getArticleImages } from '../services/images';

export class ArticleDetailsScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    const { article } = getRouteParams(props);

    this.state = {
      images: getArticleImages(article),
      selectedImageIndex: 0,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());
  }

  getNavBarProps() {
    const { article } = getRouteParams(this.props);

    const title = article.title || '';
    const headerRight = props => {
      if (!article.link) {
        return null;
      }

      return (
        <ShareButton
          // eslint-disable-next-line react/prop-types
          iconProps={{ style: props.tintColor }}
          styleName="clear"
          title={article.title}
          url={article.link}
        />
      );
    };

    if (this.isNavigationBarClear()) {
      if (article.image) {
        // If navigation bar is clear and image exists, navigation bar should be initially clear
        // but after scrolling down navigation bar should appear (solidify animation)
        return {
          ...composeNavigationStyles(['clear', 'solidify']),
          headerRight,
          title,
        };
      }
      // If navigation bar is clear, but there is no image, navigation bar should be set to solid,
      // but boxing animation should be applied so title appears after scrolling down

      return {
        ...composeNavigationStyles(['boxing']),
        headerRight,
        title,
      };
    }

    return {
      headerRight: props => (
        <ShareButton
          // eslint-disable-next-line react/prop-types
          iconProps={{ style: props.tintColor }}
          styleName="clear"
          title={article.title}
          url={article.link}
        />
      ),
      title,
    };
  }

  isNavigationBarClear() {
    const { screenSettings } = getRouteParams(this.props);
    return screenSettings.navigationBarStyle === 'clear';
  }

  renderUpNext() {
    const { nextArticle, openArticle } = getRouteParams(this.props);

    if (nextArticle && openArticle) {
      return (
        <NextArticle
          title={nextArticle.title}
          imageUrl={_.get(nextArticle, 'image.url')}
          openArticle={() => openArticle(nextArticle)}
        />
      );
    }
    return null;
  }

  setSelectedImageIndex(selectedImageIndex) {
    this.setState({ selectedImageIndex });
  }

  renderGalleryOverlay() {
    const { images, selectedImageIndex } = this.state;
    const imageCount = _.size(images);

    if (imageCount <= 1) {
      return null;
    }

    return (
      <PageIndicators
        activeIndex={selectedImageIndex}
        count={imageCount}
        styleName="overlay-bottom"
      />
    );
  }

  renderImageGalleryPage(image) {
    return (
      <Image styleName="large" source={{ uri: image }} animationName="hero" />
    );
  }

  renderImage() {
    const { images, selectedImageIndex } = this.state;

    if (_.isEmpty(images)) {
      return null;
    }

    return (
      <HorizontalPager
        bounces
        data={images}
        onIndexSelected={this.setSelectedImageIndex}
        renderOverlay={this.renderGalleryOverlay}
        renderPage={this.renderImageGalleryPage}
        selectedIndex={selectedImageIndex}
        surroundingPagesToLoad={1}
      />
    );
  }

  renderHeader() {
    const { article, shortcut } = getRouteParams(this.props);
    const { screen: canonicalType, screens } = shortcut;
    const { hideModificationTimestamp } = _.find(screens, { canonicalType });

    return (
      <Tile styleName="text-centric md-gutter-bottom">
        <Title>{article.title.toUpperCase()}</Title>
        <View styleName="horizontal md-gutter-top">
          <Caption numberOfLines={1}>{article.newsAuthor}</Caption>
          {!!hideModificationTimestamp && (
            <Caption styleName="md-gutter-left">
              {moment(article.timeUpdated).fromNow()}
            </Caption>
          )}
        </View>
      </Tile>
    );
  }

  render() {
    const { style } = this.props;
    const { article } = getRouteParams(this.props);

    return (
      <Screen styleName="paper">
        <ScrollView>
          {this.renderImage()}
          <View styleName="solid">
            {this.renderHeader()}
            <View styleName="sm-gutter-horizontal md-gutter-vertical">
              <SimpleHtml body={article.body} style={style.outerPadding} />
            </View>
            {this.renderUpNext()}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

ArticleDetailsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object,
};

ArticleDetailsScreen.defaultProps = {
  style: {},
};

export default connectStyle(ext('ArticleDetailsScreen'))(ArticleDetailsScreen);
