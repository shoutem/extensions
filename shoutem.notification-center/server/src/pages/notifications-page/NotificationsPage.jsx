import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { bindActionCreators } from 'redux';
import { Alert } from 'react-bootstrap';
import classNames from 'classnames';
import { shouldLoad } from '@shoutem/redux-io';
import { getExtension } from '@shoutem/redux-api-sdk';
import { connect } from 'react-redux';
import { Notifications } from 'src/modules/notifications';
import {
  loadApplicationStatus,
  getApplicationStatus,
  isPublished,
} from 'src/modules/app';
import './style.scss';

class NotificationsPage extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      showAlert: false,
      alertMessage: null,
    };
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

  hideAlert() {
    this.setState({ showAlert: false });
  }

  removeAlertMessage() {
    this.setState({ alertMessage: null });
  }

  handleShowAlert(alertMessage) {
    this.setState({
      showAlert: true,
      alertMessage,
    });

    setTimeout(this.hideAlert, 4000);
  }

  renderAlert() {
    const { showAlert, alertMessage } = this.state;

    const classes = classNames('notification-alert', {
      'notification-alert-show': showAlert,
    });

    return (
      <Alert bsStyle="success" className={classes}>
        {alertMessage}
      </Alert>
    );
  }

  render() {
    const { appId, applicationStatus } = this.props;

    const published = isPublished(applicationStatus);

    return (
      <div className="notifications-page">
        {!published && (
          <Alert className="publish-alert">
            Push notifications can't reach users until your app is published.
          </Alert>
        )}
        {this.renderAlert()}
        <Notifications appId={appId} showAlert={this.handleShowAlert} />
      </div>
    );
  }
}

NotificationsPage.propTypes = {
  appId: PropTypes.string.isRequired,
  applicationStatus: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;
  const extension = getExtension(state, extensionName);
  const applicationStatus = getApplicationStatus(state);
  const appId = _.get(extension, 'app');

  return {
    extension,
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsPage);
