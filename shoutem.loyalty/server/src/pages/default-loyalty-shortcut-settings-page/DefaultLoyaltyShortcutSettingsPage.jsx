import React from 'react';
import { Trans } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { navigateToSettings } from '../../redux';
import LOCALIZATION from './localization';

export function DefaultLoyaltyShortcutSettingsPage({
  navigateToLoyaltySettings,
}) {
  return (
    <p className="points-card-settings-page">
      <Trans i18nKey={LOCALIZATION.DESCRIPTION}>
        To configure your Loyalty program, please click
        <a onClick={navigateToLoyaltySettings}>here</a>.
      </Trans>
    </p>
  );
}

DefaultLoyaltyShortcutSettingsPage.propTypes = {
  navigateToLoyaltySettings: PropTypes.func,
};

function mapDispatchToProps(dispatch, ownProps) {
  const { appId, ownExtensionName } = ownProps;

  return {
    navigateToLoyaltySettings: () =>
      dispatch(navigateToSettings(appId, ownExtensionName)),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(DefaultLoyaltyShortcutSettingsPage);
