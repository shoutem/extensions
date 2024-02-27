import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { Button } from './shared';

function CreatePushNotificationButton({
  disabled,
  onPress,
  style,
  ...otherProps
}) {
  return (
    <Button
      buttonStyle={style}
      secondary
      disabled={disabled}
      title={I18n.t(ext('pushNotificationsCreateNotificationButton'))}
      onPress={onPress}
      {...otherProps}
    />
  );
}

CreatePushNotificationButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

CreatePushNotificationButton.defaultProps = {
  disabled: false,
  style: {},
};

export default React.memo(
  connectStyle(ext('CreatePushNotificationButton'))(
    CreatePushNotificationButton,
  ),
);
