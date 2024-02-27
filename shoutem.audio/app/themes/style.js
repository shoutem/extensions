import { Platform } from 'react-native';
import { changeColorAlpha } from '@shoutem/theme';
import { createScopedResolver, responsiveHeight } from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  [`${ext('ProgressControl')}`]: {
    timeDisplay: {
      lineHeight: responsiveHeight(15),
      fontSize: responsiveHeight(12),
    },
    slider: {
      height: responsiveHeight(30),
      marginVertical: responsiveHeight(5),
    },
    sliderColors: {
      minimumTrackTintColor: changeColorAlpha(
        resolveVariable('primaryButtonText.color'),
        0.6,
      ),
      maximumTrackTintColor: changeColorAlpha(
        resolveVariable('primaryButtonText.color'),
        0.4,
      ),
      thumbTintColor: Platform.select({
        android: resolveVariable('primaryButtonText.color'),
      }),
    },
  },

  [`${ext('JumpTimeControl')}`]: {
    container: {
      width: responsiveHeight(30),
      height: responsiveHeight(30),
      padding: 0,
    },
    icon: {
      color: resolveVariable('primaryButtonText.color'),
      margin: 0,
    },
  },

  [`${ext('PlaybackControl')}`]: {
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: responsiveHeight(45),
      height: responsiveHeight(45),
    },
  },
});
