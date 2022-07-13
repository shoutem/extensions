import React, { useEffect, useState } from 'react';
import { uses24HourClock } from 'react-native-localize';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Caption,
  DateTimePicker,
  Screen,
  Subtitle,
  Text,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { goBack, HeaderIconButton } from 'shoutem.navigation';
import { DEFAULT_TIMEFRAME, ext } from '../const';
import { getNotificationSettings, setNotificationSettings } from '../redux';

function NotificationDailySettingsScreen({
  navigation,
  notificationSettings,
  setNotificationSettings,
  style,
}) {
  const initBeginsAt = notificationSettings?.dailyMessagesSettings?.beginsAt;
  const initEndsAt = notificationSettings?.dailyMessagesSettings?.endsAt;

  const [beginsAt, setBeginsAt] = useState(moment(initBeginsAt).format());
  const [endsAt, setEndsAt] = useState(moment(initEndsAt).format());
  const [error, setError] = useState(null);

  function handleRestoreDefaultTimeframe() {
    setBeginsAt(DEFAULT_TIMEFRAME.beginsAt);
    setEndsAt(DEFAULT_TIMEFRAME.endsAt);
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
      title: I18n.t(ext('dailySettingsTitle')).toUpperCase(),
      headerRight: renderRightComponent,
    });
  }, []);

  function handleBeginsTimeSelected(beginsAt) {
    if (moment(endsAt).isBefore(beginsAt)) {
      setError(I18n.t(ext('timeframeErrorMessage')));
    } else {
      setError(null);
    }

    setBeginsAt(moment(beginsAt).format());
  }

  function handleEndsTimeSelected(endsAt) {
    if (moment(endsAt).isBefore(beginsAt)) {
      setError(I18n.t(ext('timeframeErrorMessage')));
    } else {
      setError(null);
    }

    setEndsAt(moment(endsAt).format());
  }

  function handleConfirm() {
    const newSettings = {
      ...notificationSettings,
      dailyMessagesSettings: { beginsAt, endsAt },
    };

    setNotificationSettings(newSettings);
    goBack();
  }

  const beginsAtTextValue = moment(beginsAt).format('h:mm A');
  const endsAtTextValue = moment(endsAt).format('h:mm A');

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
          <DateTimePicker
            is24Hour={uses24HourClock()}
            mode="time"
            onValueChanged={handleBeginsTimeSelected}
            style={style.timePickerButton}
            textValue={beginsAtTextValue}
            value={moment(beginsAt).toDate()}
          />
        </View>
        <View styleName="flexible">
          <Text styleName="sm-gutter-bottom">{I18n.t(ext('endsAt'))}</Text>
          <DateTimePicker
            is24Hour={uses24HourClock()}
            mode="time"
            onValueChanged={handleEndsTimeSelected}
            style={style.timePickerButton}
            textValue={endsAtTextValue}
            value={moment(endsAt).toDate()}
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
