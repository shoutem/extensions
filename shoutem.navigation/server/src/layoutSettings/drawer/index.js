import React from 'react';
import { LocalizationProvider } from '../../providers/localization';
import Drawer from './Drawer';

export default function LocalizationPage({ ...props }) {
  return (
    <LocalizationProvider>
      <Drawer {...props} />
    </LocalizationProvider>
  );
}
