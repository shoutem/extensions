import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { uses24HourClock } from 'react-native-localize';
import { I18n } from 'shoutem.i18n';
import { connectStyle } from '@shoutem/theme';
import { Icon, Subtitle, View } from '@shoutem/ui';
import { ext } from '../const';
import { getCurrentDay } from '../services';

export class OpenHours extends PureComponent {
  static propTypes = {
    place: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  formatTime(timeCode) {
    if (!timeCode) {
      return null;
    }

    const hoursRaw = timeCode.substring(0, 2);
    const hours = hoursRaw.startsWith('0') ? hoursRaw.substring(1) : hoursRaw;
    const minutes = timeCode.substring(2);

    if (uses24HourClock()) {
      return `${hours}:${minutes}`;
    }

    const isPm = hours > 12;

    return `${isPm ? hours - 12 : hours}:${minutes}${isPm ? 'PM' : 'AM'}`;
  }

  render() {
    const {
      place: { opening_hours: openingHours },
      style,
    } = this.props;

    if (!openingHours) {
      return null;
    }

    const { periods } = openingHours;

    const currentDay = getCurrentDay();
    const period = periods.length < currentDay ? null : periods[currentDay];
    const isOpen = openingHours.open_now;
    const openingTime = period ? this.formatTime(period.open.time) : '';
    const closingTime = period ? this.formatTime(period.close.time) : null;
    const openHours = !closingTime
      ? I18n.t(ext('openAllDay'))
      : `${openingTime} - ${closingTime}`;
    const openText = isOpen ? I18n.t(ext('openNow')) : I18n.t(ext('closed'));

    return (
      <View styleName="horizontal v-center md-gutter-horizontal lg-gutter-bottom">
        <Icon name="clock" />
        <View styleName="h-start v-center sm-gutter-left">
          <Subtitle style={style.openText}>{openText}</Subtitle>
          {isOpen && <Subtitle>{openHours}</Subtitle>}
        </View>
      </View>
    );
  }
}

export default connectStyle(ext('OpenHours'))(OpenHours);
