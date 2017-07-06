import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';

import {
  ext,
} from '../const';

import {
  LargePhotoScreen,
  mapDispatchToProps,
  mapStateToProps,
} from './LargePhotoScreen';

class MediumPhotoScreen extends LargePhotoScreen {
  static propTypes = {
    ...LargePhotoScreen.propTypes,
  };

  renderImage(profile) {
    return super.renderImage(profile, 'large');
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('MediumPhotoScreen'))(MediumPhotoScreen),
);
