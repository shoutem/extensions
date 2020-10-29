import React from 'react';
import { LocalizationProvider } from '../providers/localization';
import IconsPage from './IconsPage';

export default function LocalizationPage({ ...props }) {
  return (
    <LocalizationProvider>
      <IconsPage {...props} />
    </LocalizationProvider>
  );
}
