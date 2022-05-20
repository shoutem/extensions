import { Platform } from 'react-native';
import { changeColorAlpha } from '@shoutem/theme';
import {
  createScopedResolver,
  Device,
  dimensionRelativeToIphone,
} from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.podcast.FeaturedEpisodeView': {
    downloadManagerButton: {
      position: 'absolute',
      top: 5,
      right: 5,
    },
  },

  'shoutem.podcast.ListEpisodeView': {
    episodeTitle: {
      width:
        resolveVariable('sizes.window.width') -
        3 * resolveVariable('mediumGutter') -
        dimensionRelativeToIphone(65) -
        30,
    },
  },

  'shoutem.podcast.EpisodesLargeGridScreen': {
    gridRow: {
      paddingLeft: 25,
      paddingTop: 30,
    },
  },

  'shoutem.podcast.LargeGridEpisodeView': {
    'shoutem.ui.TouchableOpacity': {
      'shoutem.ui.Card': {
        'shoutem.ui.Image': {
          height: dimensionRelativeToIphone(145),
          width: dimensionRelativeToIphone(145),
        },
        'shoutem.ui.View': {
          backgroundColor: 'transparent',
          paddingHorizontal: 0,
          paddingBottom: 0,
          width: dimensionRelativeToIphone(145),
        },

        backgroundColor: 'transparent',
      },
    },
  },

  'shoutem.podcast.PodcastPlayer': {
    container: {
      paddingBottom: Device.select({
        iPhoneX: resolveVariable('sizes.iphone.X.notchPadding'),
        iPhoneXR: resolveVariable('sizes.iphone.XR.notchPadding'),
        default: 0,
      }),
    },
    slider: {
      height: 30,
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
      marginVertical: 5,
    },
    skipButton: {
      width: 30,
      height: 30,
      padding: 0,
    },
    skipIcon: {
      color: resolveVariable('primaryButtonText.color'),
    },
    skipIconSize: 30,
    timeDisplay: {
      lineHeight: 15,
      fontSize: 12,
    },
    playbackButtonStyle: {
      padding: 0,
      margin: 0,
      marginLeft: 10,
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    playbackIconStyle: {
      height: 45,
      width: 45,
      padding: 0,
      margin: 0,
    },
    spinnerStyle: {
      size: 45,
    },
  },
});
