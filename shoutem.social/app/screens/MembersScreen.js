import React from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RemoteDataListScreen } from 'shoutem.application';
import { getUser, authenticate } from 'shoutem.auth/redux';
import {
  getRouteParams,
  navigateTo,
  HeaderIconButton,
} from 'shoutem.navigation';
import { isBusy, isInitialized, next } from '@shoutem/redux-io';
import {
  setStatus,
  createStatus,
  updateStatus,
  validationStatus,
} from '@shoutem/redux-io/status';
import { connectStyle } from '@shoutem/theme';
import { ListView } from '@shoutem/ui';
import MemberView from '../components/MemberView';
import { getUsers, getUsersInGroups } from '../redux/selectors';
import { ext } from '../const';
import { loadUsers, loadUsersInGroups, blockUser } from '../redux';
import { openProfileForLegacyUser, openBlockActionSheet } from '../services';

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
    const { blockUser, authenticate } = this.props;

    const handleBlockPress = () =>
      authenticate(currentUser =>
        blockUser(user.legacyId, currentUser.legacyId),
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
      InteractionManager.runAfterInteractions(() => {
        if (showAllUsers) {
          loadUsers();
        } else {
          loadUsersInGroups(visibleGroups);
        }
      });
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

    if (this.shouldRenderPlaceholderView(data)) {
      return this.renderPlaceholderView(data);
    }

    return (
      <ListView
        data={data}
        getSectionId={this.getSectionId}
        initialListSize={1}
        loading={isBusy(data) || !isInitialized(data)}
        onLoadMore={this.loadMore}
        onRefresh={this.fetchData}
        renderRow={this.renderRow}
        style={style.list}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const routeParams = getRouteParams(ownProps);
  const users = _.get(routeParams, 'users');
  const userGroups = _.get(ownProps, 'shortcut.settings.userGroups', []);
  const visibleGroups = userGroups.length
    ? userGroups.filter(group => group.visible)
    : [];
  const visibleGroupIds = visibleGroups.length
    ? visibleGroups.map(group => group.id)
    : [];
  const showAllUsers = _.get(ownProps, 'shortcut.settings.showAllUsers', true);
  const visibleUsers = showAllUsers ? getUsers(state) : getUsersInGroups(state);

  // update status to valid to initialize data
  const initializedStatus = updateStatus(createStatus(), {
    validationStatus: validationStatus.VALID,
  });
  setStatus(visibleUsers, initializedStatus);
  if (users) {
    setStatus(users, initializedStatus);
  }

  return {
    data: users || visibleUsers,
    visibleGroups: visibleGroupIds,
    showAllUsers,
    currentUser: getUser(state) || {},
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...bindActionCreators(
    {
      loadUsers: ownProps.users ? undefined : loadUsers,
      loadUsersInGroups: ownProps.users ? undefined : loadUsersInGroups,
      next,
      blockUser,
      authenticate,
    },
    dispatch,
  ),
  openProfile: openProfileForLegacyUser(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('MembersScreen'))(MembersScreen));
