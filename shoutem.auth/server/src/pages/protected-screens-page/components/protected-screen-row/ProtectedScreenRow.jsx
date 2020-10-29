import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { Checkbox } from '@shoutem/react-web-ui';
import './style.scss';

function isShortcutProtected(shortcut) {
  return _.get(shortcut, 'settings.shoutemAuth.protected', false);
}

export default class ProtectedScreenRow extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleShortcutSelected(event) {
    event.preventDefault();

    const { shortcut, onShortcutSettingsUpdate } = this.props;
    const isProtected = isShortcutProtected(shortcut);

    const settingsPatch = {
      shoutemAuth: {
        protected: !isProtected,
      },
    };

    onShortcutSettingsUpdate(shortcut, settingsPatch);
  }

  render() {
    const { shortcut, level } = this.props;

    const isProtected = isShortcutProtected(shortcut);
    const indentation = level * 32 + 8;
    const indentationStyle = {
      paddingLeft: `${indentation}px`,
    };

    return (
      <tr
        className="protected-screen-row"
        onClick={this.handleShortcutSelected}
      >
        <td style={indentationStyle}>
          <Checkbox checked={isProtected}>{shortcut.title}</Checkbox>
        </td>
      </tr>
    );
  }
}

ProtectedScreenRow.propTypes = {
  shortcut: PropTypes.object,
  level: PropTypes.number,
  onShortcutSettingsUpdate: PropTypes.func,
};
