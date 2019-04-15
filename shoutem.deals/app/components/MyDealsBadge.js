import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Image,
} from '@shoutem/ui';

import { ext } from '../const';

// Assets
import myDealsImage from '../assets/images/my-coupons.png';

export class MyDealsBadge extends PureComponent {

  static propTypes = {
    onPress: PropTypes.func,
  };

  static defaultProps = {
    onPress: () => { },
  };

  render() {
    return (
      <Button styleName="clear" onPress={this.props.onPress}>
        <Image source={myDealsImage} />
      </Button>
    );
  }
}

export default connectStyle(ext('MyDealsBadge', {}))(MyDealsBadge);
