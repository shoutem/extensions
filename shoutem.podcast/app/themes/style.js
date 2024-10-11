import { Dimensions, Platform } from 'react-native';
import { inverseColorBrightnessForAmount } from '@shoutem/theme';
import {
  createScopedResolver,
  responsiveHeight,
  responsiveWidth,
} from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  [`${ext('ProgressBar')}`]: {
    container: {
      flex: 1,
      height: responsiveHeight(20),
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    progressContainer: {
      height: responsiveHeight(7),
      width: '100%',
      backgroundColor: resolveVariable('progressBarContainerBackgroundColor'),
      borderColor: resolveVariable('progressBarBorderColor'),
      // Somehow we get string value here and then Android crashes if in release mode. Add safeguard...
      borderWidth: parseFloat(resolveVariable('progressBarBorderWidth')),
      padding: responsiveHeight(1),
      borderRadius: responsiveHeight(5),
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    completeProgressBarBackground: {
      backgroundColor: resolveVariable('completeProgressBackgroundColor'),
    },
    progressBar: {
      borderRadius: responsiveHeight(5),
      height: responsiveHeight(5),
    },
  },

  [`${ext('EpisodeProgress')}`]: {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    progressBar: {
      progressContainer: {
        backgroundColor: resolveVariable('progressBarContainerBackgroundColor'),
        borderColor: resolveVariable('progressBarBorderColor'),
        // Somehow we get string value here and then Android crashes if in release mode. Add safeguard...
        borderWidth: parseFloat(resolveVariable('progressBarBorderWidth')),
      },
      completeProgressBarBackground: {
        backgroundColor: resolveVariable('completeProgressBackgroundColor'),
      },
    },
  },

  [`${ext('FeaturedEpisodeView')}`]: {
    imageBackground: {
      width: responsiveWidth(365),
      height: responsiveWidth(345),
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: responsiveWidth(25),
      paddingTop: responsiveHeight(45),
      paddingBottom: responsiveHeight(40),
    },
    episodeInfo: {
      position: 'absolute',
      top: responsiveHeight(5),
      right: responsiveWidth(5),
      textAlign: 'center',
    },
    actionButtonContainer: {
      position: 'absolute',
      top: responsiveHeight(5),
      right: responsiveHeight(5),
    },
    episodeProgressContainer: {
      position: 'absolute',
      bottom: responsiveHeight(10),
      left: responsiveWidth(25),
      right: responsiveWidth(25),
    },
    title: { textAlign: 'center' },
  },

  [`${ext('ListEpisodeView')}`]: {
    episodeTitle: {
      width:
        resolveVariable('sizes.window.width') -
        3 * resolveVariable('mediumGutter') -
        responsiveWidth(65) -
        40,
    },
    episodeProgress: {
      container: { paddingHorizontal: resolveVariable('smallGutter') },
    },
    artwork: {
      width: responsiveWidth(65),
      height: responsiveWidth(65),
      borderRadius: 2,
      borderWidth: 0,
      backgroundColor: inverseColorBrightnessForAmount(
        resolveVariable('paperColor'),
        10,
      ),
    },
  },

  [`${ext('EpisodesLargeGridScreen')}`]: {
    gridRow: {
      paddingTop: responsiveHeight(30),
      paddingRight: 0,
    },
  },

  [`${ext('GridEpisodeView')}`]: {
    image: {
      width: responsiveWidth(180),
      height: responsiveWidth(85),
      backgroundColor: inverseColorBrightnessForAmount(
        resolveVariable('paperColor'),
        10,
      ),
    },
  },

  [`${ext('LargeGridEpisodeView')}`]: {
    image: {
      alignSelf: 'center',
      height:
        Dimensions.get('window').width / 2 -
        2 * resolveVariable('mediumGutter'),
      width:
        Dimensions.get('window').width / 2 -
        2 * resolveVariable('mediumGutter'),
    },
  },

  [`${ext('PodcastPlayer')}`]: {
    container: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      height: responsiveHeight(100),
      backgroundColor: resolveVariable('paperColor'),
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
  },

  [`${ext('PodcastPlaylistPlayer')}`]: {
    podcastEpisodePlayer: {
      container: {
        width: responsiveHeight(50),
        height: responsiveHeight(50),
        borderRadius: responsiveHeight(25),
        backgroundColor: resolveVariable('secondaryButtonBackgroundColor'),
        marginTop: resolveVariable('mediumGutter'),
        alignSelf: 'center',
      },
      spinnerContainer: {
        width: responsiveHeight(50),
        height: responsiveHeight(50),
        borderRadius: responsiveHeight(25),
        backgroundColor: resolveVariable('secondaryButtonBackgroundColor'),
        marginTop: resolveVariable('mediumGutter'),
        alignSelf: 'center',
      },
      icon: {
        color: resolveVariable('secondaryButtonTextColor'),
        width: responsiveHeight(30),
        height: responsiveHeight(30),
      },
    },
  },

  [`${ext('PlayPodcastButton')}`]: {
    playButton: {
      container: {
        position: 'absolute',
        width: responsiveHeight(50),
        height: responsiveHeight(50),
        borderRadius: responsiveHeight(25),
        bottom: responsiveHeight(50),
        right: responsiveHeight(30),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: resolveVariable('controlsContainerBackgroundColor'),
        borderColor: resolveVariable('controlsPrimaryColor'),
        borderWidth: 1,
      },
      spinnerContainer: {
        position: 'absolute',
        width: responsiveHeight(50),
        height: responsiveHeight(50),
        borderRadius: responsiveHeight(25),
        bottom: responsiveHeight(50),
        right: responsiveHeight(30),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: resolveVariable('controlsContainerBackgroundColor'),
        borderColor: resolveVariable('controlsPrimaryColor'),
        borderWidth: 1,
      },
      icon: {
        height: responsiveHeight(30),
        width: responsiveHeight(30),
        color: resolveVariable('controlsPrimaryColor'),
      },
    },
  },

  [`${ext('EpisodeDetailsScreen')}`]: {
    artwork: {
      backgroundColor: inverseColorBrightnessForAmount(
        resolveVariable('paperColor'),
        10,
      ),
      width: Dimensions.get('window').width,
      height: responsiveWidth(280),
    },
  },
});
