import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, TouchableOpacity } from '@shoutem/ui';
import { ext } from '../const';

const iconStyleShape = PropTypes.shape({
  color: PropTypes.string,
});

/**
 * Displays stamps required to redeem a reward for a punch card.
 * Stamps can be in the default state or punched.
 */
export class Stamp extends PureComponent {
  static propTypes = {
    // Sets custom style to stamp icon
    iconStyle: iconStyleShape,
    // True if stamped, false otherwise
    isStamped: PropTypes.bool,
    // Stamp index
    stampIndex: PropTypes.number,
    // Called when a stamp is pressed
    onPress: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handlePress() {
    const { onPress, stampIndex } = this.props;

    onPress(stampIndex);
  }

  renderStampIcon() {
    const { iconStyle, isStamped } = this.props;

    return (
      <Icon
        name={`checkbox-${isStamped ? 'on' : 'off'}`}
        styleName="md-gutter-right"
        style={{ ...iconStyle, marginRight: 15 }}
      />
    );
  }

  render() {
    const { onPress } = this.props;

    return onPress ? (
      <TouchableOpacity onPress={this.handlePress}>
        {this.renderStampIcon()}
      </TouchableOpacity>
    ) : (
      this.renderStampIcon()
    );
  }
}

Stamp.propTypes = {
  // Sets custom style to stamp icon
  iconStyle: iconStyleShape,
  // True if stamped, false otherwise
  isStamped: PropTypes.bool,
  // Called when a stamp is pressed
  onPress: PropTypes.func,
};

export default connectStyle(ext('Stamp'))(Stamp);
