import { PureComponent } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
export class BasePhotoView extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    photo: PropTypes.shape({
      description: PropTypes.string,
      id: PropTypes.string,
      source: PropTypes.object,
      timeUpdated: PropTypes.string,
      title: PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    const { onPress, photo } = this.props;

    if (_.isFunction(onPress)) {
      onPress(photo);
    }
  }
}
