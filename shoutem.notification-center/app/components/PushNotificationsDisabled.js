import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Screen, Text } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { EmptyStatePush } from '../assets';
import { ext } from '../const';

function PushNotificationsDisabled({
  style,
  title = I18n.t(ext('pushNotificationsModuleDisabledTitle')),
  subtitle = I18n.t(ext('pushNotificationsModuleDisabledMessage')),
}) {
  return (
    <Screen style={style.container}>
      <EmptyStatePush width={55} height={105} />
      <Text style={style.title}>{title}</Text>
      <Text style={style.subtitle}>{subtitle}</Text>
    </Screen>
  );
}

PushNotificationsDisabled.propTypes = {
  style: PropTypes.object,
  subtitle: PropTypes.string,
  title: PropTypes.string,
};

PushNotificationsDisabled.defaultProps = {
  style: {},
  title: undefined,
  subtitle: undefined,
};

export default React.memo(
  connectStyle(ext('PushNotificationsDisabled'))(PushNotificationsDisabled),
);
