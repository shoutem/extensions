import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import { NavigationBar } from 'shoutem.navigation';
import { loginRequired, getUser } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import {
  Screen,
  ListView,
  View,
  Row,
  Subtitle,
  Switch,
  Divider,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { actions, selectors } from '../redux';
import { ext } from '../const';

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

export class NotificationSettingsScreen extends PureComponent {
  static propTypes = {
    settings: PropTypes.object,
    user: PropTypes.object,
    updateSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      settings: parseSettingsData(props.settings),
    };
  }

  componentDidUpdate(prevProps) {
    const { settings } = this.props;
    const { settings: prevSettings } = prevProps;

    if (settings !== prevSettings) {
      const newSettings = parseSettingsData(settings);

      this.setState({ settings: newSettings });
    }
  }

  handleSettingToggle(setting) {
    const { updateSettings, settings, user } = this.props;
    const { key, value } = setting;

    updateSettings({ [key]: !value }, settings.id, user.legacyId);
  }

  renderSetting(setting) {
    return (
      <View>
        <Row styleName="small space-between">
          <Subtitle>{setting.title}</Subtitle>
          <Switch
            onValueChange={() => this.handleSettingToggle(setting)}
            value={setting.value}
          />
        </Row>
        <Divider styleName="line" />
      </View>
    );
  }

  render() {
    const { settings } = this.state;

    return (
      <Screen>
        <NavigationBar title={I18n.t(ext('settingsScreentitle'))} />
        <View styleName="md-gutter solid">
          <Subtitle styleName="h-center">{I18n.t(ext('settingsScreenSubtitle'))}</Subtitle>
        </View>
        <ListView
          data={settings}
          renderRow={this.renderSetting}
        />
      </Screen>
    );
  }
}

const mapStateToProps = state => ({
  settings: selectors.getUserSettings(state),
  user: getUser(state),
});

const mapDispatchToProps = {
  updateSettings: actions.updateSocialSettings,
};

export default loginRequired(connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('MessageListScreen'))(NotificationSettingsScreen),
), true);
