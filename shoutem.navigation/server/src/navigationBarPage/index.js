import React from 'react';
import { LocalizationProvider } from '../providers/localization';
import NavigationBarPage from './NavigationBarPage';

export default function LocalizationPage({ ...props }) {
  return (
    <LocalizationProvider>
      <NavigationBarPage {...props} />
    </LocalizationProvider>
  );
}
