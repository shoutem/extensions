import React from 'react';

import { connect } from 'react-redux';

import {
  InteractionManager,
} from 'react-native';

import { next } from '@shoutem/redux-io';
import { navigateTo } from '@shoutem/core/navigation';

import { connectStyle } from '@shoutem/theme';
import { ListScreen } from 'shoutem.application';

import {
  fetchNotifications,
  markAsRead,
} from '../redux';

import { notificationShape } from '../components/shapes';
import NotificationView from '../components/NotificationView';

import { ext } from '../const';

const TITLE = 'NOTIFICATIONS';

const { arrayOf, func, shape } = React.PropTypes;

class NotificationsScreen extends ListScreen {
  static propTypes = {
    ...ListScreen.propTypes,
    // Notifications
    data: shape({
      data: arrayOf(notificationShape),
    }),
    // Actions
    fetchNotifications: func.isRequired,
    markAsRead: func,
    next: func,
    navigateTo: func,
  };

  constructor(props) {
    super(props);

    this.handleNotificationPress = this.handleNotificationPress.bind(this);
  }

  fetchData() {
    const { fetchNotifications } = this.props;

    InteractionManager.runAfterInteractions(() => {
      fetchNotifications();
    });
  }

  getNavigationBarProps() {
    return {
      title: TITLE,
    };
  }

  handleNotificationPress(notification) {
    const { markAsRead, navigateTo } = this.props;
    const { read } = notification;

    if (!read) {
      markAsRead(notification);
    }

    navigateTo({
      screen: ext('NotificationDetailsScreen'),
      props: {
        notification,
      },
    });
  }

  getListProps() {
    return {
      data: this.props.data.data,
    };
  }

  renderRow = (notification) => (
    <NotificationView
      notification={notification}
      onPress={this.handleNotificationPress}
    />
  );
}

const mapStateToProps = state => ({
  data: state[ext()].notifications,
});

export default connect(mapStateToProps, { fetchNotifications, markAsRead, navigateTo, next })(
  connectStyle(ext('NotificationsListScreen'))(NotificationsScreen),
);
