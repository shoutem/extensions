import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { Alert } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import { Trans } from 'react-i18next';
import { Table } from 'src/components';
import { buildShortcutTree } from 'src/services';
import UserGroupScreenVisibilityRow from '../user-group-screen-visibility-row';
import LOCALIZATION from './localization';
import './style.scss';

function getColumnHeaders() {
  return [
    { id: 'name', value: i18next.t(LOCALIZATION.HEADER_SCREEN_TITLE) },
    { id: 'group', value: i18next.t(LOCALIZATION.HEADER_VISIBLTE_TO_TITLE) },
  ];
}

export default class UserGroupScreenSettings extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      shortcutTree: buildShortcutTree(props.shortcuts),
    };
  }

  componentDidUpdate(prevProps) {
    const { shortcuts } = prevProps;
    const { shortcuts: nextShortcuts } = this.props;

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

    const tableClasses = classNames('user-group-screen-settings__table', {
      'is-disabled': disabled,
    });

    return (
      <div className="user-group-screen-settings">
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
        <Alert className="user-group-screen-settings__alert">
          <div>
            <Trans i18nKey={LOCALIZATION.SCREEN_VISIBILITY_HELP_MESSAGE}>
              Hiding screens option is available only when
              <i>Make all screens private </i>
              option is enabled under <i>Protected Screens</i>.
            </Trans>
          </div>
        </Alert>
        <Table
          className={tableClasses}
          emptyPlaceholderText="0 screens defined."
          columnHeaders={getColumnHeaders()}
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
