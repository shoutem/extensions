import React from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormGroup,
} from 'react-bootstrap';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { InlineModal } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default function DeleteFontModal({ onCancel, onSubmit, font }) {
  const handleSubmit = () => {
    onSubmit(font);
  };

  return (
    <InlineModal
      className="font-modal"
      onHide={onCancel}
      title={i18next.t(LOCALIZATION.DELETE_MODAL_TITLE)}
      show
    >
      <FormGroup>
        <ControlLabel>
          {i18next.t(LOCALIZATION.DELETE_WARNING)}
          {font.name}
          {' ?'}
        </ControlLabel>
      </FormGroup>
      <ButtonToolbar>
        <Button onClick={onCancel}>
          {i18next.t(LOCALIZATION.ABORT_LABEL)}
        </Button>
        <Button bsStyle="danger" onClick={handleSubmit}>
          {i18next.t(LOCALIZATION.DELETE)}
        </Button>
      </ButtonToolbar>
    </InlineModal>
  );
}

DeleteFontModal.propTypes = {
  font: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
