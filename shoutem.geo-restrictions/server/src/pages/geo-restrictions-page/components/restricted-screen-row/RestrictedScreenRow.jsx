import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { Checkbox } from '@shoutem/react-web-ui';
import './style.scss';

function isShortcutRestricted(shortcut) {
  return _.get(shortcut, 'settings.shoutemGeoRestrictions.restricted', false);
}

export default class RestrictedScreenRow extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleShortcutSelected(event) {
    event.preventDefault();

    const { shortcut, onShortcutSettingsUpdate } = this.props;
    const isRestricted = isShortcutRestricted(shortcut);

    const settingsPatch = {
      shoutemGeoRestrictions: {
        restricted: !isRestricted,
      },
    };

    onShortcutSettingsUpdate(shortcut, settingsPatch);
  }

  render() {
    const { shortcut, level } = this.props;

    const isRestricted = isShortcutRestricted(shortcut);
    const indentation = level * 32 + 8;
    const indentationStyle = {
      paddingLeft: `${indentation}px`,
    };

    return (
      <tr
        className="restricted-screen-row"
        onClick={this.handleShortcutSelected}
      >
        <td style={indentationStyle}>
          <Checkbox checked={isRestricted}>{shortcut.title}</Checkbox>
        </td>
      </tr>
    );
  }
}

RestrictedScreenRow.propTypes = {
  shortcut: PropTypes.object,
  level: PropTypes.number,
  onShortcutSettingsUpdate: PropTypes.func,
};
