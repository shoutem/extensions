/* eslint-disable react/no-unused-state */
import { createRef, PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { Event, getAudioTrackProgress, TrackPlayer } from 'shoutem.audio';
import { getLeadImageUrl } from 'shoutem.rss';
import { ext } from '../const';
import {
  deleteEpisode,
  downloadEpisode,
  favoriteEpisode,
  getHasFavorites,
  getIsFavorited,
  unfavoriteEpisode,
} from '../redux';
import { getTrackId } from '../services';

export class EpisodeView extends PureComponent {
  static propTypes = {
    deleteEpisode: PropTypes.func.isRequired,
    downloadEpisode: PropTypes.func.isRequired,
    enableDownload: PropTypes.bool.isRequired,
    favoriteEpisode: PropTypes.func.isRequired,
    isFavorited: PropTypes.bool.isRequired,
    unfavoriteEpisode: PropTypes.func.isRequired,
    episode: PropTypes.object,
    feedUrl: PropTypes.string,
    meta: PropTypes.object,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    episode: undefined,
    feedUrl: undefined,
    meta: undefined,
    onPress: undefined,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.activeTrackChangedSubscription = createRef();
    this.playbackSubscription = createRef();

    this.state = {
      isActiveTrack: false,
      isPlaying: false,
    };
  }

  componentDidMount() {
    const { episode } = this.props;

    this.activeTrackChangedSubscription.current = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      event => {
        const isActiveTrack =
          event.track?.id === getTrackId(episode.id, episode.url);

        this.setState({ isActiveTrack });
      },
    );

    this.playbackSubscription.current = TrackPlayer.addEventListener(
      Event.PlaybackPlayWhenReadyChanged,
      event => {
        this.setState({ isPlaying: event.playWhenReady });
      },
    );
  }

  componentWillUnmount() {
    if (this.activeTrackChangedSubscription.current) {
      this.activeTrackChangedSubscription.current.remove();
    }

    if (this.playbackSubscription.current) {
      this.playbackSubscription.current.remove();
    }
  }

  getEpisodeUrl() {
    const { episode } = this.props;

    return episode.audioAttachments[0]?.src;
  }

  getImageUrl() {
    const { episode, meta } = this.props;

    return getLeadImageUrl(episode) ?? meta?.imageUrl;
  }

  onDownloadPress() {
    const {
      downloadEpisode,
      episode: { id },
      feedUrl,
    } = this.props;

    downloadEpisode(id, feedUrl);
  }

  onDeletePress() {
    const { deleteEpisode, episode } = this.props;

    deleteEpisode(episode);
  }

  onFavoritePress() {
    const {
      enableDownload,
      episode,
      favoriteEpisode,
      feedUrl,
      isFavorited,
      unfavoriteEpisode,
      meta,
    } = this.props;

    return isFavorited
      ? unfavoriteEpisode(episode.id)
      : favoriteEpisode(episode, enableDownload, feedUrl, meta);
  }

  onPress() {
    const {
      episode: { id },
      onPress,
    } = this.props;

    onPress(id);
  }
}

export function mapStateToProps(state, ownProps) {
  const {
    episode: { id, url },
  } = ownProps;

  return {
    hasFavorites: getHasFavorites(state),
    isFavorited: getIsFavorited(state, id),
    savedProgress: getAudioTrackProgress(state, ext(), getTrackId(id, url)),
  };
}

export const mapDispatchToProps = {
  deleteEpisode,
  downloadEpisode,
  favoriteEpisode,
  unfavoriteEpisode,
};

export default connect(undefined, mapDispatchToProps)(EpisodeView);
