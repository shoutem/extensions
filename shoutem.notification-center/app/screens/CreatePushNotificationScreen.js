import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Keyboard, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Toast } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { goBack } from 'shoutem.navigation';
import {
  AudienceDropdown,
  CreatePushNotificationButton,
  DropdownPicker,
  FormInput,
  KeyboardAwareScreen,
  PushNotificationDatePicker,
  SegmentedControl,
  ShortcutDropdown,
  TextInput,
} from '../components';
import {
  ext,
  PUSH_NOTIFICATION_TYPE_OPTIONS,
  PUSH_NOTIFICATIONS_TARGET_OPTIONS,
} from '../const';
import {
  createPushNotification,
  fetchScheduledNotifications,
  getNotificationGroups,
  getShortcutTree,
} from '../redux';
import { formatNotificationGroupOptions } from '../services';

const notificationTypeOptions = _.values(PUSH_NOTIFICATIONS_TARGET_OPTIONS);

function CreatePushNotificationScreen(props) {
  const {
    navigation,
    createPushNotification,
    notificationGroups,
    fetchScheduledNotifications,
    shortcuts,
    style,
  } = props;

  const [deliveryOption, setDeliveryOption] = useState(
    PUSH_NOTIFICATION_TYPE_OPTIONS.SEND_NOW,
  );
  const [audience, setAudience] = useState('');
  const [audienceGroups, setAudienceGroups] = useState([]);
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState(PUSH_NOTIFICATIONS_TARGET_OPTIONS.APP);
  const [targetUrl, setTargetUrl] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        300,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );
  }, [deliveryOption, target]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: I18n.t(ext('pushNotificationsCreatePushScreenTitle')),
    });
  }, []);

  const notificationGroupOptions = useMemo(
    () => formatNotificationGroupOptions(notificationGroups),
    [notificationGroups],
  );

  const isScheduledForm = useMemo(
    () => deliveryOption === PUSH_NOTIFICATION_TYPE_OPTIONS.SCHEDULED,
    [deliveryOption],
  );

  function handleAudiencePress(selectedAudience) {
    const group = _.find(notificationGroups, { name: selectedAudience.name });

    if (group) {
      setAudienceGroups([group]);
    }

    setAudience(selectedAudience.audienceType);
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

  const handleCreateButtonPress = async () => {
    Keyboard.dismiss();

    setButtonLoading(true);
    try {
      await createPushNotification({
        audience,
        audienceGroups,
        delivery: deliveryOption,
        deliveryTime: date,
        message,
        target,
        targetUrl,
        title,
      });
    } catch (e) {
      Toast.showError({
        title: I18n.t(ext('pushNotificationsCreatePushErrorToastTitle')),
        message: I18n.t(ext('pushNotificationsCreatePushErrorToastMessage')),
      });
      setButtonLoading(false);
    }

    await fetchScheduledNotifications();

    Toast.showSuccess({
      title: I18n.t(ext('pushNotificationsCreatePushSuccessToastTitle')),
      message: I18n.t(ext('pushNotificationsCreatePushSuccessToastMessage')),
    });

    setButtonLoading(false);
    goBack();
  };

  const submitDisabled = !title || !message || buttonLoading;
  const renderFooter = () => (
    <CreatePushNotificationButton
      disabled={submitDisabled}
      onPress={handleCreateButtonPress}
      loading={buttonLoading}
      style={style.createButton}
    />
  );

  return (
    <KeyboardAwareScreen renderFooter={renderFooter}>
      <SegmentedControl
        activeOption={deliveryOption}
        options={PUSH_NOTIFICATION_TYPE_OPTIONS}
        onOptionPress={setDeliveryOption}
      />
      <AudienceDropdown
        audiences={notificationGroupOptions}
        onAudiencePress={handleAudiencePress}
      />
      <DropdownPicker
        label={I18n.t(ext('pushNotificationsCreatePushTargetTypeCaption'))}
        options={notificationTypeOptions}
        onItemPress={handleTargetChange}
      />
      {target === PUSH_NOTIFICATIONS_TARGET_OPTIONS.URL && (
        <TextInput
          autoCapitalize="none"
          label={I18n.t(ext('pushNotificationsUrlPickerCaption'))}
          textContentType="URL"
          value={targetUrl}
          onChangeText={setTargetUrl}
        />
      )}
      {target === PUSH_NOTIFICATIONS_TARGET_OPTIONS.SCREEN && (
        <ShortcutDropdown
          shortcuts={shortcuts}
          onShortcutPress={handleShortcutPress}
        />
      )}
      {isScheduledForm && (
        <PushNotificationDatePicker date={date} onDateSelected={setDate} />
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

const mapDispatchToProps = {
  createPushNotification,
  fetchScheduledNotifications,
};

const mapStateToProps = state => ({
  notificationGroups: getNotificationGroups(state),
  shortcuts: getShortcutTree(state),
});

CreatePushNotificationScreen.propTypes = {
  createPushNotification: PropTypes.func.isRequired,
  fetchScheduledNotifications: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  notificationGroups: PropTypes.array.isRequired,
  shortcuts: PropTypes.array.isRequired,
  style: PropTypes.object,
};

CreatePushNotificationScreen.defaultProps = {
  style: {},
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  connectStyle(ext('CreatePushNotificationScreen'))(
    CreatePushNotificationScreen,
  ),
);
