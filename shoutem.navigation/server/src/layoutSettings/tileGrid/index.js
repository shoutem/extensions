import React from 'react';
import { LocalizationProvider } from '../../providers/localization';
import TileGrid from './TileGrid';

export default function LocalizationPage({ ...props }) {
  return (
    <LocalizationProvider>
      <TileGrid {...props} />
    </LocalizationProvider>
  );
}
