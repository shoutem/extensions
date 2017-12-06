import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  fetchExtension,
  fetchShortcuts,
  updateShortcutSettings,
  getShortcuts,
} from '@shoutem/redux-api-sdk';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { shouldLoad, isInitialized, isBusy } from '@shoutem/redux-io';
import {
  UserGroupsDashboard,
  UserGroupScreenSettings,
  getUserGroups,
  loadUserGroups,
  createUserGroup,
  deleteUserGroup,
  updateUserGroup,
} from 'src/modules/user-groups';

export class UserGroupsPage extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.loadUserGroups = this.loadUserGroups.bind(this);
    this.handleUserGroupCreate = this.handleUserGroupCreate.bind(this);

    this.state = {
      inProgress: false,
      showLoaderOnRefresh: false,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    if (shouldLoad(nextProps, props, 'userGroups')) {
      this.loadUserGroups();
    }

    if (shouldLoad(nextProps, props, 'shortcuts')) {
      this.props.fetchShortcuts();
    }

    if (shouldLoad(nextProps, props, 'extension')) {
      this.props.fetchExtension();
    }
  }

  loadUserGroups() {
    this.setState({ inProgress: true });

    this.props.loadUserGroups().then(() => (
      this.setState({
        inProgress: false,
        showLoaderOnRefresh: false,
      })
    ));
  }

  handleUserGroupCreate(groupName) {
    this.setState({ showLoaderOnRefresh: true });
    return this.props.createUserGroup(groupName);
  }

  render() {
    const { inProgress, showLoaderOnRefresh } = this.state;
    const {
      userGroups,
      shortcuts,
      extension,
    } = this.props;

    const isLoading = (
      (showLoaderOnRefresh && inProgress) ||
      !isInitialized(userGroups) ||
      !isInitialized(shortcuts) ||
      isBusy(extension)
    );

    const allScreensProtected = _.get(extension, 'settings.allScreensProtected', false);

    return (
      <LoaderContainer
        className="user-groups-page settings-page"
        isLoading={isLoading}
        isOverlay={inProgress || isBusy(extension)}
      >
        <UserGroupsDashboard
          userGroups={userGroups}
          onUserGroupCreate={this.handleUserGroupCreate}
          onUserGroupDelete={this.props.deleteUserGroup}
          onUserGroupUpdate={this.props.updateUserGroup}
        />
        <UserGroupScreenSettings
          disabled={!allScreensProtected}
          shortcuts={shortcuts}
          userGroups={userGroups}
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
  loadUserGroups: PropTypes.func,
  createUserGroup: PropTypes.func,
  deleteUserGroup: PropTypes.func,
  updateUserGroup: PropTypes.func,
  updateShortcutSettings: PropTypes.func,
};

UserGroupsPage.contextTypes = {
  page: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    userGroups: getUserGroups(state),
    shortcuts: getShortcuts(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { appId, extensionName } = ownProps;
  const scope = { extensionName };

  return {
    loadUserGroups: () => (
      dispatch(loadUserGroups(appId, scope))
    ),
    createUserGroup: (name) => (
      dispatch(createUserGroup(appId, name, scope))
    ),
    deleteUserGroup: (groupId) => (
      dispatch(deleteUserGroup(appId, groupId, scope))
    ),
    updateUserGroup: (groupId, groupPatch) => (
      dispatch(updateUserGroup(appId, groupId, groupPatch, scope))
    ),
    fetchShortcuts: () => (
      dispatch(fetchShortcuts())
    ),
    updateShortcutSettings: (shortcut, settings) => (
      dispatch(updateShortcutSettings(shortcut, settings))
    ),
    fetchExtension: () => (
      dispatch(fetchExtension(extensionName))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserGroupsPage);
