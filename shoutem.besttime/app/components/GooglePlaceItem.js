import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Divider, Row, Subtitle, TouchableOpacity } from '@shoutem/ui';
import { ext } from '../const';

export class GooglePlaceItem extends PureComponent {
  static propTypes = {
    description: PropTypes.string,
    onPress: PropTypes.func,
  };

  render() {
    const { description, onPress } = this.props;

    return (
      <TouchableOpacity onPress={onPress}>
        <Row>
          <Subtitle>{description}</Subtitle>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export default connectStyle(ext('GooglePlaceItem'))(GooglePlaceItem);
