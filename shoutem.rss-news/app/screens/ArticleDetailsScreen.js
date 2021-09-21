import React, { PureComponent } from 'react';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Dimensions, Alert } from 'react-native';
import { connect } from 'react-redux';
import { I18n } from 'shoutem.i18n';
import {
  closeModal,
  getRouteParams,
  composeNavigationStyles,
} from 'shoutem.navigation';
import {
  getLeadImageUrl,
  getImageAttachments,
  ext as rssExt,
} from 'shoutem.rss';
import { isBusy, isValid } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  Screen,
  ScrollView,
  View,
  Tile,
  Title,
  Caption,
  Icon,
  ImageBackground,
  ImageGallery,
  SimpleHtml,
  Spinner,
  ShareButton,
} from '@shoutem/ui';
import { NextArticle } from '../components/NextArticle';
import { VideoGallery } from '../components/VideoGallery';
import { ext } from '../const';
import { getNewsFeed } from '../redux';

export class ArticleDetailsScreen extends PureComponent {
  static propTypes = {
    // The next article, if this article is defined, the
    // up next view will be displayed on this screen
    nextArticle: PropTypes.object,
    // Whether the inline gallery should be displayed on the
    // details screen. Inline gallery displays the image
    // attachments that are not directly referenced in the
    // article body.
    showInlineGallery: PropTypes.bool,
    openNextArticle: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    props.navigation.setOptions({
      ...composeNavigationStyles(['clear', 'solidify']),
      title: '',
    });
  }

  componentWillMount() {
    const { articleNotFound } = this.props;

    if (articleNotFound) {
      this.handleItemNotFound();
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setOptions(this.getNavBarProps());
  }

  componentWillReceiveProps(nextProps) {
    const { articleNotFound: nextarticleNotFound } = nextProps;
    const { articleNotFound } = this.props;

    if (!articleNotFound && nextarticleNotFound) {
      this.handleItemNotFound();
    }
  }

  getNavBarProps() {
    const { article } = this.props;

    const articleTitle = _.get(article, 'title', '');
    const articleLink = _.get(article, 'link', '');

    return {
      headerRight: props => {
        if (!articleLink) {
          return null;
        }

        return (
          <ShareButton
            // eslint-disable-next-line react/prop-types
            iconProps={{ style: props.tintColor }}
            styleName="clear"
            title={articleTitle}
            url={articleLink}
          />
        );
      },
    };
  }

  handleItemNotFound() {
    const okButton = {
      onPress: closeModal,
    };

    return Alert.alert(
      I18n.t(rssExt('itemNotFoundTitle')),
      I18n.t(rssExt('itemNotFoundMessage')),
      [okButton],
    );
  }

  renderUpNext() {
    const { nextArticle } = this.props;
    const { openArticle } = getRouteParams(this.props);

    if (nextArticle && openArticle) {
      return (
        <NextArticle
          title={nextArticle.title}
          imageUrl={getLeadImageUrl(nextArticle)}
          openArticle={() => openArticle(nextArticle)}
        />
      );
    }

    return null;
  }

  renderInlineGallery() {
    const { article } = this.props;

    if (!article) {
      return null;
    }

    const { showInlineGallery } = this.props;
    const { imageAttachments } = article;

    if (!showInlineGallery) {
      return null;
    }

    const images = _.map(imageAttachments, 'url');

    if (!_.isEmpty(images)) {
      return (
        <ImageGallery
          sources={images}
          height={300}
          width={Dimensions.get('window').width}
        />
      );
    }

    return null;
  }

  render() {
    const { data, article, articleNotFound } = this.props;

    const timeUpdated = _.get(article, 'timeUpdated', '');
    const title = _.get(article, 'title', '');
    const author = _.get(article, 'author', '');
    const body = _.get(article, 'body', '');
    const videoAttachments = _.get(article, 'videoAttachments', []);
    const imageAttachments = getImageAttachments(article);

    const loading = isBusy(data) || articleNotFound;
    const articleImageUrl = getLeadImageUrl(article);
    const momentDate = moment.utc(timeUpdated);

    const dateInfo = moment.utc(momentDate).isAfter(0) ? (
      <Caption styleName="md-gutter-left">
        {moment.utc(momentDate).fromNow()}
      </Caption>
    ) : null;

    return (
      <Screen styleName="paper">
        {loading && (
          <View styleName="vertical flexible h-center v-center">
            <Spinner />
          </View>
        )}
        {!loading && (
          <View styleName="flexible">
            <ScrollView>
              <ImageBackground
                styleName="large-portrait placeholder"
                source={articleImageUrl ? { uri: articleImageUrl } : undefined}
                animationName="hero"
              >
                <Tile animationName="hero">
                  <Title styleName="centered">{title.toUpperCase()}</Title>
                  <View styleName="horizontal collapsed">
                    <Caption numberOfLines={1} styleName="collapsible">
                      {author}
                    </Caption>
                    {dateInfo}
                  </View>
                  <Icon name="down-arrow" styleName="scroll-indicator" />
                </Tile>
              </ImageBackground>
              <View styleName="solid">
                <SimpleHtml body={body} attachments={imageAttachments} />
                {this.renderInlineGallery()}
                <VideoGallery videos={videoAttachments} />
                {this.renderUpNext()}
              </View>
            </ScrollView>
          </View>
        )}
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { id, feedUrl } = getRouteParams(ownProps);

  const data = getNewsFeed(state, feedUrl);
  const article = _.find(data, { id });
  const articleNotFound = isValid(data) && !article;

  return {
    data,
    article,
    articleNotFound,
  };
};

export default connect(
  mapStateToProps,
  null,
)(connectStyle(ext('ArticleDetailsScreen'))(ArticleDetailsScreen));
