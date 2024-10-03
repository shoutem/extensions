import React, { PureComponent } from 'react';
import { Share } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { getOne } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import {
  ActionSheet,
  Button,
  Caption,
  Icon,
  Screen,
  ScrollView,
  ShareButton,
  SimpleHtml,
  Spinner,
  Title,
  Toast,
  View,
} from '@shoutem/ui';
import { getShortcut, unavailableInWeb } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import { getLeadImageUrl } from 'shoutem.rss';
import { isAndroid, isWeb } from 'shoutem-core';
import { FavoriteButton } from '../components';
import { ext, RSS_PODCAST_SCHEMA } from '../const';
import { PodcastEpisodePlayer } from '../fragments';
import {
  deleteEpisode,
  downloadEpisode,
  getDownloadedEpisode,
  getHasFavorites,
  getIsFavorited,
  removeFavoriteEpisode,
  saveFavoriteEpisode,
} from '../redux';

export class EpisodeDetailsScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      actionSheetOpen: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());
  }

  componentDidUpdate(prevProps) {
    const { isFavorited: prevIsFavorited } = prevProps;
    const { isFavorited, navigation } = this.props;

    if (prevIsFavorited !== isFavorited) {
      navigation.setOptions(this.getNavBarProps());
    }
  }

  deleteDownload() {
    const { deleteEpisode, downloadedEpisode } = this.props;

    deleteEpisode(downloadedEpisode).then(() => {
      Toast.showSuccess({
        title: I18n.t(ext('episodeDeleteTitle')),
        message: I18n.t(ext('episodeDeleteMessage')),
      });
    });
  }

  startDownload() {
    const { episode, downloadEpisode } = this.props;

    downloadEpisode(episode).then(() => {
      Toast.showSuccess({
        title: I18n.t(ext('episodeDownloadSuccessTitle')),
        message: I18n.t(ext('episodeDownloadSuccessMessage')),
      });
    });
  }

  getNavBarProps() {
    return {
      headerRight: this.headerRight,
      title: '',
    };
  }

  onFavoritePress() {
    const {
      episode,
      saveFavoriteEpisode,
      isFavorited,
      removeFavoriteEpisode,
      shortcutId,
    } = this.props;

    return isFavorited
      ? removeFavoriteEpisode(episode.uuid)
      : saveFavoriteEpisode(episode.uuid, shortcutId);
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
        <Button styleName="clear tight" onPress={this.handleOptionsPress}>
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
        <Button
          styleName="clear tight"
          onPress={unavailableInWeb(handleDownloadPress)}
        >
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

    // early return for web as we do not support share on web
    if (isWeb) {
      return null;
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

  handleActionSheetDismiss() {
    this.setState({ actionSheetOpen: false });
  }

  handleOptionsPress() {
    this.setState({ actionSheetOpen: true });
  }

  handleSharePress() {
    if (isWeb) {
      unavailableInWeb();

      this.setState({
        actionSheetOpen: false,
      });

      return;
    }

    const { episode } = this.props;

    const url = _.get(episode, 'link', '');
    const audioAttachmentUrl = episode.audioAttachments[0]?.src || '';
    const resolvedUrl = url || audioAttachmentUrl;
    const title = _.get(episode, 'title', '');

    Share.share({
      title,
      // URL property isn't supported on Android, so we are
      // including it as the message for now.
      message: isAndroid ? resolvedUrl : null,
      url: resolvedUrl,
    });
  }

  handleDownloadOptionPress() {
    const { downloadedEpisode } = this.props;

    if (downloadedEpisode) {
      this.deleteDownload();
    } else {
      this.startDownload();
    }
  }

  renderHeaderImage() {
    const { episode, meta, style } = this.props;

    const episodeImageUrl = getLeadImageUrl(episode) ?? meta?.imageUrl;

    return (
      <FastImage
        source={episodeImageUrl ? { uri: episodeImageUrl } : undefined}
        style={style.artwork}
      />
    );
  }

  composeActionSheetOptions() {
    const {
      enableSharing,
      hasFavorites,
      isFavorited,
      enableDownload,
      downloadedEpisode,
      downloadInProgress,
    } = this.props;

    const confirmOptions = [];

    if (enableSharing) {
      confirmOptions.push({
        title: I18n.t(ext('actionSheetShareOption')),
        onPress: this.handleSharePress,
      });
    }

    if (hasFavorites) {
      const favoriteTitle = isFavorited
        ? I18n.t(ext('actionSheetUnfavorite'))
        : I18n.t(ext('actionSheetFavorite'));

      confirmOptions.push({
        title: favoriteTitle,
        onPress: this.onFavoritePress,
      });
    }

    if (enableDownload && !downloadedEpisode) {
      confirmOptions.push({
        title: I18n.t(ext('actionSheetDownloadOption')),
        onPress: unavailableInWeb(this.handleDownloadOptionPress),
      });
    }

    // If downloads are disabled after a user has already downloaded an episode
    // we must allow the user to delete the episode to clear space.
    if (downloadedEpisode && !downloadInProgress) {
      confirmOptions.push({
        title: I18n.t(ext('actionSheetDeleteOption')),
        onPress: unavailableInWeb(this.handleDownloadOptionPress),
      });
    }

    if (downloadInProgress) {
      confirmOptions.push({
        title: I18n.t(ext('actionSheetDownloadInProgress')),
        onPress: this.handleActionSheetDismiss,
      });
    }

    const cancelOptions = [
      {
        title: I18n.t(ext('actionSheetCancelOption')),
        onPress: this.handleActionSheetDismiss,
      },
    ];

    return {
      cancelOptions,
      confirmOptions,
    };
  }

  render() {
    const { episode, meta, feedUrl, shortcutTitle } = this.props;
    const { actionSheetOpen } = this.state;

    const author = _.get(episode, 'author', '');
    const body = _.get(episode, 'body', '');
    const timeUpdated = _.get(episode, 'timeUpdated', '');
    const title = _.get(episode, 'title', '');

    const momentDate = moment(timeUpdated);
    const validDate = momentDate.isAfter(0);
    const { confirmOptions, cancelOptions } = this.composeActionSheetOptions();

    return (
      <Screen styleName="paper">
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
            <PodcastEpisodePlayer
              episode={episode}
              feedUrl={feedUrl}
              defaultArtwork={meta?.imageUrl}
              title={shortcutTitle}
            />
          </View>
          <View styleName="solid">
            <SimpleHtml body={body} />
          </View>
        </ScrollView>
        <ActionSheet
          active={actionSheetOpen}
          cancelOptions={cancelOptions}
          confirmOptions={confirmOptions}
          onDismiss={this.handleActionSheetDismiss}
        />
      </Screen>
    );
  }
}

EpisodeDetailsScreen.propTypes = {
  deleteEpisode: PropTypes.func.isRequired,
  downloadEpisode: PropTypes.func.isRequired,
  episode: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  downloadedEpisode: PropTypes.object,
  downloadInProgress: PropTypes.bool,
  enableDownload: PropTypes.bool,
  enableSharing: PropTypes.bool,
  feedUrl: PropTypes.string,
  hasFavorites: PropTypes.bool,
  isFavorited: PropTypes.bool,
  meta: PropTypes.object,
  removeFavoriteEpisode: PropTypes.func,
  saveFavoriteEpisode: PropTypes.func,
  shortcutId: PropTypes.string,
  shortcutTitle: PropTypes.string,
  style: PropTypes.object,
};

EpisodeDetailsScreen.defaultProps = {
  downloadInProgress: false,
  downloadedEpisode: null,
  enableDownload: false,
  enableSharing: false,
  feedUrl: undefined,
  saveFavoriteEpisode: _.noop,
  hasFavorites: false,
  isFavorited: false,
  meta: {},
  shortcutId: undefined,
  shortcutTitle: '',
  style: {},
  removeFavoriteEpisode: _.noop,
};

export function mapStateToProps(state, ownProps) {
  const {
    id,
    shortcutId,
    meta,
    screenSettings: { enableSharing = false },
  } = getRouteParams(ownProps);

  const podcastShortcut = getShortcut(state, shortcutId);

  const {
    title: shortcutTitle,
    settings: { feedUrl, enableDownload },
  } = podcastShortcut;

  const downloadedEpisode = getDownloadedEpisode(state, id);
  const episode = getOne(id, state, RSS_PODCAST_SCHEMA);

  const hasFavorites = getHasFavorites(state);
  const isFavorited = getIsFavorited(state, episode.uuid);

  const downloadInProgress = downloadedEpisode?.downloadInProgress;

  return {
    downloadedEpisode,
    downloadInProgress,
    enableDownload,
    enableSharing,
    episode,
    feedUrl,
    hasFavorites,
    isFavorited,
    meta,
    shortcutTitle,
    shortcutId,
  };
}

export const mapDispatchToProps = {
  deleteEpisode,
  downloadEpisode,
  saveFavoriteEpisode,
  removeFavoriteEpisode,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EpisodeDetailsScreen'))(EpisodeDetailsScreen));
