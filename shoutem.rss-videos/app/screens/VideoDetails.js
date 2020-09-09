import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Alert } from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'react-redux';
import { isBusy, isValid } from '@shoutem/redux-io';
import {
  ScrollView,
  Title,
  Video,
  Screen,
  Caption,
  Tile,
  View,
  SimpleHtml,
  Spinner,
} from '@shoutem/ui';
import { NavigationBar, closeModal } from 'shoutem.navigation';
import { I18n } from 'shoutem.i18n';
import { createRenderAttachment, ext as rssExt } from 'shoutem.rss';
import { getVideosFeed } from '../redux';

export class VideoDetails extends PureComponent {
  static propTypes = {
    // The video article to display
    id: PropTypes.string.isRequired,
  };

  componentWillMount() {
    const { videoNotFound } = this.props;

    if (videoNotFound) {
      this.handleItemNotFound();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { videoNotFound: nextVideoNotFound } = nextProps;
    const { videoNotFound } = this.props;

    if (!videoNotFound && nextVideoNotFound) {
      this.handleItemNotFound();
    }
  }

  handleItemNotFound() {
    const { closeModal } = this.props;

    const okButton = {
      onPress: () => closeModal(),
    };

    return Alert.alert(
      I18n.t(rssExt('itemNotFoundTitle')),
      I18n.t(rssExt('itemNotFoundMessage')),
      [okButton],
    );
  }

  render() {
    const { video, data, videoNotFound } = this.props;
    const videoAttachments = _.get(video, 'videoAttachments', []);
    const title = _.get(video, 'title', '');
    const timeCreated = _.get(video, 'timeCreated', '');
    const body = _.get(video, 'body', null);

    const loading = isBusy(data) || videoNotFound;

    if (!video) {
      return null;
    }

    const videoAttachment =
      videoAttachments.length > 0 ? videoAttachments[0] : null;

    const videoComponent = videoAttachment ? (
      <Video source={{ uri: videoAttachment.src }} />
    ) : null;

    return (
      <Screen styleName="paper">
        <NavigationBar
          share={{
            title: title,
            link: videoAttachment ? videoAttachment.src : '',
          }}
          title={title}
        />
        {loading && (
          <View styleName="vertical flexible h-center v-center">
            <Spinner />
          </View>
        )}
        {!loading && (
          <View styleName="flexible">
            <ScrollView>
              {videoComponent}
              <Tile styleName="text-centric">
                <Title styleName="md-gutter-bottom">{title}</Title>
                <Caption>{moment(timeCreated).fromNow()}</Caption>
              </Tile>

              <View styleName="solid">
                <SimpleHtml
                  body={body}
                  renderElement={createRenderAttachment(video, 'video')}
                />
              </View>
            </ScrollView>
          </View>
        )}
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { id, feedUrl } = ownProps;

  const data = getVideosFeed(state, feedUrl);
  const video = _.find(data, { id });
  const videoNotFound = isValid(data) && !video;

  return {
    data,
    video,
    videoNotFound,
  };
};

export const mapDispatchToProps = {
  closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoDetails);
