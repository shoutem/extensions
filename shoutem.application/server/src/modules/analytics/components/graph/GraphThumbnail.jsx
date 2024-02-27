import React from 'react';
import PropTypes from 'prop-types';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

const DEFAULT_MARGINS = { top: 5, right: 10, left: 10, bottom: 5 };

export function GraphThumbnail(props) {
  const { title, data, dataKey, margins, width, height, lineColor } = props;

  const margin = { ...DEFAULT_MARGINS, ...margins };

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart width={width} height={height} data={data} margin={margin}>
        <Line
          type="linear"
          dot={false}
          strokeWidth={2}
          dataKey={title}
          stroke={lineColor}
          dataKey={dataKey}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

GraphThumbnail.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  margins: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
  }),
  width: PropTypes.number,
  height: PropTypes.number,
  lineColor: PropTypes.string,
  dataKey: PropTypes.string.isRequired,
};

GraphThumbnail.defaultProps = {
  width: 115,
  height: 65,
  lineColor: '#444F6C',
  margins: {},
};

export default React.memo(GraphThumbnail);
