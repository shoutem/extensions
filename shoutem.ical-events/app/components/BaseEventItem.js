import PropTypes from 'prop-types';
import { PureComponent } from 'react';

export class BaseEventItem extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    action: PropTypes.func,
    event: PropTypes.object.isRequired,
    styleName: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.action = this.action.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.event);
  }

  action() {
    this.props.action(this.props.event);
  }
}
