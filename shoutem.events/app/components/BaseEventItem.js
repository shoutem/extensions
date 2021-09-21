import { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';

export class BaseEventItem extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    action: PropTypes.func,
    event: PropTypes.object,
    styleName: PropTypes.string,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
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
