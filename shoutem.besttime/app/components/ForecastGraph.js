import React, { PureComponent } from 'react';
import { LayoutAnimation } from 'react-native';
import { uses24HourClock } from 'react-native-localize';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Spinner, Subtitle, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { isIos } from 'shoutem-core';
import {
  ext,
  NO_DATA_FOUND_ERROR,
  NO_LIVE_DATA_FOUND_ERROR,
  SHOWN_X_INDEXES,
  X_AXIS_DATA,
} from '../const';

export class ForecastGraph extends PureComponent {
  static propTypes = {
    liveBusyness: PropTypes.number.isRequired,
    liveForecast: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    newForecast: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    rawLiveForecast: PropTypes.array.isRequired,
    rawDayForecast: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidUpdate(prevProps) {
    const { forecastsLoading } = this.props;

    if (prevProps.forecastsLoading !== forecastsLoading) {
      LayoutAnimation.easeInEaseOut();
    }
  }

  formatXLabel(value, index) {
    if (SHOWN_X_INDEXES.includes(index)) {
      const isPm = index > 12;
      const resolvedIndex = isPm ? index - 12 : index;

      if (uses24HourClock()) {
        return `${index}h`;
      }

      return `${resolvedIndex}${isPm ? 'PM' : 'AM'}`;
    }

    return '';
  }

  shouldShowError() {
    const { liveForecast, newForecast } = this.props;

    return (
      (liveForecast && liveForecast.error === NO_LIVE_DATA_FOUND_ERROR) ||
      (newForecast && newForecast.error === NO_DATA_FOUND_ERROR)
    );
  }

  getErrorMessage() {
    const { liveForecast, newForecast } = this.props;

    if (!liveForecast || !newForecast) {
      return null;
    }

    const { unavailable: liveUnavailable } = liveForecast;
    const { unavailable: newUnavailable } = newForecast;

    if (liveUnavailable || newUnavailable) {
      return I18n.t(ext('besttimeServiceUnavailable'));
    }

    const { error: liveError } = liveForecast;
    const { error: newError } = newForecast;

    if (liveError && newError) {
      return I18n.t(ext('noDataAvailableMessage'));
    }

    if (liveError) {
      return I18n.t(ext('noLiveDataMessage'));
    }

    return I18n.t(ext('noForecastDataMessage'));
  }

  render() {
    const {
      forecastsLoading,
      liveBusyness,
      rawLiveForecast,
      rawDayForecast,
      style,
    } = this.props;

    const yMax = Math.max(Math.ceil(liveBusyness / 50) * 50, 100);
    const numberOfTicks = yMax / 50;

    return (
      <View styleName="vertical h-center">
        <View styleName="horizontal">
          <YAxis
            data={[0, yMax]}
            svg={style.yAxisSvg}
            numberOfTicks={numberOfTicks}
            style={style.yAxis}
            max={yMax}
            min={0}
            contentInset={style.yAxisContentInsets}
          />
          <View>
            <BarChart
              animate={isIos}
              animationDuration={200}
              data={rawDayForecast}
              contentInset={style.chartContentInsets}
              style={style.rawBarChart}
              spacingInner={0.15}
              svg={{ fill: style.forecastColor }}
              numberOfTicks={numberOfTicks}
              yMax={yMax}
              yMin={0}
            >
              <Grid />
            </BarChart>
            <BarChart
              animate={isIos}
              animationDuration={200}
              data={rawLiveForecast}
              contentInset={style.chartContentInsets}
              style={style.liveBarChart}
              spacingInner={0.15}
              svg={{ fill: style.liveColor }}
              yMax={yMax}
              yMin={0}
            />
            <XAxis
              data={X_AXIS_DATA}
              svg={style.xAxisSvg}
              style={style.xAxis}
              formatLabel={this.formatXLabel}
            />
          </View>
        </View>
        {this.shouldShowError() && !forecastsLoading && (
          <Subtitle styleName="lg-gutter-top">
            {this.getErrorMessage()}
          </Subtitle>
        )}
        {forecastsLoading && (
          <View styleName="overlaid">
            <Spinner />
          </View>
        )}
      </View>
    );
  }
}

export default connectStyle(ext('ForecastGraph'))(ForecastGraph);
