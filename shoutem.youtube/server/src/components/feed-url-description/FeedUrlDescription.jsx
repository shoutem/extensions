/* eslint-disable react-native/no-raw-text */
import React from 'react';
import { Trans } from 'react-i18next';
import { FontIcon, FontIconPopover } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

const UrlTypesDescription = (
  <span className="feed-url-description__popover-text">
    <Trans i18nKey={LOCALIZATION.URL_TYPES_DESCRIPTION_TEXT}>
      <b>Channel / User</b> - loads all videos from the linked URL and let’s you
      sort order of appareance
      <br />
      <b>Playlist</b> - loads a list of videos that are in the predefined order
    </Trans>
  </span>
);

export default function FeedUrlDescription() {
  return (
    <div className="feed-url-description__container">
      <Trans i18nKey={LOCALIZATION.HOW_TO_LINK_TEXT}>
        To find source URL: <br />
      </Trans>
      <Trans i18nKey={LOCALIZATION.HOW_TO_LINK_STEP_1}>
        1. Go to Youtube. <br />
      </Trans>
      <Trans i18nKey={LOCALIZATION.HOW_TO_LINK_STEP_2}>
        2. Go to the <b>playlist</b>, <b>channel</b> or <b>user</b> you’d like
        to load in your app.{' '}
      </Trans>
      <FontIconPopover
        className="feed-url-description__popover-icon"
        delayHide={500}
        hideOnMouseLeave={false}
        message={UrlTypesDescription}
      >
        <FontIcon className="font-icon" name="info" size="24px" />
      </FontIconPopover>
      <br />
      <Trans i18nKey={LOCALIZATION.HOW_TO_LINK_STEP_3}>
        3. In the browser address bar, copy the URL. <br />
      </Trans>
      <Trans i18nKey={LOCALIZATION.HOW_TO_LINK_STEP_4}>
        4. Paste the URL in input field and press continue.
      </Trans>
    </div>
  );
}
