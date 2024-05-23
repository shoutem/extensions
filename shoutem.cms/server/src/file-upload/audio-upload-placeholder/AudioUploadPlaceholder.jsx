import React from 'react';
import { Button, FormControl } from 'react-bootstrap';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default function AudioUploadPlaceholder({ onClick, isLoading }) {
  return (
    <div className="audio-upload-placeholder">
      <FormControl readOnly />
      <Button bsSize="large" onClick={onClick}>
        <LoaderContainer isLoading={isLoading}>
          {i18next.t(LOCALIZATION.BUTTON_BROWSE)}
        </LoaderContainer>
      </Button>
    </div>
  );
}

AudioUploadPlaceholder.propTypes = {
  onClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

AudioUploadPlaceholder.defaultProps = {
  isLoading: false,
};
