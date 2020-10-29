import React from 'react';
import { LocalizationProvider } from '../../providers/localization';
import Tabbar from './Tabbar';

export default function LocalizationPage({ ...props }) {
  return (
    <LocalizationProvider>
      <Tabbar {...props} />
    </LocalizationProvider>
  );
}
