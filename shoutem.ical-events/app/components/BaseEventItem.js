import { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
export class BaseEventItem extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    action: PropTypes.func,
    event: PropTypes.object.isRequired,
    styleName: PropTypes.string,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  onPress() {
    this.props.onPress(this.props.event);
  }

  action() {
    this.props.action(this.props.event);
  }
}
