import { Dimensions, Platform } from 'react-native';
import { changeColorAlpha } from '@shoutem/theme';
import {
  createScopedResolver,
  resolveFontWeight,
  responsiveHeight,
  responsiveWidth,
} from '@shoutem/ui';
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
    disabled: { opacity: 0.5 },
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
    spinnerContainer: {
      width: responsiveHeight(45),
      height: responsiveHeight(45),
      justifyContent: 'center',
      alignItems: 'center',
    },
  },

  [`${ext('AudioPlayerBanner')}`]: {
    playerContainer: {
      height: responsiveHeight(60),
      width: '100%',
      backgroundColor: resolveVariable('playerBannerBackgroundColor'),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: resolveVariable('mediumGutter'),
      paddingVertical: responsiveHeight(5),
      shadowColor: resolveVariable('playerBannerBackgroundColor'),
      shadowOffset: { width: 1, height: 2 },
      shadowRadius: 40,
      shadowOpacity: 1,
    },
    playerContainerWithPadding: {
      height: responsiveHeight(100),
      paddingBottom: responsiveHeight(40),
    },
    playbackControl: {
      container: {
        marginHorizontal: responsiveWidth(10),
        marginVertical: 0,
        width: responsiveHeight(25),
        height: responsiveHeight(25),
      },
      icon: { color: resolveVariable('playerBannerIconsColor') },
    },
    closeIcon: { color: resolveVariable('playerBannerIconsColor') },
  },

  [`${ext('BannerProgressBar')}`]: {
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: responsiveHeight(5),
    },
    containerBottom: {
      bottom: 0,
    },
    containerBottomWithPadding: { bottom: responsiveHeight(30) },
    progressContainer: {
      height: responsiveHeight(2),
      borderWidth: 0,
      backgroundColor: resolveVariable('playerBannerBackgroundColor'),
    },
    progressBar: { height: responsiveHeight(2), borderWidth: 0 },
    completeProgressBarBackground: {
      backgroundColor: resolveVariable('playerBannerMetadataTextColor'),
    },
  },

  [`${ext('Metadata')}`]: {
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      maxWidth: '80%',
      paddingVertical: responsiveHeight(3),
    },
    artworkContainer: { marginRight: resolveVariable('mediumGutter') },
    artwork: {
      width: responsiveHeight(40),
      height: responsiveHeight(40),
      borderRadius: 5,
    },
    textContainer: { justifyContent: 'flex-end' },
    trackInfoContainer: { justifyContent: 'center' },
    title: {
      fontSize: responsiveHeight(15),
      fontWeight: resolveFontWeight('500'),
      color: resolveVariable('playerBannerMetadataTextColor'),
    },
    subtitle: {
      fontSize: responsiveHeight(12),
      color: resolveVariable('playerBannerMetadataTextColor'),
    },
  },

  [`${ext('TrackAudioControls')}`]: {
    playbackButton: {
      spinnerContainer: {
        height: responsiveHeight(70),
        width: responsiveHeight(70),
        justifyContent: 'center',
        alignItems: 'center',
      },
      icon: { height: responsiveHeight(70), width: responsiveHeight(70) },
    },
  },

  [`${ext('LiveStreamAudioControls')}`]: {
    playbackButton: {
      spinnerContainer: {
        height: responsiveHeight(70),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      icon: { height: responsiveHeight(70), width: responsiveHeight(70) },
    },
  },

  [`${ext('AudioPlayerModal')}`]: {
    modal: {
      margin: 0,
    },
    screenContainer: {
      backgroundColor: resolveVariable('playerModalBackgroundColor'),
      paddingTop:
        Platform.OS === 'ios' ? responsiveHeight(70) : responsiveHeight(30),
      paddingBottom:
        Platform.OS === 'ios' ? responsiveHeight(40) : responsiveHeight(20),
      paddingHorizontal: responsiveWidth(10),
      borderRadius: Platform.OS === 'ios' ? 30 : 0,
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    title: {
      color: resolveVariable('playerModalTitleColor'),
      paddingHorizontal: responsiveWidth(50),
    },
    liveStreamText: {
      fontWeight: resolveFontWeight('400'),
      color: resolveVariable('playerModalSubtitleColor'),
    },
    closeModalButton: {
      position: 'absolute',
      left: responsiveWidth(10),
      top: 0,
    },
    closeModalIcon: {
      color: resolveVariable('playerModalCloseIconColor'),
      width: responsiveHeight(30),
      height: responsiveHeight(30),
    },
    metadata: {
      container: {
        flex: 1,
        maxWidth: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingVertical: responsiveHeight(3),
      },
      animatedText: { containerMaxHeight: { maxHeight: responsiveHeight(30) } },
      artworkContainer: {
        shadowColor: '#222',
        shadowOffset: { width: 1, height: 2 },
        shadowRadius: 5,
        shadowOpacity: 1,
        marginRight: 0,
      },
      artwork: {
        width: Dimensions.get('window').width - responsiveHeight(30),
        height: Dimensions.get('window').width - responsiveHeight(30),
        marginBottom: responsiveHeight(30),
        marginRight: 0,
        borderRadius: 20,
      },
      trackInfoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },

      title: {
        fontSize: responsiveHeight(22),
        fontWeight: resolveFontWeight('500'),
        alignSelf: 'flex-start',
        paddingHorizontal: responsiveWidth(10),
        color: resolveVariable('playerModalMetadataTextColor'),
      },
      titleMaxHeight: { maxHeight: responsiveHeight(30) },
      subtitle: {
        fontSize: responsiveHeight(15),
        fontWeight: resolveFontWeight('500'),
        alignSelf: 'flex-start',
        paddingHorizontal: responsiveWidth(10),
        color: resolveVariable('playerModalMetadataTextColor'),
      },
    },
    controls: {
      jumpTimeBackwardControl: {
        icon: { color: resolveVariable('playerModalControlsColor') },
      },
      jumpTimeForwardControl: {
        icon: { color: resolveVariable('playerModalControlsColor') },
      },
      playbackButton: {
        icon: { color: resolveVariable('playerModalControlsColor') },
      },
    },
  },

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
      backgroundColor: resolveVariable('paperColor'),
      borderColor: resolveVariable('backgroundColor'),
      borderWidth: 0.2,
      padding: responsiveHeight(1),
      borderRadius: responsiveHeight(5),
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    completeProgressBarBackground: {
      backgroundColor: resolveVariable('featuredColor'),
    },
    progressBar: {
      borderRadius: responsiveHeight(5),
      height: responsiveHeight(5),
    },
  },
});
