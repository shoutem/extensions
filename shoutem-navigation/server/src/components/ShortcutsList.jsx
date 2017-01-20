import React from 'react';
import { ControlLabel } from 'react-bootstrap';
import classNames from 'classnames';

export default function ShortcutsList({ shortcuts, headerTitles, getListItem, className }) {
  const tableClassNames = classNames(
    className,
    'navigation__table',
  );

  return (
    <div>
      <table className={tableClassNames}>
        <thead>
          <tr>
            {headerTitles.map(title => (
              <th><ControlLabel>{title}</ControlLabel></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shortcuts.map(getListItem)}
        </tbody>
      </table>
    </div>
  );
}
