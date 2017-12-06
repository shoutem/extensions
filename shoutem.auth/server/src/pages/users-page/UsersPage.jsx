import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Paging, LoaderContainer } from '@shoutem/react-web-ui';
import { shouldLoad, isInitialized, hasNext, hasPrev } from '@shoutem/redux-io';
import { getErrorCode } from '@shoutem/redux-api-sdk';
import {
  UsersDashboard,
  getUsers,
  loadUsers,
  loadNextUsersPage,
  loadPreviousUsersPage,
  createUser,
  deleteUser,
  updateUser,
  getErrorMessage,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
} from 'src/modules/users';
import {
  loadUserGroups,
  getUserGroups,
} from 'src/modules/user-groups';
import './style.scss';

const DEFAULT_PAGING = {
  limit: DEFAULT_LIMIT,
  offset: DEFAULT_OFFSET,
};

export class UsersPage extends Component {
  constructor(props, context) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.loadUsers = this.loadUsers.bind(this);
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
    this.handlePreviousPageClick = this.handlePreviousPageClick.bind(this);
    this.handleUserCreate = this.handleUserCreate.bind(this);
    this.handleUserUpdate = this.handleUserUpdate.bind(this);
    this.handleUserDelete = this.handleUserDelete.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);

    const { page } = context;
    const ownerId = _.get(page, 'pageContext.currentUserId');

    this.state = {
      ownerId,
      filter: {},
      inProgress: false,
      showLoaderOnRefresh: false,
    };
  }

  componentWillMount() {
    this.checkData(this.props, null, true);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}, willMount = false) {
    const { appId } = nextProps;

    if (shouldLoad(nextProps, props, 'users')) {
      this.loadUsers(willMount);
    }

    if (shouldLoad(nextProps, props, 'userGroups')) {
      this.props.loadUserGroups(appId);
    }
  }

  loadUsers(defaultPaging) {
    const { appId } = this.props;
    const { filter } = this.state;

    const pagingInfo = defaultPaging ? DEFAULT_PAGING : this.refs.paging.getPagingInfo();
    const { limit, offset } = pagingInfo;

    this.setState({ inProgress: true });

    this.props.loadUsers(appId, filter, limit, offset)
      .then(() => this.setState({
        inProgress: false,
        showLoaderOnRefresh: false,
      }));
  }

  handleNextPageClick() {
    const { users } = this.props;

    this.setState({
      showLoaderOnRefresh: true,
      inProgress: true,
    });

    this.props.loadNextPage(users).then(() => (
      this.setState({
        inProgress: false,
        showLoaderOnRefresh: false,
      })
    ));
  }

  handlePreviousPageClick() {
    const { users } = this.props;

    this.setState({
      showLoaderOnRefresh: true,
      inProgress: true,
    });

    this.props.loadPreviousPage(users).then(() => (
      this.setState({
        inProgress: false,
        showLoaderOnRefresh: false,
      })
    ));
  }

  handleUserCreate(user) {
    const { appId } = this.props;
    this.setState({ showLoaderOnRefresh: true });

    return new Promise((resolve, reject) => (
      this.props.createUser(appId, user)
        .then(resolve, (action) => {
          this.setState({ showLoaderOnRefresh: false });
          const errorCode = getErrorCode(action);
          reject(getErrorMessage(errorCode));
        })
    ));
  }

  handleUserUpdate(userId, user) {
    const { appId } = this.props;
    return this.props.updateUser(appId, userId, user);
  }

  handleUserDelete(userId) {
    const { appId } = this.props;
    return this.props.deleteUser(appId, userId);
  }

  handleFilterChange(filter) {
    const { filter: currentFilter } = this.state;
    const newFilter = {
      ...currentFilter,
      ...filter,
    };

    this.refs.paging.reset();

    this.setState({
      filter: newFilter,
      showLoaderOnRefresh: true,
    }, this.loadUsers);
  }

  render() {
    const { users, userGroups } = this.props;

    const {
      inProgress,
      showLoaderOnRefresh,
      filter,
      ownerId,
    } = this.state;

    const isLoading = (
      (showLoaderOnRefresh && inProgress) ||
      !isInitialized(users)
    );

    return (
      <LoaderContainer
        className="users-page settings-page is-wide"
        isLoading={isLoading}
        isOverlay={inProgress}
      >
        <UsersDashboard
          users={users}
          userGroups={userGroups}
          filter={filter}
          ownerId={ownerId}
          onFilterChange={this.handleFilterChange}
          onUserCreate={this.handleUserCreate}
          onUserDelete={this.handleUserDelete}
          onUserUpdate={this.handleUserUpdate}
        />
        <Paging
          ref="paging"
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
  appId: PropTypes.string,
  users: PropTypes.array,
  userGroups: PropTypes.array,
  loadUsers: PropTypes.func,
  loadNextPage: PropTypes.func,
  loadPreviousPage: PropTypes.func,
  loadUserGroups: PropTypes.func,
  createUser: PropTypes.func,
  updateUser: PropTypes.func,
  deleteUser: PropTypes.func,
};

UsersPage.contextTypes = {
  page: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    users: getUsers(state),
    userGroups: getUserGroups(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;
  const scope = { extensionName };

  return {
    loadUsers: (appId, filter, limit, offset) => (
      dispatch(loadUsers(appId, filter, limit, offset, scope))
    ),
    loadNextPage: (users) => (
      dispatch(loadNextUsersPage(users))
    ),
    loadPreviousPage: (users) => (
      dispatch(loadPreviousUsersPage(users))
    ),
    loadUserGroups: (appId) => (
      dispatch(loadUserGroups(appId, scope))
    ),
    createUser: (appId, user) => (
      dispatch(createUser(appId, user, scope))
    ),
    updateUser: (appId, userId, user) => (
      dispatch(updateUser(appId, userId, user, scope))
    ),
    deleteUser: (appId, userId) => (
      dispatch(deleteUser(appId, userId))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);
