import React from 'react';
import { Alert } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import i18next from 'i18next';
import LOCALIZATION from './localization';

function NavigationBarBackgroundImageAlert() {
  return (
    <Alert className="navigation-bar-page-background-image__alert">
      <p className="navigation-bar-page-background-image__alert-title">
        {i18next.t(LOCALIZATION.BACKGROUND_IMAGE_ALERT_TITLE)}
      </p>
      <p className="navigation-bar-page-background-image__alert-description">
        <Trans i18nKey={LOCALIZATION.BACKGROUND_IMAGE_ALERT_DESCRIPTION}>
          Two variants of the navigation bar is required. One for phones without
          notch, and one for phones with a notch.
          <br />
          <a
            href="https://shoutem.com/support/navigation-bar-with-notch/"
            target="_blank"
          >
            Learn more
          </a>{' '}
          on technical details and how to prepare images.
        </Trans>
      </p>
    </Alert>
  );
}

export default React.memo(NavigationBarBackgroundImageAlert);
