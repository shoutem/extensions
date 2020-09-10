import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { isBusy, isValid } from '@shoutem/redux-io';
import { NavigationBar, closeModal } from 'shoutem.navigation';
import { I18n } from 'shoutem.i18n';
import {
  getLeadImageUrl,
  createRenderAttachment,
  ext as rssExt,
} from 'shoutem.rss';
import {
  Screen,
  ScrollView,
  View,
  Title,
  Caption,
  Image,
  Html,
  Spinner,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { PodcastPlayer } from '../components/PodcastPlayer';
import { ext } from '../const';
import { getEpisodesFeed } from '../redux';

export class EpisodeDetailsScreen extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    style: PropTypes.object,
  };

  componentWillMount() {
    const { episodeNotFound } = this.props;

    if (episodeNotFound) {
      this.handleItemNotFound();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { episodeNotFound: nextEpisodeNotFound } = nextProps;
    const { episodeNotFound } = this.props;

    if (!episodeNotFound && nextEpisodeNotFound) {
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

  renderHeaderImage() {
    const { episode } = this.props;

    const episodeImageUrl = getLeadImageUrl(episode);

    return (
      <Image
        source={episodeImageUrl ? { uri: episodeImageUrl } : undefined}
        styleName="large placeholder"
      />
    );
  }

  renderPlayer() {
    const { episode } = this.props;

    const audioFile = _.get(episode, 'audioAttachments.0.src');

    if (!audioFile) {
      return null;
    }

    return <PodcastPlayer episode={episode} url={audioFile} />;
  }

  render() {
    const { episode, data, episodeNotFound } = this.props;

    const loading = isBusy(data) || episodeNotFound;
    const author = _.get(episode, 'author', '');
    const body = _.get(episode, 'body', '');
    const link = _.get(episode, 'link', '');
    const timeUpdated = _.get(episode, 'timeUpdated', '');
    const title = _.get(episode, 'title', '');

    const momentDate = moment(timeUpdated);
    const validDate = momentDate.isAfter(0);

    return (
      <Screen styleName="full-screen paper">
        <NavigationBar share={{ link, title }} />
        {loading && (
          <View styleName="flexible vertical h-center v-center">
            <Spinner />
          </View>
        )}
        {!loading && (
          <View styleName="flexible">
            <ScrollView>
              {this.renderHeaderImage()}
              <View styleName="text-centric md-gutter-horizontal md-gutter-top vertical h-center">
                <Title numberOfLines={2}>{title.toUpperCase()}</Title>
                <View styleName="horizontal collapsed sm-gutter-top" virtual>
                  <Caption numberOfLines={1} styleName="collapsible">
                    {author}
                  </Caption>
                  {validDate && (
                    <Caption styleName="md-gutter-left">
                      {momentDate.fromNow()}
                    </Caption>
                  )}
                </View>
              </View>
              <View styleName="solid">
                <Html
                  body={body}
                  renderElement={createRenderAttachment(episode, 'image')}
                />
              </View>
            </ScrollView>
            {this.renderPlayer()}
          </View>
        )}
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { id, feedUrl } = ownProps;

  const data = getEpisodesFeed(state, feedUrl);
  const episode = _.find(data, { id });
  const episodeNotFound = isValid(data) && !episode;

  return {
    data,
    episode,
    episodeNotFound,
  };
};

export const mapDispatchToProps = { closeModal };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EpisodeDetailsScreen'))(EpisodeDetailsScreen));
