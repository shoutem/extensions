import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { connect, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Toast } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, goBack } from 'shoutem.navigation';
import {
  Button,
  DropdownPicker,
  FormInput,
  KeyboardAwareScreen,
  PushNotificationDatePicker,
  ShortcutDropdown,
} from '../components';
import {
  ext,
  PUSH_NOTIFICATION_AUDIENCE_TYPES,
  PUSH_NOTIFICATIONS_TARGET_OPTIONS,
} from '../const';
import {
  editPushNotification,
  fetchScheduledNotifications,
  getNotificationGroups,
  getShortcutTitle,
  getShortcutTree,
} from '../redux';
import { mapNotificationToView } from '../services';

const notificationTypeOptions = _.values(PUSH_NOTIFICATIONS_TARGET_OPTIONS);

function EditPushNotificationScreen(props) {
  const {
    navigation,
    notificationGroups,
    shortcuts,
    fetchScheduledNotifications,
    editPushNotification,
    style,
  } = props;
  const { notification: notificationObject } = getRouteParams(props);

  const notificationGroupOptions = useMemo(
    () => ['All', ..._.map(notificationGroups, group => group.name)],
    [notificationGroups],
  );
  const notification = useMemo(
    () => mapNotificationToView(notificationObject),
    [notificationObject],
  );

  const {
    id: notificationId,
    audience: notificationAudience,
    audienceGroups: notificationAudienceGroups,
    title: notificationTitle,
    message: notificationMessage,
    deliveryDate,
    target: notificationTarget,
    targetUrl: notificationTargetUrl,
  } = notification;

  const defaultShortcut = useSelector(state =>
    getShortcutTitle(state, notificationTargetUrl),
  );

  const [audience, setAudience] = useState(notificationAudience);
  const [audienceGroups, setAudienceGroups] = useState(
    notificationAudienceGroups,
  );
  const [date, setDate] = useState(deliveryDate);
  const [title, setTitle] = useState(notificationTitle);
  const [message, setMessage] = useState(notificationMessage);
  const [target, setTarget] = useState(notificationTarget);
  const [targetUrl, setTargetUrl] = useState(notificationTargetUrl);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: I18n.t(ext('pushNotificationsEditPushScreenTitle')),
    });
  }, []);

  function handleAudiencePress(selectedAudience) {
    const group = _.find(notificationGroups, { name: selectedAudience });

    if (group) {
      setAudienceGroups([group]);
    }

    const resolvedAudience =
      selectedAudience === 'All'
        ? PUSH_NOTIFICATION_AUDIENCE_TYPES.BROADCAST
        : PUSH_NOTIFICATION_AUDIENCE_TYPES.GROUP;
    setAudience(resolvedAudience);
  }

  function handleTargetChange(target) {
    if (target === PUSH_NOTIFICATIONS_TARGET_OPTIONS.SCREEN) {
      setTargetUrl(shortcuts[0].id);
      setTarget(target);
      return;
    }

    setTargetUrl('');
    setTarget(target);
  }

  function handleShortcutPress(shortcut) {
    setTargetUrl(shortcut.id);
  }

  const handleEditNotification = async () => {
    Keyboard.dismiss();

    setLoading(true);
    try {
      editPushNotification(notificationId, {
        audience,
        audienceGroups,
        contentUrl: targetUrl,
        deliveryTime: date,
        message,
        target,
        targetUrl,
        title,
      });
    } catch {
      Toast.showError({
        title: I18n.t(ext('pushNotificationsEditPushErrorToastTitle')),
        message: I18n.t(ext('pushNotificationsEditPushErrorToastMessage')),
      });
      setLoading(false);
    }

    await fetchScheduledNotifications();

    Toast.showSuccess({
      title: I18n.t(ext('pushNotificationsEditPushSuccessToastTitle')),
      message: I18n.t(ext('pushNotificationsEditPushSuccessToastMessage')),
    });
    setLoading(false);
    goBack();
  };

  const renderFooter = () => (
    <View style={style.footer}>
      <Button
        title={I18n.t(ext('pushNotificationsEditPushCancel'))}
        wide
        onPress={navigation.goBack}
      />
      <View style={style.footerDivider} />
      <Button
        loading={loading}
        secondary
        title={I18n.t(ext('pushNotificationsEditPushSaveChanges'))}
        wide
        onPress={handleEditNotification}
      />
    </View>
  );

  return (
    <KeyboardAwareScreen renderFooter={renderFooter}>
      <DropdownPicker
        defaultValue={audience}
        label={I18n.t(ext('pushNotificationsAudienceDropdownPlaceholder'))}
        options={notificationGroupOptions}
        onItemPress={handleAudiencePress}
      />
      <PushNotificationDatePicker date={date} onDateSelected={setDate} />
      <DropdownPicker
        defaultValue={target}
        label={I18n.t(ext('pushNotificationsCreatePushTargetTypeCaption'))}
        options={notificationTypeOptions}
        onItemPress={handleTargetChange}
      />
      {target === PUSH_NOTIFICATIONS_TARGET_OPTIONS.URL && (
        <FormInput
          autoCapitalize="none"
          label={I18n.t(ext('pushNotificationsUrlPickerCaption'))}
          required={false}
          textContentType="URL"
          value={targetUrl}
          onChangeText={setTargetUrl}
        />
      )}
      {target === PUSH_NOTIFICATIONS_TARGET_OPTIONS.SCREEN && (
        <ShortcutDropdown
          defaultShortcut={defaultShortcut}
          shortcuts={shortcuts}
          onShortcutPress={handleShortcutPress}
        />
      )}
      <FormInput
        label={I18n.t(ext('pushNotificationsCreatePushTitleLabel'))}
        required
        value={title}
        onChangeText={setTitle}
      />
      <FormInput
        label={I18n.t(ext('pushNotificationsCreatePushMessageLabel'))}
        multiline
        required
        value={message}
        onChangeText={setMessage}
      />
    </KeyboardAwareScreen>
  );
}

EditPushNotificationScreen.propTypes = {
  editPushNotification: PropTypes.func.isRequired,
  fetchScheduledNotifications: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  notificationGroups: PropTypes.array.isRequired,
  shortcuts: PropTypes.array.isRequired,
  style: PropTypes.object,
};

EditPushNotificationScreen.defaultProps = {
  style: {},
};

const mapDispatchToProps = {
  editPushNotification,
  fetchScheduledNotifications,
};

const mapStateToProps = state => ({
  notificationGroups: getNotificationGroups(state),
  shortcuts: getShortcutTree(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('EditPushNotificationScreen'))(EditPushNotificationScreen));
