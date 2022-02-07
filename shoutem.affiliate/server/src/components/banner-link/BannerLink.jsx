import React from 'react';
import { ControlLabel, Dropdown, MenuItem } from 'react-bootstrap';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import LOCALIZATION from './localization';
import './style.scss';

function BannerLink(props) {
  const { onSelect, selectedShortcutLink, shortcutOptions } = props;

  return (
    <div className="banner-link__dropdown">
      <ControlLabel>{i18next.t(LOCALIZATION.SCREEN_TO_OPEN_TEXT)}</ControlLabel>
      <Dropdown id="banner-link-dropdown" className="block" onSelect={onSelect}>
        <Dropdown.Toggle>{selectedShortcutLink?.title}</Dropdown.Toggle>
        <Dropdown.Menu>
          <MenuItem key="none" eventKey={selectedShortcutLink}>
            {selectedShortcutLink.title}
          </MenuItem>
          <MenuItem divider />
          {shortcutOptions.map(shortcut => (
            <MenuItem key={shortcut.id} eventKey={shortcut}>
              {shortcut.title}
            </MenuItem>
          ))}
          <MenuItem divider />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

BannerLink.propTypes = {
  selectedShortcutLink: PropTypes.object.isRequired,
  shortcutOptions: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default React.memo(BannerLink);
