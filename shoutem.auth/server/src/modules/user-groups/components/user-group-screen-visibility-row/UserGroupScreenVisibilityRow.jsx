import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { IconLabel } from '@shoutem/react-web-ui';
import { USER_GROUPS, UserGroupsDropdown } from 'src/modules/user-groups';
import './style.scss';

export default class UserGroupScreenVisibilityRow extends Component {
  constructor(props) {
    super(props);

    this.handleScreenVisibilityUpdated = this.handleScreenVisibilityUpdated.bind(this);
  }

  handleScreenVisibilityUpdated(visibleGroupIds) {
    const { shortcut, onScreenVisibilityUpdated } = this.props;

    const settingsPatch = {
      shoutemAuth: {
        userGroups: _.map(visibleGroupIds, groupId => ({
          id: groupId,
          type: USER_GROUPS,
        })),
      },
    };

    onScreenVisibilityUpdated(shortcut, settingsPatch);
  }

  render() {
    const { shortcut, level, userGroups, disabled } = this.props;
    const {
      shortcutType,
      title,
      settings,
    } = shortcut;

    const shortcutIcon = shortcutType === 'navigation' ? 'folder' : 'screen';
    const visibleGroups = _.get(settings, 'shoutemAuth.userGroups', []);
    const visibleGroupIds = _.map(visibleGroups, 'id');

    const indentation = (level * 32) + 8;
    const indentationStyle = {
      paddingLeft: `${indentation}px`,
    };

    return (
      <tr className="user-group-screen-visibility-row">
        <td style={indentationStyle}>
          <IconLabel iconName={shortcutIcon}>
            {title}
          </IconLabel>
        </td>
        <td>
          <UserGroupsDropdown
            disabled={disabled}
            emptyText="All signed in users"
            onSelectionChanged={this.handleScreenVisibilityUpdated}
            showSelectNoneOption
            selectedUserGroupIds={visibleGroupIds}
            userGroups={userGroups}
          />
        </td>
      </tr>
    );
  }
}

UserGroupScreenVisibilityRow.propTypes = {
  shortcut: PropTypes.object,
  level: PropTypes.number,
  userGroups: PropTypes.array,
  onScreenVisibilityUpdated: PropTypes.func,
  disabled: PropTypes.bool,
};
