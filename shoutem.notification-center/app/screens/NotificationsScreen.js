import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { InteractionManager } from 'react-native';
import autoBindReact from 'auto-bind/react';
import { next } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { ListScreen } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { fetchNotifications, markAsRead, viewNotification } from '../redux';
import { notificationShape } from '../components/shapes';
import NotificationView from '../components/NotificationView';
import { ext } from '../const';

const { arrayOf, func, shape } = PropTypes;

class NotificationsScreen extends ListScreen {
  static propTypes = {
    ...ListScreen.propTypes,
    // Notifications
    data: shape({
      data: arrayOf(notificationShape),
    }),
    // Actions
    viewNotification: func.isRequired,
    fetchNotifications: func.isRequired,
    markAsRead: func,
    next: func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  // notifications data does not work with redux-io's
  // shouldRefresh() function, so we manually refresh
  // on each mount
  // TODO: Revise shouldRefresh() more in-depth and
  // resolve this issue properly to avoid unneccessary
  // fetching
  componentDidMount() {
    this.fetchData();
  }

  // @see shoutem.application.RemoteDataListScreen
  fetchData() {
    const { fetchNotifications } = this.props;
    const rioFindParams = this.getSelectedGroupsAsParams();

    InteractionManager.runAfterInteractions(() => {
      fetchNotifications(rioFindParams);
    });
  }

  /**
   * Filters out the groups the user is subscribed to
   * by checking their (firebase) tags.
   * Returns a redux-io find() params object
   */
  getSelectedGroupsAsParams() {
    const { groups = [], selectedGroups = [] } = this.props;

    const groupId = groups
      .filter(group => _.includes(selectedGroups, `group.${group.tag}`))
      .map(group => group.id);

    if (_.isEmpty(groupId)) {
      return;
    }

    return {
      query: {
        'filter[groupId]': groupId.join(),
      },
    };
  }

  getNavigationBarProps() {
    return {
      title: I18n.t(ext('notificationListNavBarTitle')),
    };
  }

  handleNotificationPress(notification) {
    const { markAsRead, viewNotification } = this.props;
    const { read } = notification;

    if (!read) {
      markAsRead(notification);
    }

    viewNotification(notification);
  }

  getListProps() {
    const { data } = this.props;
    const notifications = _.get(data, 'data', []);

    return {
      data: notifications,
    };
  }

  renderRow = notification => (
    <NotificationView
      notification={notification}
      onPress={this.handleNotificationPress}
    />
  );
}

const mapStateToProps = state => ({
  data: state[ext()].notifications,
  groups: state[ext()].groups.data || [],
  selectedGroups: state[ext()].selectedGroups,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchNotifications,
      markAsRead,
      next,
      viewNotification,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('NotificationsListScreen'))(NotificationsScreen));
