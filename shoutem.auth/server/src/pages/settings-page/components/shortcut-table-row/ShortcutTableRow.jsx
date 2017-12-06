import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { Checkbox } from '@shoutem/react-web-ui';
import './style.scss';

function isShortcutProtected(shortcut) {
  return _.get(shortcut, 'settings.shoutemAuth.protected', false);
}

export default class ShortcutTableRow extends Component {
  constructor(props) {
    super(props);

    this.handleShortcutSelected = this.handleShortcutSelected.bind(this);
  }

  handleShortcutSelected() {
    const { shortcut, onShortcutSettingsUpdate } = this.props;
    const isProtected = isShortcutProtected(shortcut);

    const settingsPatch = {
      shoutemAuth: {
        protected: !isProtected,
      }
    };

    onShortcutSettingsUpdate(shortcut, settingsPatch);
  }

  render() {
    const { shortcut, level } = this.props;

    const isProtected = isShortcutProtected(shortcut);
    const indentationStyle = {
      paddingLeft: (level * 32) + 'px'
    };

    return (
      <tr
        className="shortcut-table-row"
        onClick={this.handleShortcutSelected}
      >
        <td style={indentationStyle}>
          <Checkbox checked={isProtected}>
            {shortcut.title}
          </Checkbox>
        </td>
      </tr>
    );
  }
}

ShortcutTableRow.propTypes = {
  shortcut: PropTypes.object,
  level: PropTypes.number,
  onShortcutSettingsUpdate: PropTypes.func,
};
