import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import i18next from 'i18next';
import { shouldLoad } from '@shoutem/redux-io';
import { getExtension } from '@shoutem/redux-api-sdk';
import {
  loadApplicationStatus,
  getApplicationStatus,
  isPublished,
} from 'src/modules/app';
import { Rss } from 'src/modules/rss';
import LOCALIZATION from './localization';
import './style.scss';

class RssPage extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { appId, loadApplicationStatus } = nextProps;

    if (shouldLoad(nextProps, props, 'applicationStatus')) {
      loadApplicationStatus(appId);
    }
  }

  render() {
    const { appId, extensionName, applicationStatus } = this.props;
    const published = isPublished(applicationStatus);

    return (
      <div className="rss-page">
        {!published && (
          <Alert className="publish-alert">
            {i18next.t(LOCALIZATION.PUSH_ALERT)}
          </Alert>
        )}
        <Rss appId={appId} extensionName={extensionName} />
      </div>
    );
  }
}

RssPage.propTypes = {
  appId: PropTypes.string.isRequired,
  extensionName: PropTypes.string,
  applicationStatus: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extension = getExtension(state, extensionName);
  const applicationStatus = getApplicationStatus(state);
  const appId = _.get(extension, 'app');

  return {
    extensionName,
    appId,
    applicationStatus,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadApplicationStatus,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(RssPage);
