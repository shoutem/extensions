import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import i18next from 'i18next';
import './style.scss';
import LOCALIZATION from './localization';

export default function ModalDialog({
  active,
  onCancel,
  onConfirm,
  title,
  description,
}) {
  return (
    <Modal
      backdropClassName="backdrop"
      dialogClassName="container"
      onHide={onCancel}
      show={active}
    >
      <div className="title-container">{title}</div>
      <div className="description-container">{description}</div>
      <div className="button-container">
        <button className="modal-button" onClick={onCancel} type="button">
          {i18next.t(LOCALIZATION.DECLINE_LABEL)}
        </button>
        <button
          className="modal-button modal-button-active"
          onClick={onConfirm}
          type="button"
        >
          {i18next.t(LOCALIZATION.CONFIRM_LABEL)}
        </button>
      </div>
    </Modal>
  );
}

ModalDialog.propTypes = {
  active: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};
