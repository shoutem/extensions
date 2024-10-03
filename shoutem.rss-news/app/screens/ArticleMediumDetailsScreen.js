import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import moment from 'moment';
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
import { composeNavigationStyles } from 'shoutem.navigation';
import { getImageAttachments, getLeadImageUrl } from 'shoutem.rss';
import { VideoGallery } from '../components/VideoGallery';
import { ext } from '../const';
import { ArticleDetailsScreen, mapStateToProps } from './ArticleDetailsScreen';

class ArticleMediumDetailsScreen extends ArticleDetailsScreen {
  static propTypes = {
    ...ArticleDetailsScreen.propTypes,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    props.navigation.setOptions(this.getNavBarProps());
  }

  componentDidMount() {}

  getNavBarProps() {
    const { article } = this.props;

    const styleName = getLeadImageUrl(article) ? 'clear' : 'noBorder';

    const articleTitle = _.get(article, 'title', '');
    const articleLink = _.get(article, 'link', '');

    return {
      headerRight: props => (
        <ShareButton
          styleName="clear"
          title={articleTitle}
          url={articleLink}
          iconProps={{ style: props.tintColor }}
        />
      ),
      title: '',
      ...composeNavigationStyles([
        styleName,
        getLeadImageUrl(article) && 'solidify',
      ]),
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

    const videoAttachments = _.get(article, 'videoAttachments', []);
    const imageAttachments = getImageAttachments(article);
    const body = _.get(article, 'body', '');

    const momentDate = moment.utc(article.timeUpdated);
    const dateInfo = moment.utc(momentDate).isAfter(0) ? (
      <Caption styleName="md-gutter-left">
        {moment.utc(momentDate).fromNow()}
      </Caption>
    ) : null;

    return (
      <Screen styleName="paper">
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
            <SimpleHtml body={body} attachments={imageAttachments} />
            <VideoGallery videos={videoAttachments} />
            {this.renderUpNext()}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connect(
  mapStateToProps,
  null,
)(connectStyle(ext('ArticleMediumDetailsScreen'))(ArticleMediumDetailsScreen));
