import PropTypes from 'prop-types';
import React, {
  Component,
} from 'react';

import { Alert } from 'react-native';

import { connect } from 'react-redux';
import _ from 'lodash';

import { isProduction } from 'shoutem.application';
import { Permissions } from 'shoutem.push-notifications';

import {
  Divider,
  ListView,
  Row,
  Screen,
  Subtitle,
  Switch,
  View,
} from '@shoutem/ui';

import { NavigationBar } from '@shoutem/ui/navigation';
import { EmptyStateView } from '@shoutem/ui-addons';
import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';

import {
  fetchGroups,
  selectPushNotificationGroups,
  invalidateNotifications,
} from '../redux';

import { ext, GROUP_PREFIX } from '../const';
import { pushGroupShape } from '../components/shapes';

const { arrayOf, func, string } = PropTypes;

const renderEmptyScreen = () => (
  <EmptyStateView message={I18n.t(ext('noGroupsErrorMessage'))} />
);

const showPreviewModeNotification = () => {
  Alert.alert(
    I18n.t('shoutem.application.preview.pushGroupsPreviewAlertTitle'),
    I18n.t('shoutem.application.preview.pushGroupsPreviewAlertMessage'),
  );
};

const showSuggestionToEnableNotifications = () => {
  Alert.alert(
    I18n.t(ext('notificationPermissionsAlertTitle')),
    I18n.t(ext('notificationPermissionsAlertMessage')),
    [
      { text: I18n.t(ext('notificationPermissionsSettings')), onPress: () => Permissions.openSettings() },
      { text: I18n.t(ext('notificationPermissionsCancel')) },
    ],
  );
};

/**
 * Displays a list of push groups for this app and marks those that the user is subscribed to.
 * It also lets the user subscribe or unsubscribe from groups.
 */
export class PushGroupsScreen extends Component {
  static propTypes = {
    // All push groups for the app
    groups: arrayOf(pushGroupShape).isRequired,
    // Fetches push groups
    fetchGroups: func,
    // Tags of push groups that the user is subscribed to
    selectedGroups: arrayOf(string).isRequired,
    // Used to subscribe and unsubscribe from groups
    selectPushNotificationGroups: func.isRequired,
    // Used to invalidate notifications after a change in subscribed groups
    invalidateNotifications: func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onToggleGroupSubscription = this.onToggleGroupSubscription.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.state = { areNotificationsEnabled: false };
  }

  componentDidMount() {
    const { fetchGroups } = this.props;

    fetchGroups();

    // Push groups and notifications are not enabled when there are no certificates set up.
    // They are usually set up only in production environments
    if (!isProduction()) {
      showPreviewModeNotification();
      return;
    }

    this.checkIfNotificationsAreEnabled();
  }

  onToggleGroupSubscription(tag, value) {
    const {
      selectPushNotificationGroups,
      invalidateNotifications,
    } = this.props;

    const added = value ? [tag] : [];
    const removed = value ? [] : [tag];

    selectPushNotificationGroups({ added, removed });
    invalidateNotifications();
  }

  checkIfNotificationsAreEnabled() {
    Permissions.arePushNotificationsEnabled((result) => {
      if (!result) {
        showSuggestionToEnableNotifications();
      }
    });
  }

  renderRow(group) {
    const { tag, name } = group;
    const { selectedGroups } = this.props;

    const prefixedTag = `${GROUP_PREFIX + tag}`;

    return (
      <View>
        <Row styleName="small space-between">
          <Subtitle>{name}</Subtitle>
          <Switch
            value={_.includes(selectedGroups, prefixedTag)}
            onValueChange={value => this.onToggleGroupSubscription(prefixedTag, value)}
          />
        </Row>
        <Divider styleName="line" />
      </View>
    );
  }

  render() {
    const { groups } = this.props;

    if (_.isEmpty(groups)) {
      return renderEmptyScreen();
    }

    return (
      <Screen>
        <NavigationBar title={I18n.t(ext('pushGroupsSettingsNavBarTitle'))} />
        <View styleName="md-gutter solid">
          <Subtitle styleName="h-center">{I18n.t(ext('subscribeToPushGroups'))}</Subtitle>
        </View>
        <ListView
          data={[...groups]}
          renderRow={this.renderRow}
        />
      </Screen>
    );
  }
}

export const mapStateToProps = state => ({
  groups: state[ext()].groups.data || [],
  selectedGroups: state[ext()].selectedGroups || [],
});

export default connect(mapStateToProps, { fetchGroups, invalidateNotifications, selectPushNotificationGroups })(
  connectStyle(ext('PushGroupsListScreen'))(PushGroupsScreen),
);
