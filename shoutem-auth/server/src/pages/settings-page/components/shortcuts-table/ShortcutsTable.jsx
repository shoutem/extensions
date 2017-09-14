import React, { PropTypes } from 'react';
import _ from 'lodash';
import ShortcutTableRow from '../shortcut-table-row';
import './style.scss';

function renderEmptyTableRow() {
  return (
    <tr className="shortcuts-table__empty-row">
      <td>0 screens defined.</td>
    </tr>
  );
}

export default function ShortcutsTable({ shortcutTree, onShortcutSettingsUpdate }) {
  const hasData = !_.isEmpty(shortcutTree);

  return (
    <table className="shortcuts-table table">
      <thead>
        <tr><th>Navigation item</th></tr>
      </thead>
      <tbody>
        {!hasData && renderEmptyTableRow()}
        {hasData && (
          _.map(shortcutTree, ({ shortcut, level }) => (
            <ShortcutTableRow
              key={shortcut.id}
              shortcut={shortcut}
              level={level}
              onShortcutSettingsUpdate={onShortcutSettingsUpdate}
            />
          ))
        )}
      </tbody>
    </table>
  );
}

ShortcutsTable.propTypes = {
  shortcutTree: PropTypes.array,
  onShortcutSettingsUpdate: PropTypes.func,
  dataLoaded: PropTypes.bool,
};
