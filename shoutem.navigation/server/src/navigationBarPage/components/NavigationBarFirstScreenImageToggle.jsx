import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Dropdown, MenuItem } from 'react-bootstrap';
import { FontIcon, FontIconPopover } from '@shoutem/react-web-ui';
import i18next from 'i18next';
import '../style.scss';
import LOCALIZATION from './localization';

const BACKGROUND_IMAGE_ENABLED_FIRST_SCREEN_OPTION = 1;
const BACKGROUND_IMAGE_ALL_SCREENS_OPTION = 0;

const isBackgroundImageFirstScreenOnly = selectedValue =>
  selectedValue === BACKGROUND_IMAGE_ENABLED_FIRST_SCREEN_OPTION;

const resolveBackgroundMenuLabel = imageEnabledFirstScreen => {
  if (imageEnabledFirstScreen) {
    return i18next.t(LOCALIZATION.FIRST_SCREEN_LABEL);
  }
  return i18next.t(LOCALIZATION.ALL_SCREENS_LABEL);
};

export default class NavigationBarFirstScreenImageToggle extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  /**
   * Handle background image first screen option toggle
   * @param {void} selectedValue
   */
  handleBackgroundImageToggle(selectedValue) {
    const { onBackgroundImageToggle } = this.props;

    onBackgroundImageToggle(isBackgroundImageFirstScreenOnly(selectedValue));
  }

  render() {
    const { backgroundImageEnabledFirstScreen } = this.props;

    return (
      <FormGroup className="navigation-bar-page-first-screen-toggle">
        <ControlLabel>
          {i18next.t(LOCALIZATION.FORM_BACKGROUND_SETTINGS)}
        </ControlLabel>
        <FontIconPopover
          message={i18next.t(LOCALIZATION.FIRST_SCREEN_HELP_MESSAGE)}
        >
          <FontIcon className="icon-popover" name="info" size="24px" />
        </FontIconPopover>
        <Dropdown className="block" onSelect={this.handleBackgroundImageToggle}>
          <Dropdown.Toggle>
            {resolveBackgroundMenuLabel(backgroundImageEnabledFirstScreen)}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem
              key={BACKGROUND_IMAGE_ALL_SCREENS_OPTION}
              eventKey={BACKGROUND_IMAGE_ALL_SCREENS_OPTION}
            >
              {i18next.t(LOCALIZATION.ALL_SCREENS_LABEL)}
            </MenuItem>
            <MenuItem
              key={BACKGROUND_IMAGE_ENABLED_FIRST_SCREEN_OPTION}
              eventKey={BACKGROUND_IMAGE_ENABLED_FIRST_SCREEN_OPTION}
            >
              {i18next.t(LOCALIZATION.FIRST_SCREEN_LABEL)}
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </FormGroup>
    );
  }
}

NavigationBarFirstScreenImageToggle.propTypes = {
  backgroundImageEnabledFirstScreen: PropTypes.bool,
  onBackgroundImageToggle: PropTypes.func,
};
