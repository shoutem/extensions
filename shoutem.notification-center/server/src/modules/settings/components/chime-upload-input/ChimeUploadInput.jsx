import React from 'react';
import { Button, FormControl } from 'react-bootstrap';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import LOCALIZATION from './localization';
import './style.scss';

export default function ChimeUploadInput({ onClick }) {
  return (
    <div className="chime-upload-input" onClick={onClick}>
      <FormControl readOnly />
      <Button bsSize="large">{i18next.t(LOCALIZATION.BUTTON_BROWSE)}</Button>
    </div>
  );
}

ChimeUploadInput.propTypes = {
  onClick: PropTypes.func.isRequired,
};
