import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { GraphThumbnail } from '../graph';
import './style.scss';

export function AnalyticsTab(props) {
  const {
    tab: { title, key: dataKey },
    value,
    active,
    onTabClick,
    graphData,
  } = props;

  const className = classNames('analytics_tab__tab-container', {
    'analytics_tab__inactive-tab': !active,
  });

  // Show 0 while fetching data
  const analyticsValue = value || '0';

  return (
    <div className={className} onClick={onTabClick}>
      <p className="analytics_tab__tab-title">{title}</p>
      <p className="analytics_tab__tab-value">{analyticsValue}</p>
      <GraphThumbnail
        width={115}
        height={65}
        data={graphData}
        dataKey={dataKey}
        title={title}
      />
    </div>
  );
}

AnalyticsTab.propTypes = {
  tab: PropTypes.shape({
    title: PropTypes.string.isRequired,
    // Represens Y axis values on line graph
    key: PropTypes.string,
  }).isRequired,
  value: PropTypes.string,
  active: PropTypes.bool,
  graphData: PropTypes.array,
  onTabClick: PropTypes.func.isRequired,
};

AnalyticsTab.defaultProps = {
  active: false,
  graphData: [],
  value: '',
};

export default React.memo(AnalyticsTab);
