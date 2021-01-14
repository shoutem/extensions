import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { LanguageSelector } from '@shoutem/cms-dashboard';
import LOCALIZATION from './localization';

export default function ImporterLanguageSelector({
  languages,
  selectedLanguages,
  onSelectionChanged,
}) {
  return (
    <FormGroup>
      <ControlLabel>{i18next.t(LOCALIZATION.FORM_TITLE)}</ControlLabel>
      <LanguageSelector
        languages={languages}
        onSelectionChanged={onSelectionChanged}
        selectedLanguages={selectedLanguages}
      />
    </FormGroup>
  );
}

ImporterLanguageSelector.propTypes = {
  languages: PropTypes.array,
  selectedLanguages: PropTypes.array,
  onSelectionChanged: PropTypes.func,
};
