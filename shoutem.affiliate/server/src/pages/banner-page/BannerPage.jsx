import React, { useState } from 'react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { Switch } from '@shoutem/react-web-ui';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import { BannerForm } from '../../fragments';
import { resolveBannerConfig } from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

export default function BannerPage(props) {
  const { shortcut } = props;
  const {
    settings: { bannerConfig = {} },
  } = shortcut;

  const dispatch = useDispatch();

  const [showBanner, setShowBanner] = useState(bannerConfig.showBanner);

  function handleShowBannerEnabled() {
    const newBannerEnabled = !showBanner;

    dispatch(
      updateShortcutSettings(shortcut, resolveBannerConfig(newBannerEnabled)),
    ).then(() => setShowBanner(newBannerEnabled));
  }

  return (
    <div className="banner-page">
      <FormGroup className="switch-form-group">
        <ControlLabel>{i18next.t(LOCALIZATION.SHOW_BANNER_TEXT)}</ControlLabel>
        <Switch onChange={handleShowBannerEnabled} value={showBanner} />
      </FormGroup>
      {showBanner && <BannerForm config={bannerConfig} shortcut={shortcut} />}
    </div>
  );
}

BannerPage.propTypes = {
  shortcut: PropTypes.object.isRequired,
};
