import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import {
  getApplicationStatus,
  isPublished,
  loadApplicationStatus,
} from 'src/modules/app';
import { Notifications } from 'src/modules/notifications';
import { getExtension } from '@shoutem/redux-api-sdk';
import { shouldLoad } from '@shoutem/redux-io';
import LOCALIZATION from './localization';
import './style.scss';

class NotificationsPage extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      showAlert: false,
      alertMessage: null,
      isModalShown: false,
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

  handleUpdateIsModalShown(isModalShown) {
    this.setState({ isModalShown });
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
    const { appId, applicationStatus, settings } = this.props;
    const { isModalShown } = this.state;

    const published = isPublished(applicationStatus);

    return (
      <div className="notifications-page">
        {/* Hiding because if user adds X number of summary fields (user scheduled
        notifications), this form becomes visible inside modal - broken UI */}
        {!isModalShown && (
          <>
            {!published && (
              <Alert className="publish-alert">
                {i18next.t(LOCALIZATION.PUBLISH_ALERT)}
              </Alert>
            )}
            {this.renderAlert()}
          </>
        )}
        <Notifications
          appId={appId}
          onModalShown={this.handleUpdateIsModalShown}
          showAlert={this.handleShowAlert}
          settings={settings}
        />
      </div>
    );
  }
}

NotificationsPage.propTypes = {
  appId: PropTypes.string.isRequired,
  applicationStatus: PropTypes.object,
  settings: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;

  const extension = getExtension(state, extensionName);
  const settings = _.get(extension, 'settings', {});
  const applicationStatus = getApplicationStatus(state);
  const appId = _.get(extension, 'app');

  return {
    extension,
    appId,
    applicationStatus,
    settings,
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
