import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { Table } from 'src/components';
import VisibleGroupRow from '../visible-group-row';
import LOCALIZATION from './localization';
import './style.scss';

function getColumnHeader() {
  return [
    {
      id: 'name',
      value: i18next.t(LOCALIZATION.HEADER_NAME_TITLE),
      helpText: i18next.t(LOCALIZATION.HELP_TEXT),
    },
  ];
}

export default class VisibleGroupsTable extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  renderVisibleGroupRow(group) {
    const { onGroupVisibilityUpdate, shortcut } = this.props;

    return (
      <VisibleGroupRow
        shortcut={shortcut}
        key={group.id}
        group={group}
        onGroupVisibilityUpdate={onGroupVisibilityUpdate}
      />
    );
  }

  render() {
    const { isIgnored, userGroups } = this.props;

    return (
      <div>
        <Table
          className={isIgnored ? 'ignored' : ''}
          emptyPlaceholderText={i18next.t(
            LOCALIZATION.EMPTY_PLACEHOLDER_MESSAGE,
          )}
          columnHeaders={getColumnHeader()}
          renderItem={this.renderVisibleGroupRow}
          items={userGroups}
        />
      </div>
    );
  }
}

VisibleGroupsTable.propTypes = {
  isIgnored: PropTypes.bool,
  shortcut: PropTypes.object,
  userGroups: PropTypes.array,
  onGroupVisibilityUpdate: PropTypes.func.isRequired,
};
