import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import moment from 'moment';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Alert, Platform, Share } from 'react-native';
import ActionSheet from 'react-native-action-sheet';
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
  Button,
  Caption,
  Html,
  Icon,
  Image,
  Screen,
  ScrollView,
  Spinner,
  Title,
  View,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { PodcastPlayer } from '../components';
import { ext } from '../const';
import {
  deleteEpisode,
  downloadEpisode,
  getDownloadedEpisode,
  getEpisodesFeed,
} from '../redux';

export class EpisodeDetailsScreen extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

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

  openActionSheet() {
    const { enableDownload, episode, downloadedEpisode } = this.props;

    const downloadInProgress = _.get(downloadedEpisode, 'downloadInProgress');
    const url = _.get(episode, 'link', '');
    const title = _.get(episode, 'title', '');

    const options = [
      I18n.t(ext('actionSheetCancelOption')),
      I18n.t(ext('actionSheetShareOption')),
    ];

    if (enableDownload && !downloadedEpisode) {
      options.push(I18n.t(ext('actionSheetDownloadOption')));
    }

    // If downloads are disabled after a user has already downloaded an episode
    // we must allow the user to delete the episode to clear space.
    if (downloadedEpisode && !downloadInProgress) {
      options.push(I18n.t(ext('actionSheetDeleteOption')));
    }

    if (downloadInProgress) {
      options.push(I18n.t(ext('actionSheetDownloadInProgress')));
    }

    ActionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 0,
        tintColor: 'black',
      },
      index => {
        if (index === 1) {
          Share.share({
            title,
            // URL property isn't supported on Android, so we are
            // including it as the message for now.
            message: Platform.OS === 'android' ? url : null,
            url,
          });
        }

        if (index === 2 && !downloadInProgress) {
          if (downloadedEpisode) {
            const { deleteEpisode } = this.props;

            deleteEpisode(downloadedEpisode.id, downloadedEpisode.path);
          } else {
            const { downloadEpisode, feedUrl } = this.props;

            downloadEpisode(episode.id, feedUrl);
          }
        }
      },
    );
  }

  getNavBarProps() {
    const { enableDownload, episode, downloadedEpisode } = this.props;

    const link = _.get(episode, 'link', '');
    const title = _.get(episode, 'title', '');

    return enableDownload || downloadedEpisode
      ? {
          renderRightComponent: () => (
            <Button onPress={this.openActionSheet}>
              <Icon name="more-horizontal" />
            </Button>
          ),
        }
      : {
          share: { link, title },
        };
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
    const { downloadedEpisode, episode, id } = this.props;

    const audioFile = _.get(episode, 'audioAttachments.0.src');

    if (!audioFile) {
      return null;
    }

    return (
      <PodcastPlayer
        downloadedEpisode={downloadedEpisode}
        episode={episode}
        episodeId={id}
        url={audioFile}
      />
    );
  }

  render() {
    const { data, episode, episodeNotFound } = this.props;

    const loading = isBusy(data) || episodeNotFound;
    const author = _.get(episode, 'author', '');
    const body = _.get(episode, 'body', '');
    const timeUpdated = _.get(episode, 'timeUpdated', '');
    const title = _.get(episode, 'title', '');

    const momentDate = moment(timeUpdated);
    const validDate = momentDate.isAfter(0);

    return (
      <Screen styleName="paper">
        <NavigationBar {...this.getNavBarProps()} />
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
              {this.renderPlayer()}
              <View styleName="solid">
                <Html
                  body={body}
                  renderElement={createRenderAttachment(episode, 'image')}
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
  const { shortcut, id, feedUrl } = ownProps;
  const enableDownload = shortcut.settings?.enableDownload;

  const data = getEpisodesFeed(state, feedUrl);
  const downloadedEpisode = getDownloadedEpisode(state, id);
  const episode = _.find(data, { id });
  const episodeNotFound = isValid(data) && !episode;

  return {
    data,
    downloadedEpisode,
    enableDownload,
    episode,
    episodeNotFound,
  };
};

export const mapDispatchToProps = {
  closeModal,
  deleteEpisode,
  downloadEpisode,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EpisodeDetailsScreen'))(EpisodeDetailsScreen));
