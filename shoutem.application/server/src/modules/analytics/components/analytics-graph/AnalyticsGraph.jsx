import React from 'react';
import PropTypes from 'prop-types';
import AnalyticsPlatformPercents from '../analytics-platform-percents';
import Graph from '../graph';
import './style.scss';

export default function AnalyticsGraph(props) {
  const {
    graphData,
    lineDataKey,
    label,
    xAxisProps,
    analyticsPercentages,
    showAnalyticsPercentsBadge,
    isAnimationActive,
  } = props;

  return (
    <div className="analytics-graph__container">
      <Graph
        data={graphData}
        lineDataKey={lineDataKey}
        label={label}
        xAxisProps={xAxisProps}
        isAnimationActive={isAnimationActive}
      />
      {showAnalyticsPercentsBadge && (
        <div className="analytics-graph__badge-container">
          <AnalyticsPlatformPercents
            androidPercent={analyticsPercentages.androidPercent}
            iosPercent={analyticsPercentages.iosPercent}
          />
        </div>
      )}
    </div>
  );
}

AnalyticsGraph.propTypes = {
  graphData: PropTypes.array.isRequired,
  lineDataKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  xAxisProps: PropTypes.object.isRequired,
  analyticsPercentages: PropTypes.object,
  showAnalyticsPercentsBadge: PropTypes.bool,
  isAnimationActive: PropTypes.bool,
};

AnalyticsGraph.defaultProps = {
  showAnalyticsPercentsBadge: true,
  isAnimationActive: true,
};
