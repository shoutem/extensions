import React from 'react';
import { LocalizationProvider } from '../../providers/localization';
import List from './List';

export default function LocalizationPage({ ...props }) {
  return (
    <LocalizationProvider>
      <List {...props} />
    </LocalizationProvider>
  );
}
