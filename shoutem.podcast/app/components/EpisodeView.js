/* eslint-disable react/no-unused-state */
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { getLeadImageUrl } from 'shoutem.rss';
import {
  deleteEpisode,
  downloadEpisode,
  favoriteEpisode,
  getHasFavorites,
  getIsFavorited,
  unfavoriteEpisode,
} from '../redux';

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
    episode: { id },
  } = ownProps;

  return {
    hasFavorites: getHasFavorites(state),
    isFavorited: getIsFavorited(state, id),
  };
}

export const mapDispatchToProps = {
  deleteEpisode,
  downloadEpisode,
  favoriteEpisode,
  unfavoriteEpisode,
};

export default connect(undefined, mapDispatchToProps)(EpisodeView);
