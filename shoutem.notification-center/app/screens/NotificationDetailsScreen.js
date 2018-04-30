import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';

import {
  ScrollView,
  Screen,
  Title,
  Caption,
  Html,
  View,
  Button,
  Text,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import { I18n } from 'shoutem.i18n';

import { formatTimestamp } from '../shared/calendar';
import { ext } from '../const';

import { notificationShape } from '../components/shapes';

const { func } = PropTypes;

export class NotificationDetailsScreen extends Component {
  static propTypes = {
    // The notification
    notification: notificationShape.isRequired,
    // Dispatches the notification action if it has one
    viewNotification: func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleViewNotification = this.handleViewNotification.bind(this);
  }

  handleViewNotification() {
    const { notification, viewNotification } = this.props;

    viewNotification(notification);
  }

  renderViewNotificationButton() {
    return (
      <Button
        onPress={this.handleViewNotification}
        styleName="secondary"
      >
        <Text>{I18n.t(ext('viewNotificationButton'))}</Text>
      </Button>
    );
  }

  renderContent() {
    const { notification } = this.props;
    const { action, summary, timestamp, title } = notification;

    return (
      <View styleName="vertical h-center v-start">
        {title ? (
          <Title styleName="xl-gutter-top lg-gutter-bottom">
            {title.toUpperCase()}
          </Title>
        ) : null}
        <Caption styleName="xl-gutter-bottom">
          {formatTimestamp(timestamp)}
        </Caption>
        <Html body={summary} />
        {action && this.renderViewNotificationButton()}
      </View>
    );
  }

  render() {
    return (
      <Screen styleName="full-screen paper">
        <NavigationBar styleName="no-border" />
        <ScrollView>
          {this.renderContent()}
        </ScrollView>
      </Screen>
    );
  }
}

export const mapDispatchToProps = (dispatch) => ({
  viewNotification: (notification) => {
    dispatch(notification.action);
  },
});

export default connect(undefined, mapDispatchToProps)(
  connectStyle(ext('NotificationDetailsScreen'))(NotificationDetailsScreen),
);
