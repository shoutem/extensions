import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isBusy, next } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { ListView, LoadingIndicator, Screen } from '@shoutem/ui';
import { hasModuleActive } from 'shoutem.application';
import { isUserAdmin } from 'shoutem.auth';
import { loginRequired } from 'shoutem.auth/loginRequired';
import { I18n } from 'shoutem.i18n';
import { isTabBarNavigation, navigateTo } from 'shoutem.navigation';
import {
  CreatePushNotificationButton,
  PushNotificationCard,
  PushNotificationsDisabled,
} from '../components';
import { ext, NOTIFICATIONS_MODULE_NAME } from '../const';
import {
  fetchScheduledNotifications,
  getScheduledNotifications,
} from '../redux';
import { formatGroupDisplayName } from '../services';

function PushNotificationsScreen({
  next,
  notifications,
  moduleEnabled,
  loading,
  isTabBar,
  fetchScheduledNotifications,
  userHasPermissions,
}) {
  const [loadingCollection, setLoadingCollection] = useState(false);

  useEffect(() => {
    if (moduleEnabled) {
      setLoadingCollection(true);
      fetchScheduledNotifications()
        .then(() => setLoadingCollection(false))
        .catch(() => setLoadingCollection(false));
    }
  }, [moduleEnabled, fetchScheduledNotifications]);

  function renderItem(item) {
    const {
      content: { title, summary },
      audience,
      active,
    } = item;

    const onCardPress = () =>
      navigateTo(
        active
          ? ext('EditPushNotificationScreen')
          : ext('ViewPushNotificationScreen'),
        { notification: item },
      );

    const group = formatGroupDisplayName(audience);

    return (
      <PushNotificationCard
        active={active}
        content={summary}
        group={group}
        title={title}
        onPress={onCardPress}
      />
    );
  }

  const handleRefresh = useCallback(async () => {
    setLoadingCollection(true);
    await fetchScheduledNotifications();
    setLoadingCollection(false);
  }, [fetchScheduledNotifications]);

  const handleCreateButtonPress = useCallback(
    () => navigateTo(ext('CreatePushNotificationScreen')),
    [],
  );

  const handleEndReached = useCallback(() => next(notifications), [
    notifications,
    next,
  ]);

  if (!moduleEnabled) {
    return <PushNotificationsDisabled />;
  }

  if (!userHasPermissions) {
    return (
      <PushNotificationsDisabled
        title={I18n.t(ext('pushNotificationsAccessRestrictedTitle'))}
        subtitle={I18n.t(ext('pushNotificationsAccessRestrictedMessage'))}
      />
    );
  }

  if (loadingCollection) {
    return (
      <Screen>
        <LoadingIndicator />
      </Screen>
    );
  }

  return (
    <Screen styleName={isTabBar ? '' : 'with-home-indicator-padding'}>
      <ListView
        data={notifications.data}
        emptyListMessage={I18n.t(ext('pushNotificationsListEmptyMessage'))}
        emptyListTitle={I18n.t(ext('pushNotificationsListEmptyTitle'))}
        loading={loading}
        onRefresh={handleRefresh}
        renderRow={renderItem}
        onLoadMore={handleEndReached}
      />
      <CreatePushNotificationButton onPress={handleCreateButtonPress} />
    </Screen>
  );
}

PushNotificationsScreen.propTypes = {
  fetchScheduledNotifications: PropTypes.func.isRequired,
  isTabBar: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  moduleEnabled: PropTypes.bool.isRequired,
  next: PropTypes.func.isRequired,
  userHasPermissions: PropTypes.bool.isRequired,
  notifications: PropTypes.object,
};

PushNotificationsScreen.defaultProps = {
  notifications: [],
};

export const mapStateToProps = state => {
  const notifications = getScheduledNotifications(state);

  return {
    moduleEnabled: hasModuleActive(state, NOTIFICATIONS_MODULE_NAME),
    notifications,
    loading: isBusy(notifications),
    userHasPermissions: isUserAdmin(state),
    isTabBar: isTabBarNavigation(state),
  };
};

const mapDispatchToProps = {
  fetchScheduledNotifications,
  next,
};

export default loginRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('PushNotificationsScreen'))(PushNotificationsScreen)),
);
