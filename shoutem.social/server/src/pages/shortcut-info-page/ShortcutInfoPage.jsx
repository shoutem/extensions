import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { EmptyResourcePlaceholder } from '@shoutem/react-web-ui';
import { navigateToSettings } from 'src/redux';
import emptyImage from 'assets/social-empty-placeholder.svg';
import './style.scss';

const AUTH_CANONICAL_NAME = 'shoutem.auth';

export function ShortcutInfoPage({ navigateToSocialSettings, navigateToAuthSettings }) {
  return (
    <EmptyResourcePlaceholder
      className="shortcut-info-page"
      imageSrc={emptyImage}
      title="No settings"
    >
      <p>
        <div>
          You can configure Social settings{' '}
          <a onClick={navigateToSocialSettings}>here</a>.
        </div>
        <div>
          To manage your app users click{' '}
          <a onClick={navigateToAuthSettings}>here</a>.
        </div>
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
    navigateToSocialSettings: () => (
      dispatch(navigateToSettings(appId, ownExtensionName))
    ),
    navigateToAuthSettings: () => (
      dispatch(navigateToSettings(appId, AUTH_CANONICAL_NAME))
    ),
  };
}

export default connect(null, mapDispatchToProps)(ShortcutInfoPage);
