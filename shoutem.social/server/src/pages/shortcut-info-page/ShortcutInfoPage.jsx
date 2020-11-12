import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { Trans } from 'react-i18next';
import { EmptyResourcePlaceholder } from '@shoutem/react-web-ui';
import { navigateToSettings } from 'src/redux';
import emptyImage from 'assets/social-empty-placeholder.svg';
import LOCALIZATION from './localization';
import './style.scss';

const AUTH_CANONICAL_NAME = 'shoutem.auth';

export function ShortcutInfoPage({
  navigateToSocialSettings,
  navigateToAuthSettings,
}) {
  return (
    <EmptyResourcePlaceholder
      className="shortcut-info-page"
      imageSrc={emptyImage}
      title={i18next.t(LOCALIZATION.EMPTY_PLACEHOLDER_TITLE)}
    >
      <p>
        <Trans i18nKey={LOCALIZATION.CONFIGURE_SETTINGS_TEXT}>
          You can configure Social settings
          <a onClick={navigateToSocialSettings}>here</a>.
        </Trans>
        <br />
        <Trans i18nKey={LOCALIZATION.MANAGE_APP_USERS_TEXT}>
          To manage your app users click
          <a onClick={navigateToAuthSettings}>here</a>.
        </Trans>
      </p>
    </EmptyResourcePlaceholder>
  );
}

ShortcutInfoPage.propTypes = {
  navigateToSocialSettings: PropTypes.func,
  navigateToAuthSettings: PropTypes.func,
};

function mapDispatchToProps(dispatch, ownProps) {
  const { appId, ownExtensionName } = ownProps;

  return {
    navigateToSocialSettings: () =>
      dispatch(navigateToSettings(appId, ownExtensionName)),
    navigateToAuthSettings: () =>
      dispatch(navigateToSettings(appId, AUTH_CANONICAL_NAME)),
  };
}

export default connect(null, mapDispatchToProps)(ShortcutInfoPage);
