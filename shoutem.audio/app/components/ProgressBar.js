import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import { connectStyle } from '@shoutem/theme';
import { resolveVariable, responsiveHeight, View } from '@shoutem/ui';
import { getSelectedTheme } from 'shoutem.theme/redux/selectors';
import { ext } from '../const';

/**
 * Renders a progress bar component.
 * @param {object} props - The component props.
 * @param {number} props.percentage - The percentage of progress to display.
 * @param {object} props.style - Custom styles to apply.
 * @returns {React.Element} - The rendered component.
 */
export const ProgressBar = ({ percentage, style }) => {
  const [progressContainerWidth, setProgressContainerWidth] = useState(0);

  const theme = useSelector(getSelectedTheme);

  const handleLayout = useCallback(event => {
    setProgressContainerWidth(event.nativeEvent.layout.width);
  }, []);

  /**
   * Calculates the width of the progress bar based on the percentage.
   */
  const progressBarWidthStyle = useMemo(() => {
    return {
      // - (2 * responsiveHeight(1)) because of 1px padding
      width:
        (percentage * progressContainerWidth) / 100 - 2 * responsiveHeight(1),
    };
  }, [percentage, progressContainerWidth]);

  const getBackgroundColor = () => {
    let baseColor = style.completeProgressBarBackground.backgroundColor;

    // Workaround until we change featured color to something other than #FFF in Rose theme...
    if (theme.name === 'RubiconRose' && baseColor === 'rgb(255, 255, 255)')
      baseColor = resolveVariable('secondaryButtonBackgroundColor');

    const colorInstance = tinycolor(baseColor);

    // Darken completed tracks for better distinction.
    if (percentage === 100) {
      return colorInstance.darken(10).toString();
    }

    // Adjust the shade of progress bar color on the percentage
    return colorInstance.lighten((100 - percentage) * 0.1).toString();
  };

  return (
    <View style={style.container}>
      {percentage > 0 && (
        <View onLayout={handleLayout} style={style.progressContainer}>
          <View
            style={[
              progressBarWidthStyle,
              style.progressBar,
              { backgroundColor: getBackgroundColor() },
            ]}
          />
        </View>
      )}
    </View>
  );
};

ProgressBar.propTypes = {
  percentage: PropTypes.number,
  style: PropTypes.object,
};

ProgressBar.defaultProps = {
  percentage: undefined,
  style: {},
};

export default connectStyle(ext('ProgressBar'))(React.memo(ProgressBar));
