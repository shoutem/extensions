import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import {
  fetchExtension,
  fetchShortcuts,
  updateShortcutSettings,
  getShortcuts,
} from '@shoutem/redux-api-sdk';
import { LoaderContainer, Paging } from '@shoutem/react-web-ui';
import { shouldLoad, isInitialized, isBusy } from '@shoutem/redux-io';
import {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  UserGroupsDashboard,
  UserGroupScreenSettings,
  getUserGroups,
  getAllUserGroups,
  loadUserGroups,
  loadAllUserGroups,
  createUserGroup,
  deleteUserGroup,
  updateUserGroup,
  loadNextUserGroupsPage,
  loadPreviousUserGroupsPage,
  getUserGroupCount,
} from 'src/modules/user-groups';

function resolvePaging(currentPagingRef, useDefaultPaging) {
  const defaultPaging = {
    limit: DEFAULT_LIMIT,
    offset: DEFAULT_OFFSET,
  };

  if (useDefaultPaging) {
    return defaultPaging;
  }

  if (!currentPagingRef) {
    return defaultPaging;
  }

  return currentPagingRef.getPagingInfo();
}

export class UserGroupsPage extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      inProgress: false,
      paginationInProgress: false,
    };
  }

  componentDidMount() {
    this.checkData(this.props, null, true);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props, false);
  }

  checkData(nextProps, props = {}, useDefaultPaging = false) {
    if (shouldLoad(nextProps, props, 'userGroups')) {
      this.loadUserGroups(useDefaultPaging);
    }

    if (shouldLoad(nextProps, props, 'allUserGroups')) {
      this.props.loadAllUserGroups();
    }

    if (shouldLoad(nextProps, props, 'shortcuts')) {
      this.props.fetchShortcuts();
    }

    if (shouldLoad(nextProps, props, 'extension')) {
      this.props.fetchExtension();
    }
  }

  loadUserGroups(useDefaultPaging) {
    this.setState({ inProgress: true });
    const paging = resolvePaging(this.refs.paging, useDefaultPaging);

    return this.props.loadUserGroups(paging.limit, paging.offset);
  }

  handleNextPageClick() {
    const { userGroups } = this.props;
    this.setState({ paginationInProgress: true });

    return this.props
      .loadNextPage(userGroups)
      .then(() => this.setState({ paginationInProgress: false }));
  }

  handlePreviousPageClick() {
    const { userGroups } = this.props;
    this.setState({ paginationInProgress: true });

    return this.props
      .loadPreviousPage(userGroups)
      .then(() => this.setState({ paginationInProgress: false }));
  }

  render() {
    const { inProgress, paginationInProgress } = this.state;
    const { userGroups, allUserGroups, shortcuts, extension } = this.props;

    const isLoading =
      (isBusy(userGroups) && isBusy(allUserGroups)) ||
      !isInitialized(userGroups) ||
      !isInitialized(allUserGroups) ||
      !isInitialized(shortcuts) ||
      isBusy(extension);

    const allScreensProtected = _.get(
      extension,
      'settings.allScreensProtected',
      false,
    );

    const paging = resolvePaging(this.refs.paging);

    return (
      <LoaderContainer
        className="user-groups-page settings-page"
        isLoading={isLoading}
        isOverlay={inProgress || isBusy(extension)}
      >
        <LoaderContainer isOverlay isLoading={paginationInProgress}>
          <UserGroupsDashboard
            userGroups={userGroups}
            onUserGroupCreate={this.props.createUserGroup}
            onUserGroupDelete={this.props.deleteUserGroup}
            onUserGroupUpdate={this.props.updateUserGroup}
          />
          <Paging
            limit={paging.limit}
            offset={paging.offset}
            itemCount={getUserGroupCount(userGroups)}
            onNextPageClick={this.handleNextPageClick}
            onPreviousPageClick={this.handlePreviousPageClick}
            ref="paging"
          />
        </LoaderContainer>
        <UserGroupScreenSettings
          disabled={!allScreensProtected}
          shortcuts={shortcuts}
          userGroups={allUserGroups}
          onScreenVisibilityUpdate={this.props.updateShortcutSettings}
        />
      </LoaderContainer>
    );
  }
}

UserGroupsPage.propTypes = {
  appId: PropTypes.string,
  extension: PropTypes.object,
  fetchExtension: PropTypes.func,
  shortcuts: PropTypes.array,
  fetchShortcuts: PropTypes.func,
  userGroups: PropTypes.array,
  allUserGroups: PropTypes.array,
  loadUserGroups: PropTypes.func,
  loadAllUserGroups: PropTypes.func,
  createUserGroup: PropTypes.func,
  deleteUserGroup: PropTypes.func,
  updateUserGroup: PropTypes.func,
  updateShortcutSettings: PropTypes.func,
  loadNextPage: PropTypes.func,
  loadPreviousPage: PropTypes.func,
};

UserGroupsPage.contextTypes = {
  page: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    userGroups: getUserGroups(state),
    allUserGroups: getAllUserGroups(state),
    shortcuts: getShortcuts(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { appId, extensionName } = ownProps;
  const scope = { extensionName };

  return {
    loadAllUserGroups: () => dispatch(loadAllUserGroups(appId, scope)),
    loadUserGroups: (limit, offset) =>
      dispatch(loadUserGroups(appId, limit, offset, scope)),
    createUserGroup: name => dispatch(createUserGroup(appId, name, scope)),
    deleteUserGroup: groupId =>
      dispatch(deleteUserGroup(appId, groupId, scope)),
    updateUserGroup: (groupId, groupPatch) =>
      dispatch(updateUserGroup(appId, groupId, groupPatch, scope)),
    fetchShortcuts: () => dispatch(fetchShortcuts()),
    updateShortcutSettings: (shortcut, settings) =>
      dispatch(updateShortcutSettings(shortcut, settings)),
    fetchExtension: () => dispatch(fetchExtension(extensionName)),
    loadNextPage: userGroups => dispatch(loadNextUserGroupsPage(userGroups)),
    loadPreviousPage: userGroups =>
      dispatch(loadPreviousUserGroupsPage(userGroups)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserGroupsPage);
