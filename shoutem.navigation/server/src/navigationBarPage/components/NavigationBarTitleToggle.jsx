import React, { Component } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Dropdown, MenuItem } from 'react-bootstrap';
import i18next from 'i18next';
import LOCALIZATION from './localization';

const SHOW_TITLE_OPTION = 1;
const HIDE_TITLE_OPTION = 0;

const isTitleVisible = selectedValue => selectedValue === SHOW_TITLE_OPTION;

const resolveTitleMenuLabel = showTitle => {
  if (showTitle) {
    return i18next.t(LOCALIZATION.SHOW_TITLE_LABEL);
  }
  return i18next.t(LOCALIZATION.HIDE_TITLE_LABEL);
};

export default class NavigationBarTitleToggle extends Component {
  static propTypes = {
    showTitle: PropTypes.bool,
    onTitleToggle: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleTitleToggle(selectedValue) {
    const { onTitleToggle } = this.props;
    onTitleToggle(isTitleVisible(selectedValue));
  }

  render() {
    const { showTitle, onTitleToggle } = this.props;

    return (
      <FormGroup className="navigation-bar-page-title">
        <ControlLabel>
          {i18next.t(LOCALIZATION.FORM_NAVIGATION_TITLE)}
        </ControlLabel>
        <Dropdown
          onSelect={selectedValue =>
            onTitleToggle(isTitleVisible(selectedValue))
          }
          className="block"
        >
          <Dropdown.Toggle>{resolveTitleMenuLabel(showTitle)}</Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem key={SHOW_TITLE_OPTION} eventKey={SHOW_TITLE_OPTION}>
              {i18next.t(LOCALIZATION.SHOW_TITLE_LABEL)}
            </MenuItem>
            <MenuItem key={HIDE_TITLE_OPTION} eventKey={HIDE_TITLE_OPTION}>
              {i18next.t(LOCALIZATION.HIDE_TITLE_LABEL)}
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </FormGroup>
    );
  }
}
