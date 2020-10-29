import React from 'react';
import { LocalizationProvider } from '../../providers/localization';
import SettingsPage from './SettingsPage';
import reducer from './reducer';

export default function LocalizationPage({ ...props }) {
  return (
    <LocalizationProvider>
      <SettingsPage {...props} />
    </LocalizationProvider>
  );
}

export { reducer };
