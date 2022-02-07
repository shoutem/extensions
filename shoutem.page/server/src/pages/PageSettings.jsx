import React, { PureComponent } from 'react';
import { ControlLabel, Dropdown, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import { getShortcut } from 'environment';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { updateShortcutSettings } from '../redux';
import LOCALIZATION from './localization';

function getNavigationLayoutTypes() {
  return {
    iconGrid: i18next.t(LOCALIZATION.LAYOUT_TYPE_ICON_GRID),
    list: i18next.t(LOCALIZATION.LAYOUT_TYPE_LIST),
  };
}

export class PageSettings extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.navigationLayoutTypes = getNavigationLayoutTypes();
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

PageSettings.propTypes = {
  shortcut: PropTypes.shape({
    id: PropTypes.string,
    navigationLayoutType: PropTypes.string,
    settings: PropTypes.object,
  }).isRequired,
  updateShortcutSettings: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {
    shortcut: getShortcut(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateShortcutSettings: (id, settings) =>
      dispatch(updateShortcutSettings(id, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageSettings);
