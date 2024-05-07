import React from 'react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { RadioSelector } from '@shoutem/react-web-ui';
import { IMPORTER_SCHEDULE_SETTINGS } from '../../const';
import LOCALIZATION from './localization';

function getScheduleOptions() {
  return [
    {
      value: IMPORTER_SCHEDULE_SETTINGS.ONCE,
      label: i18next.t(LOCALIZATION.JUST_ONCE),
    },
  ];
}

export default function ImporterScheduleSelector({ value }) {
  return (
    <FormGroup>
      <ControlLabel>{i18next.t(LOCALIZATION.FORM_TITLE)}</ControlLabel>
      <RadioSelector options={getScheduleOptions()} activeValue={value} />
    </FormGroup>
  );
}

ImporterScheduleSelector.propTypes = {
  value: PropTypes.string,
};
