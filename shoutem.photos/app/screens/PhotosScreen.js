import { connectStyle } from '@shoutem/theme';
import { connect } from 'react-redux';
import { getRouteParams } from 'shoutem.navigation';
import { createListItem } from '../components/ListItemViewFactory';
import { ext } from '../const';
import {
  PhotosBaseScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './PhotosBaseScreen';

export class PhotosScreen extends PhotosBaseScreen {
  static propTypes = {
    ...PhotosBaseScreen.propTypes,
  };

  renderRow(photo) {
    const { screenSettings } = getRouteParams(this.props);

    return createListItem(
      screenSettings.listType,
      photo,
      this.openDetailsScreen,
    );
  }

  renderData() {
    const { photos } = this.state;
    // We're overriding renderData method by providing it
    // filtered and remaped photos (from state)
    return super.renderData(photos);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('PhotosScreen'))(PhotosScreen));
