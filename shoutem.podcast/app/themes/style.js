import { Dimensions, Platform } from 'react-native';
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

  [`${ext('PlaybackIcon')}`]: {
    icon: {
      color: resolveVariable('episodeProgressPlaybackIconColor'),
      width: responsiveHeight(20),
      marginRight: responsiveWidth(10),
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
    playbackIcon: {
      icon: {
        color: resolveVariable('featuredEpisodeProgressPlaybackIconColor'),
      },
    },
  },

  [`${ext('ListEpisodeView')}`]: {
    episodeTitle: {
      width:
        resolveVariable('sizes.window.width') -
        3 * resolveVariable('mediumGutter') -
        responsiveWidth(65) -
        30,
    },
    episodeProgress: {
      container: { paddingHorizontal: resolveVariable('mediumGutter') },
    },
  },

  [`${ext('EpisodesLargeGridScreen')}`]: {
    gridRow: {
      paddingTop: responsiveHeight(30),
      paddingRight: 0,
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
      resizeMode: 'contain',
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

  [`${ext('PodcastEpisodePlayer')}`]: {
    button: {
      height: responsiveHeight(50),
      width: responsiveHeight(50),
      borderRadius: responsiveHeight(25),
      backgroundColor: resolveVariable('secondaryButtonBackgroundColor'),
      marginTop: resolveVariable('mediumGutter'),
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      color: resolveVariable('secondaryButtonTextColor'),
      width: responsiveHeight(30),
      height: responsiveHeight(30),
    },
  },

  [`${ext('ContinuePlayingButton')}`]: {
    button: {
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
});
