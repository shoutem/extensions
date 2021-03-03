import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Checkbox } from '@shoutem/react-web-ui';
import { isGroupVisible } from 'src/services';
import './style.scss';

export default class VisibleGroupRow extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    const userGroups = _.get(props, 'shortcut.settings.userGroups');
    const groupId = _.get(props, 'group.id');

    this.state = {
      isVisible: isGroupVisible(userGroups, groupId),
    };
  }

  setVisibility(isVisible) {
    this.setState({ isVisible });
  }

  handleGroupSelected(event) {
    event.preventDefault();

    const { group, shortcut, onGroupVisibilityUpdate } = this.props;
    const { isVisible } = this.state;

    const userGroups = _.get(shortcut, 'settings.userGroups', []);
    const resolvedUserGroups = userGroups.map(userGroup => {
      if (userGroup.id === group.id) {
        userGroup.visible = !isVisible;
        return userGroup;
      }

      return userGroup;
    });

    onGroupVisibilityUpdate(shortcut, { userGroups: resolvedUserGroups });
    this.setVisibility(!isVisible);
  }

  render() {
    const { group } = this.props;
    const { isVisible } = this.state;

    return (
      <tr className="visible-group-row" onClick={this.handleGroupSelected}>
        <td>
          <Checkbox readOnly checked={isVisible}>
            {group.name}
          </Checkbox>
        </td>
      </tr>
    );
  }
}

VisibleGroupRow.propTypes = {
  group: PropTypes.object,
  onGroupVisibilityUpdate: PropTypes.func,
  shortcut: PropTypes.object,
};
