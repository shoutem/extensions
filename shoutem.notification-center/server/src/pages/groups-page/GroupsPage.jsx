import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Groups } from 'src/modules/groups';
import { AssetManager } from '@shoutem/assets-sdk';
import { getExtension } from '@shoutem/redux-api-sdk';

class GroupsPage extends Component {
  constructor(props, context) {
    super(props, context);
    autoBindReact(this);

    const { appId } = props;
    const { page } = context;
    const appsUrl = _.get(page, 'pageContext.url.apps', {});

    this.assetManager = new AssetManager({
      scopeType: 'application',
      scopeId: appId,
      assetPolicyHost: appsUrl,
    });
  }

  render() {
    const { appId } = this.props;

    return (
      <div className="groups-page">
        <Groups appId={appId} assetManager={this.assetManager} />
      </div>
    );
  }
}

GroupsPage.propTypes = {
  appId: PropTypes.string.isRequired,
};

GroupsPage.contextTypes = {
  page: PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extension = getExtension(state, extensionName);
  const appId = _.get(extension, 'app');

  return {
    extension,
    appId,
  };
}

export default connect(mapStateToProps)(GroupsPage);
