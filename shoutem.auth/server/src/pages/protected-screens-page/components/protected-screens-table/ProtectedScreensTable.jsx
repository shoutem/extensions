import React, { Component, PropTypes } from 'react';
import { Table } from 'src/components';
import { buildShortcutTree } from 'src/services';
import ProtectedScreenRow from '../protected-screen-row';
import './style.scss';

const PROTECTED_SCREENS_COLUMNS = [
  { id: 'name', value: 'Screen' },
];

export default class ProtectedScreensTable extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.renderProtectedScreenRow = this.renderProtectedScreenRow.bind(this);
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
    const { onShortcutSettingsUpdate } = this.props;
    const { shortcut, level } = shortcutTreeItem;

    return (
      <ProtectedScreenRow
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
      <div className="protected-screens-table">
        <h3>Select screens that require sign in</h3>
        <Table
          className="protected-screens-table__table"
          emptyPlaceholderText="0 screens defined."
          columnHeaders={PROTECTED_SCREENS_COLUMNS}
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
};
