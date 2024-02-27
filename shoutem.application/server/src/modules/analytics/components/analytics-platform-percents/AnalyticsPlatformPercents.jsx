import React from 'react';
import PropTypes from 'prop-types';
import { FontIcon } from '@shoutem/react-web-ui';
import './style.scss';

export function AnalyticsPlatformPercents(props) {
  const { iosPercent, androidPercent } = props;

  return (
    <>
      <div className="platform-analytics__value-container">
        <FontIcon
          name="apple"
          size="20px"
          className="platform-analytics__icon"
        />
        <p className="platform-analytics__value">{iosPercent}</p>
      </div>
      <div className="platform-analytics__value-container">
        <FontIcon
          name="android"
          size="20px"
          className="platform-analytics__icon"
        />
        <p className="platform-analytics__value">{androidPercent}</p>
      </div>
    </>
  );
}

AnalyticsPlatformPercents.propTypes = {
  iosPercent: PropTypes.string.isRequired,
  androidPercent: PropTypes.string.isRequired,
};

export default React.memo(AnalyticsPlatformPercents);
