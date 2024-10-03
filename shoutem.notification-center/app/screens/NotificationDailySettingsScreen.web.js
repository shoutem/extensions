import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connectStyle } from '@shoutem/theme';
import { Button, Caption, Screen, Subtitle, Text, View } from '@shoutem/ui';
import { resolveUnavailableText, unavailableInWeb } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { goBack, HeaderIconButton } from 'shoutem.navigation';
import { DEFAULT_TIMEFRAME, ext } from '../const';
import { getNotificationSettings, setNotificationSettings } from '../redux';

const MOMENT_TIME_FORMAT = 'HH:mm';

function NotificationDailySettingsScreen({
  navigation,
  notificationSettings,
  setNotificationSettings,
  style,
}) {
  const initBeginsAt = notificationSettings?.dailyMessagesSettings?.beginsAt;
  const initEndsAt = notificationSettings?.dailyMessagesSettings?.endsAt;

  const [beginsAt, setBeginsAt] = useState(
    moment(initBeginsAt).format(MOMENT_TIME_FORMAT),
  );
  const [endsAt, setEndsAt] = useState(
    moment(initEndsAt).format(MOMENT_TIME_FORMAT),
  );
  const [error, setError] = useState(null);

  function handleRestoreDefaultTimeframe() {
    setBeginsAt(moment(DEFAULT_TIMEFRAME.beginsAt).format(MOMENT_TIME_FORMAT));
    setEndsAt(moment(DEFAULT_TIMEFRAME.endsAt).format(MOMENT_TIME_FORMAT));
    setError(null);
  }

  function renderRightComponent(props) {
    return (
      <HeaderIconButton
        {...props}
        iconName="restore"
        onPress={handleRestoreDefaultTimeframe}
        tintColor={[style.restoreIconTintColor, props?.tintColor]}
      />
    );
  }

  useEffect(() => {
    navigation.setOptions({
      title: I18n.t(ext('dailySettingsTitle')),
      headerRight: renderRightComponent,
    });
  }, []);

  function handleBeginsTimeSelected(event) {
    const time = event.target.value;

    if (
      moment(endsAt, MOMENT_TIME_FORMAT).isBefore(
        moment(time, MOMENT_TIME_FORMAT),
      )
    ) {
      setError(I18n.t(ext('timeframeErrorMessage')));
    } else {
      setError(null);
    }

    setBeginsAt(time);
  }

  function handleEndsTimeSelected(event) {
    const time = event.target.value;

    if (
      moment(time, MOMENT_TIME_FORMAT).isBefore(
        moment(beginsAt, MOMENT_TIME_FORMAT),
      )
    ) {
      setError(I18n.t(ext('timeframeErrorMessage')));
    } else {
      setError(null);
    }

    setEndsAt(time);
  }

  function handleConfirm() {
    const newSettings = {
      ...notificationSettings,
      dailyMessagesSettings: {
        beginsAt: moment(beginsAt, MOMENT_TIME_FORMAT).format(),
        endsAt: moment(endsAt, MOMENT_TIME_FORMAT).format(),
      },
    };

    setNotificationSettings(newSettings);
    goBack();
    unavailableInWeb(null, resolveUnavailableText('Notifications are'));
  }

  return (
    <Screen styleName="paper">
      <Subtitle styleName="xl-gutter" style={style.subtitle}>
        {I18n.t(ext('dailySettingsDescription'))}
      </Subtitle>
      <Text
        styleName="xl-gutter-top lg-gutter-bottom h-center"
        style={style.subtitle}
      >
        {I18n.t(ext('timePickerDescription'))}
      </Text>
      <View styleName="horizontal md-gutter-horizontal">
        <View styleName="flexible md-gutter-right">
          <Text styleName="sm-gutter-bottom">{I18n.t(ext('beginsAt'))}</Text>
          <input
            aria-label="Time"
            type="time"
            onChange={handleBeginsTimeSelected}
            value={beginsAt}
          />
        </View>
        <View styleName="flexible">
          <Text styleName="sm-gutter-bottom">{I18n.t(ext('endsAt'))}</Text>
          <input
            aria-label="Time"
            type="time"
            onChange={handleEndsTimeSelected}
            value={endsAt}
          />
        </View>
      </View>
      {error && (
        <Caption styleName="form-error horizontal v-center h-center md-gutter-top">
          {error}
        </Caption>
      )}
      <Button
        disabled={!!error}
        onPress={handleConfirm}
        style={style.confirmButton}
      >
        <Text>{I18n.t(ext('confirmButtonTitle')).toUpperCase()}</Text>
      </Button>
    </Screen>
  );
}

NotificationDailySettingsScreen.propTypes = {
  notificationSettings: PropTypes.object,
  setNotificationSettings: PropTypes.func,
  navigation: PropTypes.object,
  style: PropTypes.object,
};

function mapStateToProps(state) {
  const notificationSettings = getNotificationSettings(state);

  return { notificationSettings };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setNotificationSettings }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  connectStyle(ext('NotificationDailySettingsScreen'))(
    NotificationDailySettingsScreen,
  ),
);
