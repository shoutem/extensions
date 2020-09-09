import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBind from 'auto-bind';
import { find, next, shouldRefresh } from '@shoutem/redux-io';
import { openInModal } from 'shoutem.navigation';
import { RssListScreen } from 'shoutem.rss';
import { ext, RSS_PHOTOS_SCHEMA } from '../const';
import { getPhotosFeed, fetchPhotosFeed } from '../redux';
import { remapAndFilterPhotos } from '../services';

export class PhotosBaseScreen extends RssListScreen {
  static propTypes = {
    ...RssListScreen.propTypes,
    openInModal: PropTypes.func.isRequired,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.data !== state.data) {
      const photos = remapAndFilterPhotos(props.data);

      return { photos };
    }

    return state;
  }

  constructor(props, context) {
    super(props, context);

    autoBind(this);

    const { data } = props;

    const photos = remapAndFilterPhotos(data);

    this.state = {
      data: null,
      photos,
      schema: RSS_PHOTOS_SCHEMA,
    };
  }

  componentDidMount() {
    const { data, fetchPhotosFeed, shortcutId } = this.props;

    if (shouldRefresh(data)) {
      fetchPhotosFeed(shortcutId);
    }
  }

  openDetailsScreen(photo) {
    const { openInModal, feedUrl } = this.props;
    const { id } = photo;

    const route = {
      screen: ext('PhotoDetails'),
      props: {
        id,
        feedUrl,
      },
    };

    openInModal(route);
  }
}

export const mapStateToProps = (state, ownProps) => {
  const shortcutId = _.get(ownProps, 'shortcut.id');
  const feedUrl = _.get(ownProps, 'shortcut.settings.feedUrl');
  const data = getPhotosFeed(state, feedUrl);

  return {
    shortcutId,
    feedUrl,
    data,
  };
};

export const mapDispatchToProps = {
  fetchPhotosFeed,
  openInModal,
  find,
  next,
};
