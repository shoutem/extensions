import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import i18next from 'i18next';
import { ControlLabel, Dropdown, MenuItem } from 'react-bootstrap';
import LOCALIZATION from './localization';

export default class StartingScreen extends Component {
  constructor(props) {
    super(props);

    this.getStartingScreenDropdownTitle = this.getStartingScreenDropdownTitle.bind(
      this,
    );
    this.handleStartingScreenSelected = this.handleStartingScreenSelected.bind(
      this,
    );
  }

  handleStartingScreenSelected(shortcutKey) {
    const { onSettingsChanged } = this.props;
    if (!onSettingsChanged) {
      return;
    }

    const newSettings = {
      startingScreen: shortcutKey,
    };

    onSettingsChanged(newSettings);
  }

  getStartingScreenDropdownTitle(shortcutKey) {
    const { childShortcuts } = this.props;

    if (!shortcutKey) {
      return i18next.t(LOCALIZATION.STARTING_SCREEN_FIRST_SHORTCUT);
    }

    const shortcut = _.find(childShortcuts, { key: shortcutKey });
    if (!shortcut) {
      return i18next.t(LOCALIZATION.STARTING_SCREEN_FIRST_SHORTCUT);
    }

    const firstChildShortcutKey = _.get(childShortcuts, [0, 'key']);
    if (shortcut.key === firstChildShortcutKey) {
      return i18next.t(LOCALIZATION.STARTING_SCREEN_FIRST_SCREEN, {
        title: shortcut.title,
      });
    }

    return shortcut.title;
  }

  render() {
    const { settings, childShortcuts } = this.props;

    const firstChildShortcutKey = _.get(childShortcuts, [0, 'key']);
    const startingScreenKey = _.get(
      settings,
      ['startingScreen'],
      firstChildShortcutKey,
    );

    const dropdownTitle = this.getStartingScreenDropdownTitle(
      startingScreenKey,
    );
    const hasChildShortcuts = !_.isEmpty(childShortcuts);

    return (
      <div>
        <ControlLabel>
          {i18next.t(LOCALIZATION.FORM_STARTING_SCREEN)}
        </ControlLabel>
        {hasChildShortcuts && (
          <Dropdown
            onSelect={this.handleStartingScreenSelected}
            className="block"
          >
            <Dropdown.Toggle>{dropdownTitle}</Dropdown.Toggle>
            <Dropdown.Menu>
              {childShortcuts.map(shortcut => (
                <MenuItem key={shortcut.key} eventKey={shortcut.key}>
                  {shortcut.title}
                </MenuItem>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
        {!hasChildShortcuts && (
          <Dropdown disabled className="block">
            <Dropdown.Toggle>
              {i18next.t(LOCALIZATION.TOGGLE_ADD_SCREENS)}
            </Dropdown.Toggle>
            <Dropdown.Menu />
          </Dropdown>
        )}
      </div>
    );
  }
}

StartingScreen.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
  childShortcuts: PropTypes.array.isRequired,
};
