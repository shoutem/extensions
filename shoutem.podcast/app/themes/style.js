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

  [`${ext('EpisodeDetailsScreen')}`]: {
    container: {
      flex: 1,
      // Add padding because PodcastPlayer is position absolutely, so that screen content doesn't go under it.
      // PodcastPlayer height 100 + bottom padding 15 + top padding 5 - details screen content (we want content
      // to disappear as it touches player's border, not X pixel before)
      paddingBottom:
        responsiveHeight(100) +
        resolveVariable('mediumGutter') +
        resolveVariable('smallGutter') -
        resolveVariable('mediumGutter'),
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
    controls: { marginTop: responsiveHeight(-20) },
    spinnerContainer: {
      height: responsiveHeight(45),
      width: responsiveHeight(45),
      justifyContent: 'center',
      alignItems: 'center',
    },
    playbackIcon: {
      icon: { height: responsiveHeight(45), width: responsiveHeight(45) },
    },
    disabledJumpTimeIcon: {
      container: { opacity: 0.5 },
    },
  },
});
