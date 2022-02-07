import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Checkbox } from '@shoutem/react-web-ui';
import './style.scss';

function isShortcutProtected(shortcut) {
  return _.get(shortcut, 'settings.shoutemInAppPurchases.protected', false);
}

export default class ProtectedScreenRow extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleShortcutSelected(event) {
    event.preventDefault();

    const { shortcut, onShortcutSettingsUpdate, disabled } = this.props;
    const isProtected = isShortcutProtected(shortcut);

    if (disabled) {
      return;
    }

    const settingsPatch = {
      shoutemInAppPurchases: {
        protected: !isProtected,
      },
    };

    onShortcutSettingsUpdate(shortcut, settingsPatch);
  }

  render() {
    const { shortcut, level, disabled } = this.props;

    const isProtected = isShortcutProtected(shortcut);
    const indentation = level * 32 + 8;
    const indentationStyle = {
      paddingLeft: `${indentation}px`,
    };
    const className = !disabled
      ? 'protected-screen-row'
      : 'protected-screen-row-disabled';

    return (
      <tr className={className} onClick={this.handleShortcutSelected}>
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
  disabled: PropTypes.bool,
};
