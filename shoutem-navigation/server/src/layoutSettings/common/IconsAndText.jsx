import React, { PropTypes } from 'react';
import { ControlLabel, Dropdown, MenuItem } from 'react-bootstrap';

const SHOW_TEXT = 1;
const SHOW_ICON = 2;
const SHOW_TEXT_AND_ICON = SHOW_TEXT | SHOW_ICON;

export default class IconsAndText extends React.Component {
  constructor(props) {
    super(props);
    this.onDisplayOptionsSelected = this.onDisplayOptionsSelected.bind(this);
  }

  onDisplayOptionsSelected(event) {
    const { onSettingsChanged } = this.props;
    const newSettings = {
      showText: (event & SHOW_TEXT) === SHOW_TEXT,
      showIcon: (event & SHOW_ICON) === SHOW_ICON,
    };
    onSettingsChanged(newSettings);
  }

  getDisplayOptionsText(showText, showIcon) {
    if(showText && showIcon) return 'Show text and icons';
    if(showText) return 'Show text only';
    if(showIcon) return 'Show icons only';
    return '';
  }

  render() {
    const { settings } = this.props;
    const showIcon = _.get(settings, ['showIcon'], true);
    const showText = _.get(settings, ['showText'], true);

    return (
      <div>
        <ControlLabel>Icons and text</ControlLabel>
        <Dropdown onSelect={this.onDisplayOptionsSelected} className="block">
          <Dropdown.Toggle>
            {this.getDisplayOptionsText(showText, showIcon)}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem key={SHOW_TEXT} eventKey={SHOW_TEXT}>{this.getDisplayOptionsText(true, false)}</MenuItem>
            <MenuItem key={SHOW_ICON} eventKey={SHOW_ICON}>{this.getDisplayOptionsText(false, true)}</MenuItem>
            <MenuItem key={SHOW_TEXT_AND_ICON} eventKey={SHOW_TEXT_AND_ICON}>
              {this.getDisplayOptionsText(true, true)}
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

IconsAndText.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
};
