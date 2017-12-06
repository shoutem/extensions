import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Alert } from 'react-bootstrap';
import { Table } from 'src/components';
import { buildShortcutTree } from 'src/services';
import UserGroupScreenVisibilityRow from '../user-group-screen-visibility-row';
import './style.scss';

const SHORTCUT_COLUMN_HEADERS = [
  { id: 'name', value: 'Screen' },
  { id: 'group', value: 'Visible to' },
];

// eslint-disable-next-line max-len
const SCREEN_VISIBILITY_HELP_TEXT = (
  <div>
    Hiding screens option is available only when <i>Make all screens private </i>
    option is enabled under <i>Protected Screens</i>.
  </div>
);

export default class UserGroupScreenSettings extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.renderShortcutVisibilityRow = this.renderShortcutVisibilityRow.bind(this);
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

  renderShortcutVisibilityRow(shortcutTreeItem) {
    const { userGroups, disabled, onScreenVisibilityUpdate } = this.props;
    const { shortcut, level } = shortcutTreeItem;

    return (
      <UserGroupScreenVisibilityRow
        disabled={disabled}
        key={shortcut.key}
        level={level}
        onScreenVisibilityUpdated={onScreenVisibilityUpdate}
        shortcut={shortcut}
        userGroups={userGroups}
      />
    );
  }

  render() {
    const { disabled } = this.props;
    const { shortcutTree } = this.state;

    const tableClasses = classNames(
      'user-group-screen-settings__table',
      { 'is-disabled': disabled }
    );

    return (
      <div className="user-group-screen-settings">
        <h3>Screen visibility</h3>
        <Alert className="user-group-screen-settings__alert">
          {SCREEN_VISIBILITY_HELP_TEXT}
        </Alert>
        <Table
          className={tableClasses}
          emptyPlaceholderText="0 screens defined."
          columnHeaders={SHORTCUT_COLUMN_HEADERS}
          renderItem={this.renderShortcutVisibilityRow}
          items={shortcutTree}
        />
      </div>
    );
  }
}

UserGroupScreenSettings.propTypes = {
  shortcuts: PropTypes.array,
  userGroups: PropTypes.array,
  onScreenVisibilityUpdate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
