import React, { PureComponent } from 'react';
import { Alert, Platform, Share } from 'react-native';
import ActionSheet from 'react-native-action-sheet';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { isBusy, isValid } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  Icon,
  Image,
  Screen,
  ScrollView,
  ShareButton,
  SimpleHtml,
  Spinner,
  Title,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { closeModal, getRouteParams } from 'shoutem.navigation';
import { ext as rssExt, getLeadImageUrl } from 'shoutem.rss';
import { FavoriteButton, PodcastPlayer } from '../components';
import { ext } from '../const';
import {
  deleteEpisode,
  downloadEpisode,
  favoriteEpisode,
  getDownloadedEpisode,
  getEpisodesFeed,
  getHasFavorites,
  getIsFavorited,
  unfavoriteEpisode,
} from '../redux';

export class EpisodeDetailsScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    const { episodeNotFound, navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());

    if (episodeNotFound) {
      this.handleItemNotFound();
    }
  }

  componentDidUpdate(prevProps) {
    const { episodeNotFound: prevEpisodeNotFound } = prevProps;
    const { episodeNotFound } = this.props;

    if (!prevEpisodeNotFound && episodeNotFound) {
      this.handleItemNotFound();
    }
  }

  deleteDownload() {
    const { deleteEpisode, downloadedEpisode } = this.props;

    deleteEpisode(downloadedEpisode);
  }

  startDownload() {
    const { episode, downloadEpisode } = this.props;
    const { feedUrl } = getRouteParams(this.props);

    downloadEpisode(episode.id, feedUrl);
  }

  openActionSheet() {
    const {
      actionSheetOptions,
      downloadInProgress,
      downloadedEpisode,
      enableSharing,
      episode,
      hasFavorites,
    } = this.props;

    const url = _.get(episode, 'link', '');
    const audioAttachmentUrl = episode.audioAttachments[0]?.src || '';
    const resolvedUrl = url || audioAttachmentUrl;
    const title = _.get(episode, 'title', '');

    ActionSheet.showActionSheetWithOptions(
      {
        options: actionSheetOptions,
        cancelButtonIndex: 0,
        tintColor: 'black',
      },
      index => {
        // Index 1 can only be Share or Favorite
        if (index === 1) {
          if (enableSharing) {
            Share.share({
              title,
              // URL property isn't supported on Android, so we are
              // including it as the message for now.
              message: Platform.OS === 'android' ? resolvedUrl : null,
              url: resolvedUrl,
            });
          } else {
            this.onFavoritePress();
          }
        }

        // Index two can only be Favorite and Download
        if (index === 2) {
          if (enableSharing && hasFavorites) {
            this.onFavoritePress();
          }

          if (enableSharing && !hasFavorites && !downloadInProgress) {
            if (downloadedEpisode) {
              this.deleteDownload();
            } else {
              this.startDownload();
            }
          }

          if (!enableSharing && hasFavorites && !downloadInProgress) {
            if (downloadedEpisode) {
              this.deleteDownload();
            } else {
              this.startDownload();
            }
          }
        }

        if (index === 3 && !downloadInProgress) {
          if (downloadedEpisode) {
            this.deleteDownload();
          } else {
            this.startDownload();
          }
        }
      },
    );
  }

  getNavBarProps() {
    const { actionSheetOptions } = this.props;

    return {
      headerRight: actionSheetOptions.length > 1 ? this.headerRight : null,
      title: '',
    };
  }

  onFavoritePress() {
    const {
      enableDownload,
      episode,
      favoriteEpisode,
      feedUrl,
      isFavorited,
      unfavoriteEpisode,
    } = this.props;

    return isFavorited
      ? unfavoriteEpisode(episode.id)
      : favoriteEpisode(episode, enableDownload, feedUrl);
  }

  headerRight(props) {
    const {
      downloadedEpisode,
      downloadInProgress,
      enableDownload,
      enableSharing,
      episode,
      hasFavorites,
      isFavorited,
    } = this.props;

    const hasDownloadOption = enableDownload || downloadedEpisode;

    if (!hasDownloadOption && !enableSharing && !hasFavorites) {
      return null;
    }

    if (
      (hasDownloadOption && enableSharing) ||
      (hasDownloadOption && hasFavorites) ||
      (enableSharing && hasFavorites)
    ) {
      return (
        <Button styleName="clear tight" onPress={this.openActionSheet}>
          <Icon name="more-horizontal" style={props.tintColor} />
        </Button>
      );
    }

    if (hasDownloadOption && !enableSharing && !hasFavorites) {
      if (downloadInProgress) {
        return <Spinner />;
      }

      const iconName = downloadedEpisode ? 'delete' : 'download';
      const handleDownloadPress = downloadedEpisode
        ? this.deleteDownload
        : this.startDownload;

      return (
        <Button styleName="clear tight" onPress={handleDownloadPress}>
          <Icon name={iconName} style={props.tintColor} />
        </Button>
      );
    }

    if (!hasDownloadOption && !enableSharing && hasFavorites) {
      return (
        <FavoriteButton
          onPress={this.onFavoritePress}
          isFavorited={isFavorited}
          iconColor={props.tintColor}
        />
      );
    }

    const title = episode.title || '';
    const url = episode.link || '';
    const audioAttachmentUrl = episode.audioAttachments[0]?.src || '';
    const resolvedUrl = url || audioAttachmentUrl;

    return (
      <ShareButton
        iconProps={{ style: props.tintColor }}
        styleName="clear"
        title={title}
        url={resolvedUrl}
      />
    );
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
                <View styleName="horizontal collapsed sm-gutter-top">
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
                <SimpleHtml body={body} />
              </View>
            </ScrollView>
            {this.renderPlayer()}
          </View>
        )}
      </Screen>
    );
  }
}

EpisodeDetailsScreen.propTypes = {
  actionSheetOptions: PropTypes.array.isRequired,
  deleteEpisode: PropTypes.func.isRequired,
  downloadEpisode: PropTypes.func.isRequired,
  downloadInProgress: PropTypes.bool.isRequired,
  enableDownload: PropTypes.bool.isRequired,
  enableSharing: PropTypes.bool.isRequired,
  episodeNotFound: PropTypes.bool.isRequired,
  favoriteEpisode: PropTypes.func.isRequired,
  feedUrl: PropTypes.func.isRequired,
  hasFavorites: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  isFavorited: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  unfavoriteEpisode: PropTypes.func.isRequired,
  data: PropTypes.array,
  downloadedEpisode: PropTypes.object,
  episode: PropTypes.object,
};

EpisodeDetailsScreen.defaultProps = {
  data: undefined,
  downloadedEpisode: undefined,
  episode: undefined,
};

export function mapStateToProps(state, ownProps) {
  const {
    enableDownload = false,
    feedUrl,
    id,
    screenSettings: { enableSharing = false },
    episode: favoritedEpisode,
  } = getRouteParams(ownProps);

  const data = getEpisodesFeed(state, feedUrl);
  const downloadedEpisode = getDownloadedEpisode(state, id);
  const episode = _.find(data, { id });
  const episodeNotFound = isValid(data) && !episode;
  const hasFavorites = getHasFavorites(state);
  const isFavorited = getIsFavorited(state, id);

  const actionSheetOptions = [I18n.t(ext('actionSheetCancelOption'))];

  if (enableSharing) {
    actionSheetOptions.push(I18n.t(ext('actionSheetShareOption')));
  }

  if (hasFavorites) {
    if (isFavorited) {
      actionSheetOptions.push(I18n.t(ext('actionSheetUnfavorite')));
    } else {
      actionSheetOptions.push(I18n.t(ext('actionSheetFavorite')));
    }
  }

  if (enableDownload && !downloadedEpisode) {
    actionSheetOptions.push(I18n.t(ext('actionSheetDownloadOption')));
  }

  const downloadInProgress = downloadedEpisode?.downloadInProgress;
  // If downloads are disabled after a user has already downloaded an episode
  // we must allow the user to delete the episode to clear space.
  if (downloadedEpisode && !downloadInProgress) {
    actionSheetOptions.push(I18n.t(ext('actionSheetDeleteOption')));
  }

  if (downloadInProgress) {
    actionSheetOptions.push(I18n.t(ext('actionSheetDownloadInProgress')));
  }

  return {
    actionSheetOptions,
    data,
    downloadedEpisode,
    downloadInProgress,
    enableDownload,
    enableSharing,
    episode: favoritedEpisode || episode,
    episodeNotFound,
    feedUrl,
    hasFavorites,
    isFavorited,
  };
}

export const mapDispatchToProps = {
  deleteEpisode,
  downloadEpisode,
  favoriteEpisode,
  unfavoriteEpisode,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EpisodeDetailsScreen'))(EpisodeDetailsScreen));
