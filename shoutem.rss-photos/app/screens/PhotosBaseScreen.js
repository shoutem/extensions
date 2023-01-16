import autoBind from 'auto-bind';
import _ from 'lodash';
import { getRouteParams, openInModal } from 'shoutem.navigation';
import { RssListScreen } from 'shoutem.rss';
import { ext, PHOTOS_COLLECTION_TAG, RSS_PHOTOS_SCHEMA } from '../const';
import { getPhotosFeed } from '../redux';
import { remapAndFilterPhotos } from '../services';

export class PhotosBaseScreen extends RssListScreen {
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
      tag: PHOTOS_COLLECTION_TAG,
    };
  }

  openDetailsScreen(photo) {
    const { feedUrl } = this.props;
    const { id } = photo;

    openInModal(ext('PhotoDetails'), {
      id,
      feedUrl,
      analyticsPayload: {
        itemId: photo.id,
        itemName: photo.title,
      },
    });
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { shortcut } = getRouteParams(ownProps);
  const shortcutId = _.get(shortcut, 'id');
  const feedUrl = _.get(shortcut, 'settings.feedUrl');
  const data = getPhotosFeed(state, feedUrl);

  return {
    shortcutId,
    feedUrl,
    data,
  };
};

export const mapDispatchToProps = RssListScreen.createMapDispatchToProps();
