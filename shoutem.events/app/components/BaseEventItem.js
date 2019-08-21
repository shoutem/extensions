import PropTypes from 'prop-types';
import { PureComponent } from 'react';

export class BaseEventItem extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    action: PropTypes.func,
    event: PropTypes.object,
    styleName: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.action = this.action.bind(this);
  }

  onPress() {
    const { onPress, event } = this.props;

    onPress(event);
  }

  action() {
    const { action, event } = this.props;
    
    action(event);
  }
}
