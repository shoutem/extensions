import { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { getLeadImageUrl } from 'shoutem.rss';
import { deleteEpisode, downloadEpisode } from '../redux';

export class EpisodeView extends PureComponent {
  static propTypes = {
    deleteEpisode: PropTypes.func,
    downloadEpisode: PropTypes.func,
    episode: PropTypes.object,
    feedUrl: PropTypes.string,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    deleteEpisode: undefined,
    downloadEpisode: undefined,
    episode: undefined,
    feedUrl: undefined,
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
    const { episode } = this.props;

    return getLeadImageUrl(episode);
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

  onPress() {
    const {
      episode: { id },
      onPress,
    } = this.props;

    onPress(id);
  }
}

export const mapDispatchToProps = { deleteEpisode, downloadEpisode };

export default connect(undefined, mapDispatchToProps)(EpisodeView);
