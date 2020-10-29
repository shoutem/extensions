import React from 'react';
import { LocalizationProvider } from '../../../providers/localization';
import Rss from './Rss';

export default function LocalizationPage({ ...props }) {
  return (
    <LocalizationProvider>
      <Rss {...props} />
    </LocalizationProvider>
  );
}
