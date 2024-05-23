import React, { PureComponent } from 'react';
import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
  Modal,
} from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';

export default class ProtectedScreenModal extends PureComponent {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const { shortcut } = props;

    this.state = {
      androidProductId: _.get(
        shortcut,
        'settings.shoutemInAppPurchases.androidProductId',
      ),
      iOSProductId: _.get(
        shortcut,
        'settings.shoutemInAppPurchases.iOSProductId',
      ),
      loading: false,
      error: undefined,
    };
  }

  componentDidUpdate(prevProps) {
    const { shortcut: prevShortcut } = prevProps;
    const { shortcut } = this.props;

    if (shortcut !== prevShortcut) {
      this.setState({
        androidProductId: _.get(
          shortcut,
          'settings.shoutemInAppPurchases.androidProductId',
        ),
        iOSProductId: _.get(
          shortcut,
          'settings.shoutemInAppPurchases.iOSProductId',
        ),
      });
    }
  }

  handleIOSProductChange(event) {
    const iOSProductId = _.get(event, 'target.value');
    this.setState({ iOSProductId });
  }

  handleAndroidProductChange(event) {
    const androidProductId = _.get(event, 'target.value');
    this.setState({ androidProductId });
  }

  handleSavePress() {
    const { androidProductId, iOSProductId } = this.state;
    const { onSave } = this.props;

    this.setState({ loading: true, error: undefined });

    onSave({
      androidProductId,
      iOSProductId,
    })
      .then(() => this.setState({ loading: false }))
      .catch(() =>
        this.setState({
          loading: false,
          error: i18next.t(LOCALIZATION.GENERIC_ERROR),
        }),
      );
  }

  saveEnabled() {
    const { loading, androidProductId, iOSProductId } = this.state;
    const { shortcut } = this.props;

    const prevAndroidProductId = _.get(
      shortcut,
      'settings.shoutemInAppPurchases.androidProductId',
    );
    const prevIOSProductId = _.get(
      shortcut,
      'settings.shoutemInAppPurchases.iOSProductId',
    );

    const hasChanges =
      prevAndroidProductId !== androidProductId ||
      prevIOSProductId !== iOSProductId;

    if ((!androidProductId && !iOSProductId) || !hasChanges || loading) {
      return false;
    }

    return true;
  }

  render() {
    const { visible, onCancel, shortcut } = this.props;
    const { error, loading, iOSProductId, androidProductId } = this.state;

    const saveEnabled = this.saveEnabled();

    return (
      <Modal dialogClassName="confirm-modal" onHide={onCancel} show={visible}>
        <Modal.Header>
          <Modal.Title>{shortcut?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="iOSProductId">
            <ControlLabel>
              {i18next.t(LOCALIZATION.IOS_PRODUCT_TITLE)}
            </ControlLabel>
            <FormControl
              value={iOSProductId}
              onChange={this.handleIOSProductChange}
            />
          </FormGroup>
          <FormGroup controlId="androidProductId">
            <ControlLabel>
              {i18next.t(LOCALIZATION.ANDROID_PRODUCT_TITLE)}
            </ControlLabel>
            <FormControl
              value={androidProductId}
              onChange={this.handleAndroidProductChange}
            />
          </FormGroup>
          {error && (
            <div className="has-error">
              <HelpBlock>{error}</HelpBlock>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onCancel}>
            {i18next.t(LOCALIZATION.BUTTON_CANCEL)}
          </Button>
          <Button
            bsStyle="primary"
            onClick={this.handleSavePress}
            disabled={!saveEnabled}
          >
            <LoaderContainer isLoading={loading}>
              {i18next.t(LOCALIZATION.BUTTON_SEND)}
            </LoaderContainer>
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ProtectedScreenModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  shortcut: PropTypes.object,
};

ProtectedScreenModal.defaultProps = {
  shortcut: undefined,
};
