import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getExtension } from '@shoutem/redux-api-sdk';
import { AppAnalyticsFragment } from '../../modules/analytics';
import './style.scss';

export default function AppAnalyticsPage({ extensionName }) {
  const extension = useSelector(state => getExtension(state, extensionName));
  const appId = _.get(extension, 'app');

  return (
    <div className="app-analytics-page">
      <AppAnalyticsFragment appId={appId} />
    </div>
  );
}

AppAnalyticsPage.propTypes = {
  extensionName: PropTypes.string.isRequired,
};
