import PropTypes from 'prop-types';
import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { Table } from 'src/components';
import { buildShortcutTree } from 'src/services';
import { RestrictedScreenRow } from '../restricted-screen-row';
import LOCALIZATION from './localization';
import './style.scss';

function getColumnHeader() {
  return [
    {
      id: 'name',
      value: i18next.t(LOCALIZATION.RESTRICTED_SCREENS_TABLE_HEADER_NAME),
    },
  ];
}

export default class RestrictedScreensTable extends Component {
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

  renderRestrictedScreenRow(shortcutTreeItem) {
    const { onShortcutSettingsUpdate } = this.props;
    const { shortcut, level } = shortcutTreeItem;

    return (
      <RestrictedScreenRow
        key={shortcut.id}
        shortcut={shortcut}
        level={level}
        onShortcutSettingsUpdate={onShortcutSettingsUpdate}
      />
    );
  }

  render() {
    const { shortcutTree } = this.state;

    return (
      <div className="restricted-screens-table">
        <h3>{i18next.t(LOCALIZATION.RESTRICTED_SCREENS_TABLE_TITLE)}</h3>
        <Table
          className="restricted-screens-table__table"
          emptyPlaceholderText={i18next.t(
            LOCALIZATION.EMPTY_PLACEHOLDER_MESSAGE,
          )}
          columnHeaders={getColumnHeader()}
          renderItem={this.renderRestrictedScreenRow}
          items={shortcutTree}
        />
      </div>
    );
  }
}

RestrictedScreensTable.propTypes = {
  shortcuts: PropTypes.array,
  onShortcutSettingsUpdate: PropTypes.func.isRequired,
};
