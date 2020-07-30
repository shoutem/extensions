import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { Checkbox } from '@shoutem/react-web-ui';
import { CAPABILITY_RSS_FEED } from '../../const';
import './style.scss';

export default class MonitoredScreenRow extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  resolveExtensionPath() {
    const { extensionName } = this.props;
    const path = _.camelCase(extensionName);

    return path;
  }

  isShortcutMonitored(shortcut) {
    const extensionPath = this.resolveExtensionPath();
    const settingsPath = `settings.${extensionPath}.monitored`;

    return _.get(shortcut, settingsPath, false);
  }

  isShortcutDisabled(shortcut) {
    const capabilities = _.get(shortcut, 'capabilities');
    return !_.includes(capabilities, CAPABILITY_RSS_FEED);
  }

  handleShortcutSelected(event) {
    event.preventDefault();

    const { shortcut, onShortcutSettingsUpdate } = this.props;

    const isDisabled = this.isShortcutDisabled(shortcut);
    if (isDisabled) {
      return;
    }

    const isMonitored = this.isShortcutMonitored(shortcut);
    const extensionPath = this.resolveExtensionPath();

    const settingsPatch = {
      [extensionPath]: {
        monitored: !isMonitored,
      },
    };

    onShortcutSettingsUpdate(shortcut, settingsPatch);
  }

  render() {
    const { shortcut, level } = this.props;

    const isMonitored = this.isShortcutMonitored(shortcut);
    const isDisabled = this.isShortcutDisabled(shortcut);

    const indentation = level * 32 + 8;
    const indentationStyle = {
      paddingLeft: `${indentation}px`,
    };

    const classes = classNames('monitored-screen-row', {
      'monitored-screen-row-active': !isDisabled,
    });

    return (
      <div
        className={classes}
        onClick={this.handleShortcutSelected}
        style={indentationStyle}
      >
        <Checkbox checked={isMonitored} disabled={isDisabled}>
          {shortcut.title}
        </Checkbox>
      </div>
    );
  }
}

MonitoredScreenRow.propTypes = {
  shortcut: PropTypes.object,
  level: PropTypes.number,
  extensionName: PropTypes.object.isRequired,
  onShortcutSettingsUpdate: PropTypes.func,
};
