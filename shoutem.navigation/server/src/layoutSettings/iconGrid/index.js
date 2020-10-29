import React from 'react';
import { LocalizationProvider } from '../../providers/localization';
import IconGrid from './IconGrid';

export default function LocalizationPage({ ...props }) {
  return (
    <LocalizationProvider>
      <IconGrid {...props} />
    </LocalizationProvider>
  );
}
