import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getAllUserGroups, loadAllUserGroups } from 'src/modules/user-groups';
import {
  changePassword,
  changeRole,
  createUser,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  deleteUser,
  downloadUserData,
  getErrorMessage,
  getUsers,
  loadNextUsersPage,
  loadPreviousUsersPage,
  loadUser,
  loadUsers,
  updateUser,
  UsersDashboard,
} from 'src/modules/users';
import { LoaderContainer, Paging } from '@shoutem/react-web-ui';
import { getErrorCode } from '@shoutem/redux-api-sdk';
import { hasNext, hasPrev, isInitialized, shouldLoad } from '@shoutem/redux-io';
import './style.scss';

const DEFAULT_PAGING = {
  limit: DEFAULT_LIMIT,
  offset: DEFAULT_OFFSET,
};

export class UsersPage extends Component {
  constructor(props, context) {
    super(props);
    autoBindReact(this);

    const { page } = context;
    const ownerId = _.get(page, 'pageContext.currentUserId');

    this.pageRef = createRef();

    this.state = {
      ownerId,
      filter: {},
      inProgress: false,
      showLoaderOnRefresh: false,
    };
  }

  componentDidMount() {
    this.checkData(this.props, null, true);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}, willMount = false) {
    const { loadAllUserGroups } = this.props;
    const { appId } = nextProps;

    if (shouldLoad(nextProps, props, 'users')) {
      this.loadUsers(willMount);
    }

    if (shouldLoad(nextProps, props, 'userGroups')) {
      loadAllUserGroups(appId);
    }
  }

  loadUsers(defaultPaging) {
    const { appId, loadUsers } = this.props;
    const { filter } = this.state;

    const pagingInfo = defaultPaging
      ? DEFAULT_PAGING
      : this.pageRef.current.getPagingInfo();
    const { limit, offset } = pagingInfo;

    this.setState({ inProgress: true });

    loadUsers(appId, filter, limit, offset).then(() =>
      this.setState({
        inProgress: false,
        showLoaderOnRefresh: false,
      }),
    );
  }

  handleNextPageClick() {
    const { users, loadNextPage } = this.props;

    this.setState({
      showLoaderOnRefresh: true,
      inProgress: true,
    });

    loadNextPage(users).then(() =>
      this.setState({
        inProgress: false,
        showLoaderOnRefresh: false,
      }),
    );
  }

  handlePreviousPageClick() {
    const { users, loadPreviousPage } = this.props;

    this.setState({
      showLoaderOnRefresh: true,
      inProgress: true,
    });

    loadPreviousPage(users).then(() =>
      this.setState({
        inProgress: false,
        showLoaderOnRefresh: false,
      }),
    );
  }

  handleUserCreate(user) {
    const { appId, createUser } = this.props;
    this.setState({ showLoaderOnRefresh: true });

    return new Promise((resolve, reject) =>
      createUser(appId, user).then(resolve, action => {
        this.setState({ showLoaderOnRefresh: false });
        const errorCode = getErrorCode(action);
        reject(getErrorMessage(errorCode));
      }),
    );
  }

  handleUserUpdate(userId, user) {
    const { appId, updateUser } = this.props;
    return updateUser(appId, userId, user);
  }

  handleDownloadUserData() {
    const { appId } = this.props;
    return downloadUserData(appId);
  }

  handleUserDelete(userId) {
    const { appId, deleteUser } = this.props;
    return deleteUser(appId, userId);
  }

  handleUserChangePassword(userId, password) {
    const { appId, changePassword } = this.props;
    return changePassword(appId, userId, password);
  }

  async handleUserChangeRole(userId, role) {
    const { appId, changeRole, loadUser } = this.props;
    await changeRole(appId, userId, role);
    await loadUser(appId, userId);
  }

  handleFilterChange(filter) {
    const { filter: currentFilter } = this.state;
    const newFilter = {
      ...currentFilter,
      ...filter,
    };

    this.pageRef.current.reset();

    this.setState(
      {
        filter: newFilter,
        showLoaderOnRefresh: true,
      },
      this.loadUsers,
    );
  }

  render() {
    const { users, userGroups, appId } = this.props;

    const { inProgress, showLoaderOnRefresh, filter, ownerId } = this.state;

    const isLoading =
      (showLoaderOnRefresh && inProgress) || !isInitialized(users);

    return (
      <LoaderContainer
        className="users-page settings-page is-wide"
        isLoading={isLoading}
        isOverlay={inProgress}
      >
        <UsersDashboard
          appId={appId}
          users={users}
          userGroups={userGroups}
          filter={filter}
          ownerId={ownerId}
          onFilterChange={this.handleFilterChange}
          onUserCreate={this.handleUserCreate}
          onUserDelete={this.handleUserDelete}
          onUserUpdate={this.handleUserUpdate}
          onUserChangePassword={this.handleUserChangePassword}
          onUserChangeRole={this.handleUserChangeRole}
          onUserDataDownload={this.handleDownloadUserData}
        />
        <Paging
          ref={this.pageRef}
          hasNext={hasNext(users)}
          hasPrevious={hasPrev(users)}
          onNextPageClick={this.handleNextPageClick}
          onPreviousPageClick={this.handlePreviousPageClick}
        />
      </LoaderContainer>
    );
  }
}

UsersPage.propTypes = {
  appId: PropTypes.string.isRequired,
  changePassword: PropTypes.func.isRequired,
  changeRole: PropTypes.func.isRequired,
  createUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  loadAllUserGroups: PropTypes.func.isRequired,
  loadNextPage: PropTypes.func.isRequired,
  loadPreviousPage: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
  loadUsers: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  userGroups: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};

UsersPage.contextTypes = {
  page: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    users: getUsers(state),
    userGroups: getAllUserGroups(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;
  const scope = { extensionName };

  return {
    loadUser: (appId, userId) => dispatch(loadUser(appId, userId)),
    loadUsers: (appId, filter, limit, offset) =>
      dispatch(loadUsers(appId, filter, limit, offset, scope)),
    loadNextPage: users => dispatch(loadNextUsersPage(users)),
    loadPreviousPage: users => dispatch(loadPreviousUsersPage(users)),
    loadAllUserGroups: appId => dispatch(loadAllUserGroups(appId, scope)),
    createUser: (appId, user) => dispatch(createUser(appId, user, scope)),
    updateUser: (appId, userId, user) =>
      dispatch(updateUser(appId, userId, user, scope)),
    deleteUser: (appId, userId) => dispatch(deleteUser(appId, userId)),
    changePassword: (appId, userId, password) =>
      dispatch(changePassword(appId, userId, password)),
    changeRole: (appId, userId, role) =>
      dispatch(changeRole(appId, userId, role)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);
