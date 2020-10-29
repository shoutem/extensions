import React from 'react';
import { LocalizationProvider } from '../../providers/localization';
import SettingsPage from './SettingsPage';

export default function LocalizationPage({ ...props }) {
  return (
    <LocalizationProvider>
      <SettingsPage {...props} />
    </LocalizationProvider>
  );
}
