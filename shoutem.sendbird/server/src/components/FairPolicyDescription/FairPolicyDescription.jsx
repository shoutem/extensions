import React from 'react';
import { Alert } from 'react-bootstrap';
import { FontIconPopover, FontIcon } from '@shoutem/react-web-ui';
import i18next from 'i18next';
import { Trans } from 'react-i18next';
import LOCALIZATION from './localization';
import './style.scss';

const CONTACT_US_LINK = 'https://shoutem.com/about/contact-us/support';
const SENDBIRD_SUPPORT_LINK = 'https://shoutem.com/support/sendbird-chat/';

export default function FairPolicyDescription() {
  const popoverMessage = (
    <div className="popover-message">
      {i18next.t(LOCALIZATION.POPOVER_MESSAGE)}
      <a href={SENDBIRD_SUPPORT_LINK} rel="noopener noreferrer" target="_blank">
        {i18next.t(LOCALIZATION.LEARN_MORE)}
      </a>
    </div>
  );

  return (
    <Alert className="fair-use-alert">
      <Trans i18nKey={LOCALIZATION.DESCRIPTION}>
        Within the “fair use” policy, the use of the chat will be limited to 100
        users per app. After that you will need to either buy more user space or
        upgrade to Sendbird. Please
        <a href={CONTACT_US_LINK} rel="noopener noreferrer" target="_blank">
          contact us
        </a>
        if you have more questions about this.
      </Trans>
      <FontIconPopover message={popoverMessage} placement="top">
        <FontIcon
          className="sendbird-settings-page__icon-popover"
          name="info"
          size="17px"
        />
      </FontIconPopover>
    </Alert>
  );
}
