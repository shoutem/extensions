import _ from 'lodash';
import PropTypes from 'prop-types';
import { CmsListScreen } from 'shoutem.cms';
import { openInModal } from 'shoutem.navigation';
import { cloneStatus } from '@shoutem/redux-io';
import { ext } from '../const';

export function remapAndFilterPhotos(data) {
  // Delete objects from `data` if they do not have url in `image` set
  const filteredPhotos = _.filter(data, photo => _.get(photo, 'image.url'));
  // Remap objects only on one place, to avoid remapping few times later
  const photos = _.map(filteredPhotos, (photo, id) => {
    return {
      source: {
        uri: _.get(photo, 'image.url'),
      },
      title: _.get(photo, 'name'),
      description: _.get(photo, 'description'),
      id: _.get(photo, 'id') || id,
      timeUpdated: _.get(photo, 'timeUpdated'),
    };
  });

  cloneStatus(data, photos);

  return photos;
}

export class PhotosBaseScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    openInModal: PropTypes.func.isRequired,
  };

  static getDerivedStateFromProps(props, state) {
    const { data } = props;

    if (data !== state.data) {
      const photos = remapAndFilterPhotos(data);
      return { data, photos };
    }

    return state;
  }

  constructor(props, context) {
    super(props, context);

    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.renderRow = this.renderRow.bind(this);

    const photos = remapAndFilterPhotos(this.props.data);

    this.state = {
      data: null,
      photos,
      schema: ext('Photos'),
    };
  }

  openDetailsScreen(photo) {
    const { openInModal } = this.props;
    const { photos } = this.state;

    const route = {
      screen: ext('PhotoDetailsScreen'),
      props: {
        photo,
        photos,
      },
    };

    openInModal(route);
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  state => state[ext()].allPhotos,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  openInModal,
});
