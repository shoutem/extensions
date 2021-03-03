import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Checkbox } from '@shoutem/react-web-ui';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import { getAllUserGroups, loadAllUserGroups } from 'src/modules/user-groups';
import { isGroupVisible } from 'src/services';
import { VisibleGroupsTable } from './components';
import LOCALIZATION from './localization';

class UserGroupsVisibilityPage extends PureComponent {
  static propTypes = {
    shortcut: PropTypes.object,
    updateShortcutSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      showAllUsers: _.get(props, 'shortcut.settings.showAllUsers', true),
    };
  }

  componentDidMount() {
    const { loadAllUserGroups } = this.props;

    loadAllUserGroups();
  }

  componentDidUpdate(prevProps) {
    const {
      allUserGroups,
      shortcut,
      userGroups,
      updateShortcutSettings,
    } = this.props;
    const { allUserGroups: prevAllUserGroups } = prevProps;

    if (prevAllUserGroups !== allUserGroups) {
      const patchedUserGroups = [];
      allUserGroups.forEach(group => {
        const matchingGroup = _.find(userGroups, ['id', group.id]);
        if (matchingGroup) {
          patchedUserGroups.push(matchingGroup);
        } else {
          const adaptedGroup = {
            id: group.id,
            name: group.name,
            visible: false,
          };

          patchedUserGroups.push(adaptedGroup);
        }
      });

      if (!_.isEmpty(patchedUserGroups) && patchedUserGroups !== userGroups) {
        const settings = _.get(shortcut, 'settings');
        const newSettings = {
          ...settings,
          userGroups: patchedUserGroups,
        };
        updateShortcutSettings(shortcut, newSettings);
      }
    }
  }

  handleShowAllChange(event) {
    if (event.target) {
      const { shortcut, updateShortcutSettings } = this.props;

      const showAllUsers = event.target.checked;
      const settings = _.get(shortcut, 'settings');
      const newSettings = {
        ...settings,
        showAllUsers,
      }
      updateShortcutSettings(shortcut, newSettings);
      this.setState({ showAllUsers });
    }
  }

  render() {
    const {
      shortcut,
      updateShortcutSettings,
      userGroups,
    } = this.props;
    const { showAllUsers } = this.state;

    return (
      <div>
        <Checkbox
          checked={showAllUsers}
          onChange={this.handleShowAllChange}
        >
          {i18next.t(LOCALIZATION.SHOW_ALL)}
        </Checkbox>
        <VisibleGroupsTable
          isIgnored={showAllUsers}
          shortcut={shortcut}
          userGroups={userGroups}
          onGroupVisibilityUpdate={updateShortcutSettings}
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    allUserGroups: getAllUserGroups(state),
    userGroups: _.get(ownProps, 'shortcut.settings.userGroups'),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { appId } = ownProps;

  return {
    updateShortcutSettings: (shortcut, settings) =>
      dispatch(updateShortcutSettings(shortcut, settings)),
    loadAllUserGroups: () => dispatch(loadAllUserGroups(appId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserGroupsVisibilityPage);
