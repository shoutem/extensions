import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { ScheduledNotification, SentNotification } from '../assets';
import { ext } from '../const';

function PushNotificationCard(props) {
  const { content, onPress, title, group, active, style } = props;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={style.container}
      onPress={onPress}
    >
      <View style={style.contentContainer}>
        <Text style={style.title}>{title}</Text>
        <Text numberOfLines={2} style={style.content}>
          {content}
        </Text>
      </View>
      <View style={style.footerContainer}>
        {active ? <ScheduledNotification /> : <SentNotification />}
        <Text>{group}</Text>
      </View>
    </TouchableOpacity>
  );
}

PushNotificationCard.propTypes = {
  active: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

PushNotificationCard.defaultProps = {
  style: {},
};

export default React.memo(
  connectStyle(ext('PushNotificationCard'))(PushNotificationCard),
);
