import React from 'react';
import { LocalizationProvider } from '../../providers/localization';
import LayoutSettingsPage from './LayoutSettingsPage';

export default function LocalizationPage({ ...props }) {
  return (
    <LocalizationProvider>
      <LayoutSettingsPage {...props} />
    </LocalizationProvider>
  );
}
