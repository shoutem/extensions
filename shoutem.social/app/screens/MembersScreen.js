import React from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import {
  isBusy,
  isError,
  isInitialized,
  isValid,
  next,
} from '@shoutem/redux-io';
import {
  createStatus,
  setStatus,
  updateStatus,
  validationStatus,
} from '@shoutem/redux-io/status';
import { connectStyle } from '@shoutem/theme';
import { ActionSheet, ListView, Spinner, View } from '@shoutem/ui';
import { RemoteDataListScreen } from 'shoutem.application';
import { authenticate, getUser } from 'shoutem.auth/redux';
import { I18n } from 'shoutem.i18n';
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
import { openProfileForLegacyUser } from '../services';

export class MembersScreen extends RemoteDataListScreen {
  static propTypes = {
    ...RemoteDataListScreen.propTypes,
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      actionSheetOpen: false,
      cancelOptions: [
        {
          title: I18n.t(ext('reportOptionCancel')),
          onPress: this.handleActionSheetDismiss,
        },
      ],
    };
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

  shouldRenderPlaceholderView(data) {
    if ((!isInitialized(data) && !isError(data)) || isBusy(data)) {
      // Data is loading, treat it as valid for now
      return false;
    }

    // We want to render a placeholder only in case of errors
    return isError(data);
  }

  handleMenuPress(user) {
    const { authenticate, blockUser, loadBlockedUsers } = this.props;

    const handleBlockPress = () =>
      authenticate(currentUser => {
        blockUser(user.legacyId, currentUser.legacyId).then(loadBlockedUsers);
        this.handleActionSheetDismiss();
      });

    this.setState({
      confirmOptions: [
        {
          title: I18n.t(ext('blockOption')),
          onPress: handleBlockPress,
        },
        {
          title: I18n.t(ext('reportOption')),
          onPress: this.handleReportUser,
        },
      ],
      actionSheetOpen: true,
    });
  }

  handleActionSheetDismiss() {
    this.setState({ actionSheetOpen: false });
  }

  handleReportUser() {
    this.handleActionSheetDismiss();

    Alert.alert(
      I18n.t(ext('reportSuccessTitle')),
      I18n.t(ext('reportSuccessMessage')),
    );
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

  handleMemberItemPress(user) {
    const { openProfileForLegacyUser, currentUser } = this.props;

    const isOwnUser =
      currentUser.legacyId?.toString() ===
      (user.legacyId ?? user.id)?.toString();

    openProfileForLegacyUser(user.legacyId, isOwnUser);
  }

  renderRow(user) {
    const { currentUser } = this.props;

    const isOwnUser =
      currentUser.legacyId?.toString() ===
      (user.legacyId ?? user.id)?.toString();

    return (
      <MemberView
        user={user}
        isOwnUser={isOwnUser}
        onMenuPress={this.handleMenuPress}
        onMemberPress={this.handleMemberItemPress}
      />
    );
  }

  renderData(data) {
    const { style } = this.props;
    const { actionSheetOpen, cancelOptions, confirmOptions } = this.state;

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
      <>
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
        <ActionSheet
          active={actionSheetOpen}
          cancelOptions={cancelOptions}
          confirmOptions={confirmOptions}
          onDismiss={this.handleActionSheetDismiss}
        />
      </>
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
        openProfileForLegacyUser,
      },
      dispatch,
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('MembersScreen'))(MembersScreen));
