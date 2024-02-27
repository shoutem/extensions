import React, { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ListView, Screen } from '@shoutem/ui';
import { getShortcut } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, goBack } from 'shoutem.navigation';
import { Button, TextInput } from '../components';
import { ext } from '../const';
import { mapNotificationToView } from '../services';

function ViewPushNotificationScreen(props) {
  const { navigation, style } = props;
  const { notification: notificationObject } = getRouteParams(props);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: I18n.t(ext('pushNotificationsViewPushScreenTitle')),
    });
  }, []);

  const notification = mapNotificationToView(notificationObject);

  const {
    audience,
    title,
    message,
    deliveryDisplayDate,
    target,
    targetUrl,
    shortcutKey,
  } = notification;

  const shortcut = useSelector(state => getShortcut(state, shortcutKey));
  const shortcutTitle = _.get(shortcut, 'attributes.title', null);
  const urlToOpen = shortcutKey ? null : targetUrl;
  const notificationData = [
    {
      label: I18n.t(ext('pushNotificationsAudienceDropdownPlaceholder')),
      value: audience,
    },
    {
      label: I18n.t(ext('pushNotificationsDatePickerCaption')),
      value: deliveryDisplayDate,
    },
    {
      label: I18n.t(ext('pushNotificationsCreatePushTargetTypeCaption')),
      value: target,
    },
    {
      label: I18n.t(ext('pushNotificationsUrlPickerCaption')),
      value: urlToOpen,
    },
    {
      label: I18n.t(ext('pushNotificationsShortcutPickerCaption')),
      value: shortcutTitle,
    },
    {
      label: I18n.t(ext('pushNotificationsCreatePushTitleLabel')),
      value: title,
    },
    {
      label: I18n.t(ext('pushNotificationsCreatePushMessageLabel')),
      value: message,
      additionalProps: { multiline: true },
    },
  ];

  function renderItem(item) {
    if (!item.value) {
      return null;
    }

    return (
      <TextInput
        disabled
        label={item.label}
        value={item.value}
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...item?.additionalProps}
      />
    );
  }

  return (
    <Screen styleName="paper">
      <ListView
        contentContainerStyle={style.listContainer}
        data={notificationData}
        renderRow={renderItem}
      />
      <Button
        secondary
        title={I18n.t(ext('pushNotificationsViewPushScreenCloseButton'))}
        onPress={goBack}
      />
    </Screen>
  );
}

ViewPushNotificationScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  style: PropTypes.object,
};

ViewPushNotificationScreen.defaultProps = {
  style: {},
};

export default React.memo(
  connectStyle(ext('ViewPushNotificationScreen'))(ViewPushNotificationScreen),
);
