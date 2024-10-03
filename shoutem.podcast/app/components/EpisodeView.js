/* eslint-disable react/no-unused-state */
import { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { getLeadImageUrl } from 'shoutem.rss';

export class EpisodeView extends PureComponent {
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
    const { onDownload, episode } = this.props;

    onDownload(episode);
  }

  onDeletePress() {
    const { onDelete, episode } = this.props;

    onDelete(episode);
  }

  onFavoritePress() {
    const {
      episode,
      onSaveToFavorites,
      isFavorited,
      onRemoveFromFavorites,
      shortcutId,
    } = this.props;

    return isFavorited
      ? onRemoveFromFavorites(episode.uuid)
      : onSaveToFavorites(episode.uuid, shortcutId);
  }

  onPress() {
    const {
      episode: { id },
      onPress,
    } = this.props;

    onPress(id);
  }
}

EpisodeView.propTypes = {
  // appHasFavoritesShortcut is used in child components.
  // eslint-disable-next-line react/no-unused-prop-types
  appHasFavoritesShortcut: PropTypes.bool.isRequired,
  shortcutId: PropTypes.string.isRequired,
  // shortcutSettings is used in child componenets.
  // eslint-disable-next-line react/no-unused-prop-types
  shortcutSettings: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onRemoveFromFavorites: PropTypes.func.isRequired,
  onSaveToFavorites: PropTypes.func.isRequired,
  episode: PropTypes.object,
  isFavorited: PropTypes.bool,
  meta: PropTypes.object,
  onPress: PropTypes.func,
};

EpisodeView.defaultProps = {
  episode: undefined,
  isFavorited: false,
  meta: undefined,
  onPress: undefined,
};

export default EpisodeView;
