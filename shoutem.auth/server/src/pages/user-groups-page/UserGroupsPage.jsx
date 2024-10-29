import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  createUserGroup,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  deleteUserGroup,
  getAllUserGroups,
  getUserGroupCount,
  getUserGroups,
  loadAllUserGroups,
  loadNextUserGroupsPage,
  loadPreviousUserGroupsPage,
  loadUserGroups,
  updateUserGroup,
  UserGroupScreenSettings,
  UserGroupsDashboard,
} from 'src/modules/user-groups';
import { LoaderContainer, Paging } from '@shoutem/react-web-ui';
import {
  fetchExtension,
  fetchShortcuts,
  getShortcuts,
  updateShortcutSettings,
} from '@shoutem/redux-api-sdk';
import { isBusy, isInitialized, shouldLoad } from '@shoutem/redux-io';

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
  allUserGroups: PropTypes.array,
  appId: PropTypes.string,
  createUserGroup: PropTypes.func,
  deleteUserGroup: PropTypes.func,
  extension: PropTypes.object,
  fetchExtension: PropTypes.func,
  fetchShortcuts: PropTypes.func,
  loadAllUserGroups: PropTypes.func,
  loadNextPage: PropTypes.func,
  loadPreviousPage: PropTypes.func,
  loadUserGroups: PropTypes.func,
  shortcuts: PropTypes.array,
  updateShortcutSettings: PropTypes.func,
  updateUserGroup: PropTypes.func,
  userGroups: PropTypes.array,
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
