import React, { PropTypes } from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import './style.scss';

export default function ShopPreview({ store, onNavigateToShopifySettingsClick }) {
  return (
    <div className="shop-preview">
      <form>
        <FormGroup>
          <ControlLabel>
            Store URL (Change it in settings{' '}
            <a onClick={onNavigateToShopifySettingsClick}>here</a>
            ).
          </ControlLabel>
          <div className="shop-preview__url-container">
            <div className="shop-preview__shop-img" />
            <div className="text-ellipsis">
              <span className="shop-preview__url">
                {store}
              </span>
            </div>
          </div>
        </FormGroup>
      </form>
    </div>
  );
}

ShopPreview.propTypes = {
  store: PropTypes.string,
  onNavigateToShopifySettingsClick: PropTypes.func,
};
