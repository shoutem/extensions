import React from 'react';
import PropTypes from 'prop-types';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const DEFAULT_CHART_MARGINS = { top: 40, bottom: 5, right: 5 };
const DEFAULT_AXIS_PADDING = { left: 20, right: 20 };
const DEFAULT_AXIS_TICK = { fontSize: 12 };
const DOT_STYLE = { strokeWidth: 1, r: 4 };
const ACTIVE_DOT_STYLE = { stroke: '#00AADF' };

export default function Graph({
  data,
  containerWidth,
  containerHeight,
  graphWidth,
  graphHeight,
  lineDataKey,
  label,
  xAxisProps,
  yAxisProps,
  isAnimationActive,
}) {
  return (
    <ResponsiveContainer width={containerWidth} height={containerHeight}>
      <LineChart
        width={graphWidth}
        height={graphHeight}
        data={data}
        margin={DEFAULT_CHART_MARGINS}
      >
        <XAxis
          tickSize={1}
          tickMargin={10}
          stroke="#A3A3A3"
          padding={DEFAULT_AXIS_PADDING}
          tick={DEFAULT_AXIS_TICK}
          {...xAxisProps}
        />
        <YAxis
          tickSize={1}
          tickMargin={10}
          stroke="#A3A3A3"
          padding={DEFAULT_AXIS_PADDING}
          tick={DEFAULT_AXIS_TICK}
          {...yAxisProps}
        />
        <Tooltip />
        <Line
          type="linear"
          animationDuration={500}
          strokeWidth={3}
          dataKey={lineDataKey}
          name={label}
          stroke="#00AADF"
          yAxisId={0}
          dot={DOT_STYLE}
          activeDot={ACTIVE_DOT_STYLE}
          isAnimationActive={isAnimationActive}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

Graph.propTypes = {
  data: PropTypes.array.isRequired,
  /**
   * Widths and heights can either be percentages or number of pixels
   */
  containerWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  containerHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  graphWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  graphHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  xAxisProps: PropTypes.shape({
    // Defines X Axis labels, should represent a key value found in data
    dateKey: PropTypes.string,
    tickSize: PropTypes.number,
  }),
  yAxisProps: PropTypes.shape({
    dateKey: PropTypes.string,
    tickSize: PropTypes.number,
  }),
  tooltip: PropTypes.node,
  // Defines which value should be Y axis
  lineDataKey: PropTypes.string.isRequired,
  label: PropTypes.string,
  isAnimationActive: PropTypes.bool,
};

Graph.defaultProps = {
  containerWidth: '100%',
  containerHeight: 400,
  graphWidth: '100%',
  graphHeight: 400,
  xAxisProps: { dataKey: 'date' },
  yAxisProps: {},
  tooltip: undefined,
  label: '',
  isAnimationActive: true,
};
