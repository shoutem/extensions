/* eslint-disable react-native/no-raw-text */
import React from 'react';
import { Alert } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import LOCALIZATION from './localization';

export default function NonPlaylistAlert() {
  return (
    <Alert>
      <div>
        <Trans i18nKey={LOCALIZATION.NOT_A_PLAYLIST_URL_DESCRIPTION_ALERT}>
          We see you are using <b>non-playlist</b> type of Youtube URL.
          <br />
          Note that you have limited daily Youtube API points and your
          non-playlist Youtube URL requests have high points cost. There is a
          possibility of reaching the points limit. <br />
          If limit is reached, we will notify you via message inside this
          window. <br />
          Also, in-app users will not be able to see new videos until points are
          reset, if any were uploaded since the limit was reached on that day.
        </Trans>
      </div>
    </Alert>
  );
}
