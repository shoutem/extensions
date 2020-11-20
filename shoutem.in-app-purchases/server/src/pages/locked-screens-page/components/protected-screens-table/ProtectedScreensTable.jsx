import PropTypes from 'prop-types';
import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { Table } from 'src/components';
import { buildShortcutTree } from 'src/services';
import { ProtectedScreenRow } from '../protected-screen-row';
import LOCALIZATION from './localization';
import './style.scss';

function getColumnHeader() {
  return [{ id: 'name', value: i18next.t(LOCALIZATION.HEADER_NAME_TITLE) }];
}

export default class ProtectedScreensTable extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
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

  renderProtectedScreenRow(shortcutTreeItem) {
    const { onShortcutSettingsUpdate, allScreensProtected } = this.props;
    const { shortcut, level } = shortcutTreeItem;

    return (
      <ProtectedScreenRow
        key={shortcut.id}
        shortcut={shortcut}
        level={level}
        onShortcutSettingsUpdate={onShortcutSettingsUpdate}
        disabled={allScreensProtected}
      />
    );
  }

  render() {
    const { shortcutTree } = this.state;

    return (
      <div className="protected-screens-table">
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
        <Table
          className="protected-screens-table__table"
          emptyPlaceholderText={i18next.t(
            LOCALIZATION.EMPTY_PLACEHOLDER_MESSAGE,
          )}
          columnHeaders={getColumnHeader()}
          renderItem={this.renderProtectedScreenRow}
          items={shortcutTree}
        />
      </div>
    );
  }
}

ProtectedScreensTable.propTypes = {
  shortcuts: PropTypes.array,
  onShortcutSettingsUpdate: PropTypes.func.isRequired,
  allScreensProtected: PropTypes.bool,
};
