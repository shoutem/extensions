import PropTypes from 'prop-types';
import { PureComponent } from 'react';

export class EpisodeView extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    episodeId: PropTypes.string,
    episode: PropTypes.object,
    podcastTitle: PropTypes.string,
    imageUrl: PropTypes.string,
    date: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    const { onPress, episodeId } = this.props;

    onPress(episodeId);
  }
}
