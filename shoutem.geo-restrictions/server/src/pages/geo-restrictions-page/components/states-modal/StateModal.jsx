import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { Button, Modal } from 'react-bootstrap';
import { IconLabel } from '@shoutem/react-web-ui';
import i18next from 'i18next';
import { StateRow } from '../state-row';
import { STATES } from '../state-row/const';
import LOCALIZATION from './localization';
import './style.scss';

export default class StateModal extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  render() {
    const {
      currentAllowedStates,
      savedStates,
      extension,
      onHideModal,
      onExtensionSettingsUpdate,
      onStateSelect,
      onSelectAll,
      onSelectNone,
    } = this.props;

    const isSaveButtonDisabled = _.isEqual(currentAllowedStates, savedStates);

    return (
      <Modal show onHide={onHideModal} animation={false} backdrop={false}>
        <Modal.Header closeButton>
          <p />
          <Modal.Title>
            <p />
            {i18next.t(LOCALIZATION.MODAL_TITLE)}
            <p />
            <h5>{i18next.t(LOCALIZATION.MODAL_SUBTITLE)}</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="state-table">
            {_.map(STATES, (state, key) => (
              <StateRow
                key={key}
                state={state}
                allowedStates={currentAllowedStates}
                onStateSelect={onStateSelect}
                onExtensionSettingsUpdate={onExtensionSettingsUpdate}
              />
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="select-container">
            {i18next.t(LOCALIZATION.SELECT_LABEL)}
            <Button
              className="select-button"
              onClick={onSelectAll}
              bsStyle="link"
            >
              <IconLabel iconName="copied">
                {i18next.t(LOCALIZATION.ALL_BUTTON_LABEL)}
              </IconLabel>
            </Button>
            <Button
              className="select-button"
              onClick={onSelectNone}
              bsStyle="link"
            >
              <IconLabel iconName="copy">
                {i18next.t(LOCALIZATION.NONE_BUTTON_LABEL)}
              </IconLabel>
            </Button>
          </div>
          <div>
            <Button
              className="state-modal-save-button"
              disabled={isSaveButtonDisabled}
              onClick={onExtensionSettingsUpdate}
              bsStyle="primary"
              bsSize="xs"
            >
              {i18next.t(LOCALIZATION.SAVE_BUTTON_LABEL)}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

StateModal.propTypes = {
  allowedStates: PropTypes.array,
  onExtensionSettingsUpdate: PropTypes.func.isRequired,
  onHideModal: PropTypes.func,
  onStateSelect: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectNone: PropTypes.func,
};
