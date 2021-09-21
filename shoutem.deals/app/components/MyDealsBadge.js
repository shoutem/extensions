import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Image } from '@shoutem/ui';
import myDealsImage from '../assets/images/my-coupons.png';
import { ext } from '../const';

export class MyDealsBadge extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    style: PropTypes.any,
  };

  static defaultProps = {
    onPress: () => { },
  };

  render() {
    const { style } = this.props;

    return (
      <Button styleName="clear" onPress={this.props.onPress}>
        <Image source={myDealsImage} style={style} />
      </Button>
    );
  }
}

export default connectStyle(ext('MyDealsBadge', {}))(MyDealsBadge);
