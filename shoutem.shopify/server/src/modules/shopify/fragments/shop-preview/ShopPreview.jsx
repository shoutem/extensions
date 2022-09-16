import React from 'react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import LOCALIZATION from './localization';
import './style.scss';

export default function ShopPreview({
  store,
  onNavigateToShopifySettingsClick,
}) {
  return (
    <div className="shop-preview">
      <form>
        <FormGroup>
          <ControlLabel>
            {i18next.t(LOCALIZATION.STORE_URL_LABEL)}
            <span style={{ fontWeight: 'normal', paddingLeft: '5px' }}>
              {i18next.t(LOCALIZATION.STORE_URL_CHANGE_TEXT_PART_ONE)}{' '}
              <a href="#" onClick={onNavigateToShopifySettingsClick}>
                {i18next.t(LOCALIZATION.STORE_URL_CHANGE_TEXT_PART_TWO)}
              </a>
              {i18next.t(LOCALIZATION.STORE_URL_CHANGE_TEXT_PART_THREE)}
            </span>
          </ControlLabel>
          <FormControl type="text" value={store} disabled />
        </FormGroup>
      </form>
    </div>
  );
}

ShopPreview.propTypes = {
  store: PropTypes.string,
  onNavigateToShopifySettingsClick: PropTypes.func,
};
