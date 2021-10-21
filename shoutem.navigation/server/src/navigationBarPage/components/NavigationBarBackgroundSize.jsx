import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Dropdown, MenuItem } from 'react-bootstrap';
import i18next from 'i18next';
import LOCALIZATION from './localization';
import autoBindReact from 'auto-bind/react';

const ORIGINAL_SIZE_OPTION = 0;
const FIT_CONTAINER_OPTION = 1;

const shouldBackgroundImageFitContainer = selectedValue =>
  selectedValue === FIT_CONTAINER_OPTION;

const resolveBackgroundSizeMenuLabel = fitContainer => {
  if (fitContainer) {
    return i18next.t(LOCALIZATION.FIT_CONTAINER_LABEL);
  }
  return i18next.t(LOCALIZATION.ORIGINAL_SIZE_LABEL);
};

export default class NavigationBarBackgroundSize extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  /**
   * Handle background size toggle
   * @param {void} selectedValue
   */
  handleBackgroundSizeToggle(selectedValue = null) {
    const { onBackgroundSizeToggle } = this.props;
    onBackgroundSizeToggle(shouldBackgroundImageFitContainer(selectedValue));
  }

  render() {
    const { fitContainer } = this.props;

    return (
      <FormGroup className="navigation-bar-page-background-size">
        <ControlLabel>
          {i18next.t(LOCALIZATION.FORM_BACKGROUND_SIZE)}
        </ControlLabel>
        <Dropdown className="block" onSelect={this.handleBackgroundSizeToggle}>
          <Dropdown.Toggle>
            {resolveBackgroundSizeMenuLabel(fitContainer)}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem
              key={ORIGINAL_SIZE_OPTION}
              eventKey={ORIGINAL_SIZE_OPTION}
            >
              {i18next.t(LOCALIZATION.ORIGINAL_SIZE_LABEL)}
            </MenuItem>
            <MenuItem
              key={FIT_CONTAINER_OPTION}
              eventKey={FIT_CONTAINER_OPTION}
            >
              {i18next.t(LOCALIZATION.FIT_CONTAINER_LABEL)}
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </FormGroup>
    );
  }
}

NavigationBarBackgroundSize.propTypes = {
  fitContainer: PropTypes.bool,
  onBackgroundSizeToggle: PropTypes.func,
};
