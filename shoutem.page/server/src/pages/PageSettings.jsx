import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import _ from 'lodash';
import { ControlLabel, Dropdown, MenuItem } from 'react-bootstrap';
import { getShortcut } from 'environment';
import { updateShortcutSettings } from '../reducer';
import LOCALIZATION from './localization';

function getNavigationLayoutTypes() {
  return {
    iconGrid: i18next.t(LOCALIZATION.LAYOUT_TYPE_ICON_GRID),
    list: i18next.t(LOCALIZATION.LAYOUT_TYPE_LIST),
  };
}

export class PageSettings extends Component {
  constructor(props) {
    super(props);

    this.navigationLayoutTypes = getNavigationLayoutTypes();

    this.getShortcutSettings = this.getShortcutSettings.bind(this);
    this.handleLayoutOptionSelected = this.handleLayoutOptionSelected.bind(
      this,
    );
  }

  getShortcutSettings() {
    const { shortcut } = this.props;

    if (!_.get(shortcut, 'settings.navigationLayoutType')) {
      return { navigationLayoutType: 'iconGrid' };
    }

    return shortcut.settings;
  }

  handleLayoutOptionSelected(event) {
    const {
      shortcut: { id, settings },
      updateShortcutSettings,
    } = this.props;

    updateShortcutSettings(id, { ...settings, navigationLayoutType: event });
  }

  render() {
    const { navigationLayoutType } = this.getShortcutSettings();

    return (
      <div className="page-settings">
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
        <ControlLabel>
          {i18next.t(LOCALIZATION.FORM_CHOOSE_LAYOUT)}
        </ControlLabel>
        <Dropdown className="block" onSelect={this.handleLayoutOptionSelected}>
          <Dropdown.Toggle>
            {this.navigationLayoutTypes[navigationLayoutType]}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {_.keys(this.navigationLayoutTypes).map(key => (
              <MenuItem key={key} eventKey={key}>
                {this.navigationLayoutTypes[key]}
              </MenuItem>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

const { func, shape, string } = PropTypes;

PageSettings.propTypes = {
  shortcut: shape({
    navigationLayoutType: string,
  }),
  updateShortcutSettings: func,
};

const mapStateToProps = () => ({
  shortcut: getShortcut(),
});

function mapDispatchToProps(dispatch) {
  return {
    updateShortcutSettings: (id, settings) =>
      dispatch(updateShortcutSettings(id, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageSettings);
