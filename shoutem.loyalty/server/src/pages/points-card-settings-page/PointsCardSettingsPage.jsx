import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { navigateToSettings } from '../../redux';

export function PointsCardSettingsPage({ navigateToLoyaltySettings }) {
  return (
    <p className="points-card-settings-page">
      To configure your Loyalty program, please click{' '}
      <a onClick={navigateToLoyaltySettings}>here</a>.
    </p>
  );
}

PointsCardSettingsPage.propTypes = {
  navigateToLoyaltySettings: PropTypes.func,
};

function mapDispatchToProps(dispatch, ownProps) {
  const { appId, ownExtensionName } = ownProps;

  return {
    navigateToLoyaltySettings: () => (
      dispatch(navigateToSettings(appId, ownExtensionName))
    ),
  };
}

export default connect(null, mapDispatchToProps)(PointsCardSettingsPage);
