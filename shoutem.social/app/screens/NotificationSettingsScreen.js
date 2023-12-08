import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes, { objectOf } from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Divider,
  ListView,
  resolveVariable,
  Row,
  Screen,
  Subtitle,
  Switch,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { getUser, loginRequired } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { actions, selectors } from '../redux';

function parseSettingsData(settings) {
  return [
    {
      title: I18n.t(ext('commentsOnMyStatuses')),
      key: 'commentsOnMyStatuses',
      value: settings.commentsOnMyStatuses,
    },
    {
      title: I18n.t(ext('likesOnMyStatuses')),
      key: 'likesOnMyStatuses',
      value: settings.likesOnMyStatuses,
    },
  ];
}

export function NotificationSettingsScreen({
  style,
  updateSettings,
  settings,
  user,
  navigation,
}) {
  const [currentSettings, setCurrentSettings] = useState(
    parseSettingsData(settings),
  );

  useEffect(() => {
    navigation.setOptions({ title: I18n.t(ext('settingsScreentitle')) });

    const newSettings = parseSettingsData(settings);
    setCurrentSettings(newSettings);
  }, [settings]);

  const handleSettingToggle = setting => {
    const { key, value } = setting;

    updateSettings({ [key]: !value }, settings.id, user.legacyId);
  };

  const renderSetting = setting => {
    return (
      <View>
        <Row styleName="small space-between">
          <Subtitle>{setting.title}</Subtitle>
          <Switch
            onValueChange={() => handleSettingToggle(setting)}
            value={setting.value}
            style={style.notificationToggle}
          />
        </Row>
        <Divider styleName="line" />
      </View>
    );
  };

  return (
    <Screen>
      <View styleName="md-gutter solid">
        <Subtitle styleName="h-center">
          {I18n.t(ext('settingsScreenSubtitle'))}
        </Subtitle>
      </View>
      <ListView data={currentSettings} renderRow={renderSetting} />
    </Screen>
  );
}

NotificationSettingsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  settings: PropTypes.object,
  user: PropTypes.object,
  updateSettings: PropTypes.func,
  style: PropTypes.objectOf({
    notificationToggle: PropTypes.object,
  }),
};

const mapStateToProps = state => ({
  settings: selectors.getUserSettings(state),
  user: getUser(state),
});

const mapDispatchToProps = {
  updateSettings: actions.updateSocialSettings,
};

export default loginRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(
    connectStyle(ext('NotificationSettingsScreen'))(NotificationSettingsScreen),
  ),
  true,
);
