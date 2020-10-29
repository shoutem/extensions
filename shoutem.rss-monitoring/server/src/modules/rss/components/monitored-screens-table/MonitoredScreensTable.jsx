import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import autoBindReact from 'auto-bind/react';
import { EditableTable } from '@shoutem/react-web-ui';
import { buildShortcutTree } from 'src/services';
import { MonitoredScreenRow } from '../monitored-screen-row';
import LOCALIZATION from './localization';
import './style.scss';

function getHeaders() {
  return [i18next.t(LOCALIZATION.TABLE_HEADER_SCREEN)];
}

export default class MonitoredScreensTable extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      shortcutTree: [],
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  getRowDescriptors() {
    const screenDescriptor = {
      getDisplayValue: this.renderScreenValue,
      isRequired: false,
    };

    return [screenDescriptor];
  }

  checkData(nextProps, props = {}) {
    const { shortcuts } = props;
    const { shortcuts: nextShortcuts } = nextProps;

    if (nextShortcuts !== shortcuts) {
      this.setState({
        shortcutTree: buildShortcutTree(nextShortcuts),
      });
    }
  }

  renderScreenValue(shortcutTreeItem) {
    const { extensionName, onShortcutSettingsUpdate } = this.props;
    const { shortcut, level } = shortcutTreeItem;

    return (
      <MonitoredScreenRow
        key={shortcut.id}
        level={level}
        extensionName={extensionName}
        onShortcutSettingsUpdate={onShortcutSettingsUpdate}
        shortcut={shortcut}
      />
    );
  }

  render() {
    const { shortcutTree } = this.state;

    return (
      <div className="monitored-screens-table">
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
        <EditableTable
          canDelete={false}
          canUpdate={false}
          className="monitored-screens-table"
          emptyStateText={i18next.t(LOCALIZATION.TABLE_EMPTY_TEXT)}
          headers={getHeaders()}
          isStatic
          rowDescriptors={this.getRowDescriptors()}
          rows={shortcutTree}
        />
      </div>
    );
  }
}

MonitoredScreensTable.propTypes = {
  shortcuts: PropTypes.array,
  extensionName: PropTypes.object.isRequired,
  onShortcutSettingsUpdate: PropTypes.func.isRequired,
};
