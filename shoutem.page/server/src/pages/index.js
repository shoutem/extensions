import React from 'react';
import { LocalizationProvider } from '../providers/localization';
import PageSettings from './PageSettings';

export default function LocalizationPage({ ...props }) {
  return (
    <LocalizationProvider>
      <PageSettings {...props} />
    </LocalizationProvider>
  );
}
