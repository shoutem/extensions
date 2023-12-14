import React from 'react';
import { ControlLabel } from 'react-bootstrap';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import TranslationTable from '../translation-table';
import LOCALIZATION from './localization';
import './style.scss';

export default function ScreenTable({
  isLoading,
  screens,
  translations,
  translateTo,
  onChange,
}) {
  if (!translateTo) {
    return null;
  }

  return (
    <LoaderContainer isLoading={isLoading} className="screen-table">
      <ControlLabel>{i18next.t(LOCALIZATION.SCREEN_TABLE_TITLE)}</ControlLabel>
      {_.map(screens, item => (
        <TranslationTable
          key={item.id}
          translation={item}
          translations={translations}
          translateTo={translateTo}
          onChange={onChange}
        />
      ))}
    </LoaderContainer>
  );
}

ScreenTable.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  translateTo: PropTypes.object.isRequired,
  translations: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  screens: PropTypes.array,
};

ScreenTable.defaultProps = {
  screens: [],
};
