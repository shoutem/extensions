import React from 'react';
import { LocalizationProvider } from '../providers/localization';
import Web from './components/Web';

export default function LocalizationPage({ ...props }) {
  return (
    <LocalizationProvider>
      <Web {...props} />
    </LocalizationProvider>
  );
}
