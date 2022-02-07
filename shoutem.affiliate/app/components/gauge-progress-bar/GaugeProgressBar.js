import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ext } from '../../const';
import LevelIcon from './LevelIcon';
import {
  getFullCircleCircumference,
  getGaugeCircleCircumference,
  getLevelIconCoordinates,
  getProgressCircleCircumference,
} from './progressBar';

export function GaugeProgressBar(props) {
  const {
    progressValue,
    maxValue,
    height,
    width,
    radius,
    levels,
    style,
  } = props;

  const {
    progressRadius,
    progressContainer: { width: progressWidth },
  } = style;

  const fullCircleCircumference = getFullCircleCircumference(radius);
  const gaugeCircleCircumference = getGaugeCircleCircumference(radius);
  const progressCircleCircumference = getProgressCircleCircumference(
    progressValue,
    maxValue,
    gaugeCircleCircumference,
  );

  const cx = width / 2;
  const cy = height / 2;
  const viewBox = `0 0 ${height} ${width}`;
  const gaugeStrokeDasharray = [
    gaugeCircleCircumference,
    fullCircleCircumference,
  ];
  const progressStrokeDasharray = [
    progressCircleCircumference,
    fullCircleCircumference,
  ];

  function getLevelIconStyle(level) {
    return {
      ...getLevelIconCoordinates(
        level,
        maxValue,
        progressWidth,
        progressRadius,
      ),
      ...style.level,
    };
  }

  return (
    <View style={style.container} styleName="vertical v-center h-center">
      <Svg style={style.progressContainer} viewBox={viewBox}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          strokeDasharray={gaugeStrokeDasharray}
          strokeDashoffset={0}
          {...style.progressBar}
        />
        {progressCircleCircumference > 0 && (
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            strokeDasharray={progressStrokeDasharray}
            strokeDashoffset="100%"
            {...style.progressBarCompleted}
          />
        )}
      </Svg>
      {!_.isEmpty(levels) && (
        <View key="levels" styleName="fill-parent">
          {_.map(levels, level => (
            <LevelIcon
              containerStyle={getLevelIconStyle(level)}
              key={level.id}
              levelReached={level.pointsRequired <= progressValue}
            />
          ))}
        </View>
      )}
    </View>
  );
}

GaugeProgressBar.propTypes = {
  height: PropTypes.number.isRequired,
  levels: PropTypes.array.isRequired,
  maxValue: PropTypes.number.isRequired,
  progressValue: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
};

export default connectStyle(ext('GaugeProgressBar'))(GaugeProgressBar);
