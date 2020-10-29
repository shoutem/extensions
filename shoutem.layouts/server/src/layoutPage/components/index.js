import React from 'react';
import { LocalizationProvider } from '../../providers/localization';
import LayoutPage from './LayoutPage';

export default function LocalizationPage({ ...props }) {
  return (
    <LocalizationProvider>
      <LayoutPage {...props} />
    </LocalizationProvider>
  );
}
