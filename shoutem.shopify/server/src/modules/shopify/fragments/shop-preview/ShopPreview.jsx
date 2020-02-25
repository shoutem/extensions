import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel, FormControl  } from 'react-bootstrap';
import './style.scss';

export default function ShopPreview({ store, onNavigateToShopifySettingsClick }) {
  return (
    <div className="shop-preview">
      <form>
        <FormGroup>
          <ControlLabel>
            Store URL
            <span style={{fontWeight: 'normal', paddingLeft: '5px'}}>
              (You can change this by going to settings or <a href='#' onClick={onNavigateToShopifySettingsClick}>clicking here</a>)
            </span>
          </ControlLabel>
          <FormControl
            type="text"
            value={store}
            disabled
          />
        </FormGroup>
      </form>
    </div>
  );
}

ShopPreview.propTypes = {
  store: PropTypes.string,
  onNavigateToShopifySettingsClick: PropTypes.func,
};
