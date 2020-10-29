import React from 'react';
import { LocalizationProvider } from '../../providers/localization';
import CmsPage from './CmsPage';

export default function LocalizationPage({ ...props }) {
  return (
    <LocalizationProvider>
      <CmsPage {...props} />
    </LocalizationProvider>
  );
}
