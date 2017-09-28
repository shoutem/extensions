import React, { Component, PropTypes } from 'react';
import ShortcutsTable from '../shortcuts-table/index';
import {
  areAllScreensProtected,
  buildShortcutTree,
} from '../../services';

export default class ProtectedScreenSettings extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { shortcuts, extensionSettings } = props;
    const {
      shortcuts: nextShortcuts,
      extensionSettings: nextExtensionSettings,
    } = nextProps;

    if (nextShortcuts !== shortcuts) {
      this.setState({
        shortcutTree: buildShortcutTree(nextShortcuts),
      })
    }

    if(nextExtensionSettings !== extensionSettings) {
      this.setState({
        allScreensProtected: areAllScreensProtected(nextExtensionSettings, extensionSettings),
      });
    }
  }

  render() {
    const { onShortcutSettingsUpdate } = this.props;
    const { shortcutTree, allScreensProtected } = this.state;

    // when all screens are protected, no need to render tree for protecting individual screens
    if (allScreensProtected) {
      return null;
    }

    return (
      <div>
        <h3>Select screens that require sign in</h3>
        <ShortcutsTable
          shortcutTree={shortcutTree}
          onShortcutSettingsUpdate={onShortcutSettingsUpdate}
        />
      </div>
    );
  }
}

ProtectedScreenSettings.propTypes = {
  shortcuts: PropTypes.array,
  extensionSettings: PropTypes.object,
  onShortcutSettingsUpdate: PropTypes.func.isRequired,
};
