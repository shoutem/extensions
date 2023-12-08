import React, { PureComponent } from 'react';
import { ControlLabel, Dropdown, FormGroup, MenuItem } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { FontIcon, FontIconPopover } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';

const UPPERCASE_TITLE_OPTION = 1;
const DISABLE_UPPERCASE_OPTION = 0;

const isTitleUppercased = selectedValue =>
  selectedValue === UPPERCASE_TITLE_OPTION;

const resolveUppercaseMenuLabel = showTitle => {
  if (showTitle) {
    return i18next.t(LOCALIZATION.UPPERCASE_LABEL);
  }
  return i18next.t(LOCALIZATION.DISABLE_UPPERCASE_LABEL);
};

export default class NavigationBarUppercaseTitleToggle extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleUppercaseToggle(selectedValue) {
    const { onUppercaseToggle } = this.props;
    onUppercaseToggle(isTitleUppercased(selectedValue));
  }

  render() {
    const { uppercaseTitle, onUppercaseToggle } = this.props;

    return (
      <FormGroup className="navigation-bar-page-title">
        <ControlLabel>
          {i18next.t(LOCALIZATION.FORM_NAVIGATION_TITLE_UPPERCASING)}
        </ControlLabel>
        <FontIconPopover
          message={i18next.t(LOCALIZATION.UPPERCASED_TRANSLATIONS_INFO)}
        >
          <FontIcon className="icon-popover" name="info" size="24px" />
        </FontIconPopover>
        <Dropdown
          onSelect={value => onUppercaseToggle(isTitleUppercased(value))}
          className="block"
        >
          <Dropdown.Toggle>
            {resolveUppercaseMenuLabel(uppercaseTitle)}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem
              key={UPPERCASE_TITLE_OPTION}
              eventKey={UPPERCASE_TITLE_OPTION}
            >
              {i18next.t(LOCALIZATION.UPPERCASE_LABEL)}
            </MenuItem>
            <MenuItem
              key={DISABLE_UPPERCASE_OPTION}
              eventKey={DISABLE_UPPERCASE_OPTION}
            >
              {i18next.t(LOCALIZATION.DISABLE_UPPERCASE_LABEL)}
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </FormGroup>
    );
  }
}

NavigationBarUppercaseTitleToggle.propTypes = {
  uppercaseTitle: PropTypes.bool.isRequired,
  onUppercaseToggle: PropTypes.func.isRequired,
};
