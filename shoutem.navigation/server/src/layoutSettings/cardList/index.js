import React from 'react';
import { LocalizationProvider } from '../../providers/localization';
import CardList from './CardList';

export default function LocalizationPage({ ...props }) {
  return (
    <LocalizationProvider>
      <CardList {...props} />
    </LocalizationProvider>
  );
}
