import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Checkbox, FontIcon } from '@shoutem/react-web-ui';
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

  handleShortcutSettingsPress(event) {
    event.stopPropagation();
    const { shortcut, onShortcutSettingsPress } = this.props;

    onShortcutSettingsPress(shortcut);
  }

  render() {
    const { shortcut, level, disabled, settingsModalEnabled } = this.props;

    const isProtected = isShortcutProtected(shortcut);
    const indentation = level * 32 + 8;
    const indentationStyle = {
      paddingLeft: `${indentation}px`,
      position: 'relative',
    };
    const className = !disabled
      ? 'protected-screen-row'
      : 'protected-screen-row-disabled';

    return (
      <tr className={className} onClick={this.handleShortcutSelected}>
        <td style={indentationStyle}>
          <Checkbox checked={isProtected}>{shortcut.title}</Checkbox>
          {settingsModalEnabled && (
            <div
              className="protected-row-settings-button"
              onClick={this.handleShortcutSettingsPress}
              aria-hidden="true"
            >
              <FontIcon name="more" size={20} />
            </div>
          )}
        </td>
      </tr>
    );
  }
}

ProtectedScreenRow.propTypes = {
  disabled: PropTypes.bool.isRequired,
  level: PropTypes.number.isRequired,
  settingsModalEnabled: PropTypes.bool.isRequired,
  shortcut: PropTypes.object.isRequired,
  onShortcutSettingsPress: PropTypes.func.isRequired,
  onShortcutSettingsUpdate: PropTypes.func.isRequired,
};
