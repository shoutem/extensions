import React, { PureComponent } from 'react';
import { Alert, AppState } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Divider,
  EmptyStateView,
  ListView,
  Row,
  Screen,
  Subtitle,
  Switch,
  View,
} from '@shoutem/ui';
import { isProduction } from 'shoutem.application';
import { Firebase } from 'shoutem.firebase';
import { I18n } from 'shoutem.i18n';
import { checkNotifications, openSettings, RESULTS } from 'shoutem.permissions';
import { selectPushNotificationGroups } from 'shoutem.push-notifications';
import { ext, GROUP_PREFIX, pushGroupShape } from '../const';
import { fetchGroups, invalidateNotifications } from '../redux';

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

/**
 * Displays a list of push groups for this app and marks those that the user is subscribed to.
 * It also lets the user subscribe or unsubscribe from groups.
 */
export class PushGroupsScreen extends PureComponent {
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

    autoBindReact(this);

    this.state = { areNotificationsEnabled: true };
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

  componentWillUnmount() {
    this.appStateListener?.remove();
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

  handleOpenSettingsPress() {
    this.appStateListener = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );
    openSettings();
  }

  showSuggestionToEnableNotifications() {
    Alert.alert(
      I18n.t(ext('notificationPermissionsAlertTitle')),
      I18n.t(ext('notificationPermissionsAlertMessage')),
      [
        {
          text: I18n.t(ext('notificationPermissionsSettings')),
          onPress: this.handleOpenSettingsPress,
        },
        { text: I18n.t(ext('notificationPermissionsCancel')) },
      ],
    );
  }

  handleAppStateChange(appState) {
    const { areNotificationsEnabled } = this.state;

    /**
     * When the user, who initially had disabled notifications, pulls the app from background to foreground,
     * we check if notifications are enabled in the meantime and if they are - we obtain FCM token.
     * This covers scenarios when user navigates to device Settings, enables notifications and returns back to the app.
     */
    if (appState === 'active' && !areNotificationsEnabled) {
      checkNotifications().then(({ status }) => {
        if (status === RESULTS.GRANTED) {
          this.appStateListener?.remove();
        }
      });
    }
  }

  // Checks if notifications are curently disabled and opens "Go to Settings" pop up
  checkIfNotificationsAreEnabled() {
    checkNotifications()
      .then(({ status }) => {
        if (status === RESULTS.BLOCKED) {
          this.showSuggestionToEnableNotifications();
          this.setState({ areNotificationsEnabled: false });
        }
      })
      .catch(error => {
        console.log('Check push notification permissions failed:', error);
      });
  }

  renderRow(group) {
    const { tag, name } = group;
    const { selectedGroups } = this.props;

    const prefixedTag = `${GROUP_PREFIX}${tag}`;

    return (
      <View>
        <Row styleName="small space-between">
          <Subtitle>{name}</Subtitle>
          <Switch
            value={_.includes(selectedGroups, prefixedTag)}
            onValueChange={value =>
              this.onToggleGroupSubscription(prefixedTag, value)
            }
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
        <View styleName="md-gutter solid">
          <Subtitle styleName="h-center">
            {I18n.t(ext('subscribeToPushGroups'))}
          </Subtitle>
        </View>
        <ListView data={[...groups]} renderRow={this.renderRow} />
      </Screen>
    );
  }
}

export const mapStateToProps = state => ({
  groups: state[ext()].groups.data || [],
  selectedGroups: state[ext()].selectedGroups || [],
});

const mapDispatchToProps = {
  fetchGroups,
  invalidateNotifications,
  selectPushNotificationGroups,
  obtainFCMToken: Firebase.obtainFCMToken,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('PushGroupsListScreen'))(PushGroupsScreen));
