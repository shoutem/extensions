import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { EmptyResourcePlaceholder } from '@shoutem/react-web-ui';
import _ from 'lodash';
import { navigateToExtension } from 'src/redux';
import emptyImage from 'assets/social-empty-placeholder.svg';
import './style.scss';

const AUTH_CANONICAL_NAME = 'shoutem.auth';

class ShortcutInfoPage extends Component {
  constructor(props) {
    super(props);

    this.handleNavigateToSocialSettings = this.handleNavigateToSocialSettings.bind(this);
    this.handleNavigateToAuthSettings = this.handleNavigateToAuthSettings.bind(this);
  }

  handleNavigateToSocialSettings() {
    const { appId, ownExtension } = this.props;
    const installationId = _.get(ownExtension, 'id');

    const options = { appId, installationId };
    this.props.navigateToExtension(options);
  }

  handleNavigateToAuthSettings() {
    const { appId } = this.props;
    const options = { appId, canonicalName: AUTH_CANONICAL_NAME };
    this.props.navigateToExtension(options);
  }

  render() {
    return (
      <EmptyResourcePlaceholder
        className="shortcut-info-page"
        imageSrc={emptyImage}
        title="No settings"
      >
        <p>
          <div>
            You can configure Social settings{' '}
            <a onClick={this.handleNavigateToSocialSettings}>here</a>.
          </div>
          <div>
            To manage your app users click{' '}
            <a onClick={this.handleNavigateToAuthSettings}>here</a>.
          </div>
        </p>
      </EmptyResourcePlaceholder>
    );
  }
}

ShortcutInfoPage.propTypes = {
  appId: PropTypes.string,
  ownExtension: PropTypes.object,
  navigateToExtension: PropTypes.func,
};


function mapDispatchToProps(dispatch) {
  return {
    navigateToExtension: (appId, options) => (
      dispatch(navigateToExtension(appId, options))
    ),
  };
}

export default connect(null, mapDispatchToProps)(ShortcutInfoPage);
