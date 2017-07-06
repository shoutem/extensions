import React from 'react';

import _ from 'lodash';

import {
  Icon,
  TouchableOpacity,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';
import { reward as rewardShape } from './shapes.js';

const STAMPS_PER_ROW = 7;

const Stamp = ({ iconStyle, isStamped, onPress }) => {
  // TODO: Add gutter stylenames to Icon component in theme
  const StampIcon = (
    <Icon
      name={`checkbox-${isStamped ? 'on' : 'off'}`}
      styleName="md-gutter-right"
      style={{ ...iconStyle, marginRight: 15 }}
    />
  );

  return onPress ?
    <TouchableOpacity
      onPress={onPress}
    >
      {StampIcon}
    </TouchableOpacity>
    :
    StampIcon;
};

/**
 * Displays stamps required to redeem a reward for a punch card.
 * Stamps can be in the default state or punched.
 */
const Stamps = ({ reward: { points, pointsRequired }, iconStyle = {}, onStamped }) => {
  const rows = Math.ceil(pointsRequired / STAMPS_PER_ROW);

  return (
    <View styleName="vertical">
      {_.times(rows, rowIndex =>
        <View
          key={rowIndex}
          styleName="horizontal sm-gutter-vertical"
        >
          {_.times(STAMPS_PER_ROW, (index) => {
            const stampIndex = (rowIndex * STAMPS_PER_ROW) + index;

            return stampIndex < pointsRequired ?
              <Stamp
                iconStyle={iconStyle}
                isStamped={stampIndex < points}
                key={stampIndex}
                onPress={onStamped && (() => onStamped(stampIndex))}
              />
              :
              null;
          },
          )}
        </View>,
      )}
    </View>
  );
};

const { bool, func, shape, string } = React.PropTypes;

const iconStyleShape = shape({
  color: string,
});

Stamp.propTypes = {
  // Sets custom style to stamp icon
  iconStyle: iconStyleShape,
  // True if stamped, false otherwise
  isStamped: bool,
  // Called when a stamp is pressed
  onPress: func,
};

Stamps.propTypes = {
  // Punch card reward description, with points and points required
  reward: rewardShape.isRequired,
  // Sets custom style to stamp icon
  iconStyle: iconStyleShape,
  // Called when a stamp is pressed
  onStamped: func,
};

export default connectStyle(ext('Stamps'))(Stamps);
