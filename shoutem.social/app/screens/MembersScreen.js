import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { isBusy, isInitialized, isValid, next } from '@shoutem/redux-io';
import {
  createStatus,
  setStatus,
  updateStatus,
  validationStatus,
} from '@shoutem/redux-io/status';
import { connectStyle } from '@shoutem/theme';
import { ListView, Spinner, View } from '@shoutem/ui';
import { RemoteDataListScreen } from 'shoutem.application';
import { authenticate, getUser } from 'shoutem.auth/redux';
import {
  getRouteParams,
  HeaderIconButton,
  navigateTo,
} from 'shoutem.navigation';
import MemberView from '../components/MemberView';
import { ext } from '../const';
import {
  blockUser,
  loadBlockedUsers,
  loadUsers,
  loadUsersInGroups,
} from '../redux';
import { getUsers, getUsersInGroups } from '../redux/selectors';
import { openBlockActionSheet, openProfileForLegacyUser } from '../services';

export class MembersScreen extends RemoteDataListScreen {
  static propTypes = {
    ...RemoteDataListScreen.propTypes,
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  getNavBarProps() {
    return { headerRight: this.headerRight };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const { showAllUsers, userGroups, users } = this.props;
    const {
      showAllUsers: prevShowAllUsers,
      userGroups: prevUserGroups,
    } = prevProps;

    if (
      !users &&
      (showAllUsers !== prevShowAllUsers || userGroups !== prevUserGroups)
    ) {
      this.fetchData();
    }
  }

  handleMenuPress(user) {
    const { authenticate, blockUser, loadBlockedUsers } = this.props;

    const handleBlockPress = () =>
      authenticate(currentUser =>
        blockUser(user.legacyId, currentUser.legacyId).then(loadBlockedUsers),
      );

    return openBlockActionSheet(handleBlockPress);
  }

  openSearchScreen() {
    navigateTo(ext('SearchScreen'));
  }

  fetchData() {
    const {
      loadUsers,
      loadUsersInGroups,
      showAllUsers,
      users,
      visibleGroups,
    } = this.props;

    if (!users) {
      if (showAllUsers) {
        loadUsers();
      } else {
        loadUsersInGroups(visibleGroups);
      }
    }
  }

  headerRight(props) {
    return (
      <HeaderIconButton
        {...props}
        iconName="search"
        onPress={this.openSearchScreen}
      />
    );
  }

  renderRow(user) {
    const { openProfile, currentUser } = this.props;

    const isCurrentUser = currentUser.legacyId === user.legacyId;

    return (
      <MemberView
        openProfile={openProfile}
        user={user}
        showMenuIcon={!isCurrentUser}
        onMenuPress={this.handleMenuPress}
      />
    );
  }

  renderData(data) {
    const { style } = this.props;

    if (!isValid(data) || (isBusy(data) && !isInitialized(data))) {
      return (
        <View styleName="flexible horizontal h-center v-center">
          <Spinner />
        </View>
      );
    }

    if (this.shouldRenderPlaceholderView(data)) {
      return this.renderPlaceholderView(data);
    }

    return (
      <ListView
        data={data}
        getSectionId={this.getSectionId}
        initialListSize={1}
        loading={isBusy(data)}
        onLoadMore={this.loadMore}
        onRefresh={this.fetchData}
        renderRow={this.renderRow}
        style={style.list}
      />
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const routeParams = getRouteParams(ownProps);
  const users = _.get(routeParams, 'users');
  const userGroups = _.get(routeParams, 'shortcut.settings.userGroups', []);
  const showAllUsers = _.get(
    routeParams,
    'shortcut.settings.showAllUsers',
    true,
  );

  const visibleGroups = userGroups.length
    ? userGroups.filter(group => group.visible)
    : [];
  const visibleGroupIds = visibleGroups.length
    ? visibleGroups.map(group => group.id)
    : [];
  const visibleUsers = showAllUsers ? getUsers(state) : getUsersInGroups(state);

  // update status to valid to initialize data
  const initializedStatus = updateStatus(createStatus(), {
    validationStatus: validationStatus.VALID,
  });

  if (!showAllUsers) {
    setStatus(visibleUsers, initializedStatus);
  }

  if (users) {
    setStatus(users, initializedStatus);
  }

  return {
    data: users || visibleUsers,
    visibleGroups: visibleGroupIds,
    showAllUsers,
    currentUser: getUser(state) || {},
  };
}

export function mapDispatchToProps(dispatch, ownProps) {
  return {
    ...bindActionCreators(
      {
        loadBlockedUsers,
        loadUsers: ownProps.users ? undefined : loadUsers,
        loadUsersInGroups: ownProps.users ? undefined : loadUsersInGroups,
        next,
        blockUser,
        authenticate,
      },
      dispatch,
    ),
    openProfile: openProfileForLegacyUser(dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('MembersScreen'))(MembersScreen));
