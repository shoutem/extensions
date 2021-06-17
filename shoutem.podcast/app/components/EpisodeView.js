import { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLeadImageUrl } from 'shoutem.rss';
import { deleteEpisode, downloadEpisode } from '../redux';

export class EpisodeView extends PureComponent {
  static propTypes = {
    enableDownload: PropTypes.bool,
    episode: PropTypes.object,
    feedUrl: PropTypes.string,
    onPress: PropTypes.func,
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
    const {
      deleteEpisode,
      episode: { id, path },
    } = this.props;

    deleteEpisode(id, path);
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
