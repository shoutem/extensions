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
    disabled: { opacity: 0.5 },
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
    disabled: { opacity: 0.5 },
  },

  [`${ext('AudioBanner')}`]: {
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
    progressBarBottom: {
      container: {
        bottom: 0,
      },
    },
    progressBarBottomWithPadding: {
      container: { bottom: responsiveHeight(30) },
    },
  },

  [`${ext('TrackProgressBar')}`]: {
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: responsiveHeight(5),
    },
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
    skipToPrevButton: {
      marginLeft: resolveVariable('mediumGutter'),
      transform: [{ rotate: '180deg' }],
    },
    skipToNextButton: { marginRight: resolveVariable('mediumGutter') },
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

  [`${ext('AudioModal')}`]: {
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

  [`${ext('RadioOption')}`]: {
    icon: {
      width: responsiveHeight(18),
      height: responsiveHeight(18),
      color: resolveVariable('playerModalControlsColor'),
    },
    radioOutterCircle: {
      borderColor: resolveVariable('playerModalControlsColor'),
      borderWidth: 1,
      borderRadius: responsiveHeight(8),
      width: responsiveHeight(16),
      height: responsiveHeight(16),
      justifyContent: 'center',
      alignItems: 'center',
      color: resolveVariable('playerModalControlsColor'),
    },
    radioInnerCircle: {
      width: responsiveHeight(9),
      height: responsiveHeight(9),
      borderRadius: responsiveHeight(5),
      backgroundColor: resolveVariable('playerModalControlsColor'),
    },
  },

  [`${ext('SettingsModal')}`]: {
    modal: {
      margin: 0,
      justifyContent: 'flex-end',
      marginBottom: responsiveHeight(50),
      paddingHorizontal: responsiveWidth(20),
    },
    bottomSheetHeight: { height: responsiveHeight(450) },
    headerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: responsiveHeight(40),
    },
    headerBackButton: {
      position: 'absolute',
      left: 0,
    },
    headerBackIcon: { color: resolveVariable('playerModalControlsColor') },
  },

  [`${ext('SleepTimerSettingsView')}`]: {
    turnOffTimerButton: {
      width: responsiveWidth(200),
      height: responsiveHeight(50),
      backgroundColor: resolveVariable('playerModalControlsColor'),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      alignSelf: 'center',
      marginTop: responsiveHeight(50),
      marginBottom: responsiveHeight(20),
    },
    turnOffText: {
      color: resolveVariable('playerModalBackgroundColor'),
      fontWeight: resolveFontWeight('500'),
    },
    turnOffCaption: { color: resolveVariable('playerModalBackgroundColor') },
  },

  [`${ext('SleepTimer')}`]: {
    container: {
      position: 'absolute',
      top: responsiveHeight(-15),
      right: responsiveWidth(5),
      backgroundColor: resolveVariable('playerBannerIconsColor'),
      width: responsiveHeight(30),
      height: responsiveHeight(30),
      borderRadius: responsiveHeight(8),
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: responsiveHeight(15),
      height: responsiveHeight(15),
      color: resolveVariable('playerBannerBackgroundColor'),
    },
    text: {
      fontSize: responsiveHeight(8),
      fontWeight: resolveFontWeight('500'),
      color: resolveVariable('playerBannerBackgroundColor'),
    },
  },

  [`${ext('PlaybackSettings')}`]: {
    icon: {
      color: resolveVariable('playerModalCloseIconColor'),
    },
  },

  [`${ext('SettingsOption')}`]: {
    icon: {
      width: responsiveHeight(20),
      height: responsiveHeight(20),
      color: resolveVariable('playerModalControlsColor'),
    },
    text: { color: resolveVariable('playerModalControlsColor') },
    arrowIcon: { color: resolveVariable('playerModalControlsColor') },
  },

  [`${ext('PlaybackSpeedOption')}`]: {
    optionText: {
      color: resolveVariable('playerModalControlsColor'),
    },
  },

  [`${ext('SkipTrackControl')}`]: {
    disabled: { opacity: 0.5 },
    skipIcon: {
      color: resolveVariable('playerModalControlsColor'),
      height: responsiveHeight(40),
      width: responsiveHeight(40),
    },
  },

  [`${ext('Header')}`]: {
    closeModalIcon: {
      color: resolveVariable('playerModalCloseIconColor'),
      width: responsiveHeight(30),
      height: responsiveHeight(30),
    },
    titleContainer: { width: '80%' },
    title: {
      color: resolveVariable('playerModalTitleColor'),
      alignSelf: 'center',
    },
    liveStreamText: {
      textAlign: 'center',
      fontWeight: resolveFontWeight('400'),
      color: resolveVariable('playerModalSubtitleColor'),
      marginBottom: resolveVariable('largeGutter'),
    },
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
  },

  [`${ext('AudioPlayerView')}`]: {
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

  [`${ext('AnimatedAudioBars')}`]: {
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: responsiveHeight(15),
    },
    bar: {
      width: responsiveWidth(4),
      backgroundColor: resolveVariable('playerModalControlsColor'),
      marginHorizontal: responsiveWidth(1),
    },
  },

  [`${ext('QueueList')}`]: {
    container: { width: '100%' },
  },

  [`${ext('QueueListItem')}`]: {
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: resolveVariable('smallGutter'),
      marginHorizontal: resolveVariable('mediumGutter'),
    },
    image: {
      width: responsiveHeight(40),
      height: responsiveHeight(40),
      borderRadius: 6,
    },
    title: {
      fontWeight: resolveFontWeight('500'),
      marginBottom: resolveVariable('smallGutter'),
      color: resolveVariable('playerModalMetadataTextColor'),
    },
    artist: {
      marginBottom: resolveVariable('smallGutter'),
      color: resolveVariable('playerModalMetadataTextColor'),
    },
    playbackButton: {
      borderColor: resolveVariable('playerModalControlsColor'),
      borderRadius: responsiveHeight(10),
      width: responsiveHeight(20),
      height: responsiveHeight(20),
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: resolveVariable('mediumGutter'),
    },
    playbackButtonBorder: { borderWidth: 1 },
    playbackIcon: {
      color: resolveVariable('playerModalControlsColor'),
      width: responsiveHeight(18),
      height: responsiveHeight(18),
    },
  },
  [`${ext('NowPlayingHeader')}`]: {
    listTitle: {
      color: resolveVariable('playerModalTitleColor'),
      fontWeight: resolveFontWeight('500'),
    },
    bottomMargin: { marginBottom: resolveVariable('smallGutter') },
    dividerShadow: {
      shadowColor: '#222',
      shadowOffset: { width: 1, height: 1 },
      shadowRadius: 3,
      shadowOpacity: 1,
      marginHorizontal: responsiveWidth(-10),
    },
    queuePositionCaption: {
      color: resolveVariable('playerModalTitleColor'),
      lineHeight: responsiveHeight(30),
      fontWeight: resolveFontWeight('500'),
    },
    progressBar: {
      container: { bottom: 0 },
      progressContainer: {
        height: responsiveHeight(2),
        borderWidth: 0,
        backgroundColor: resolveVariable('playerModalBackgroundColor'),
        paddingHorizontal: resolveVariable('mediumGutter'),
        marginTop: responsiveHeight(10),
      },
      completeProgressBarBackground: {
        backgroundColor: resolveVariable('playerModalMetadataTextColor'),
      },
    },
  },

  [`${ext('QueueListHeader')}`]: {
    title: {
      fontWeight: resolveFontWeight('500'),
      marginVertical: resolveVariable('mediumGutter'),
      color: resolveVariable('playerModalTitleColor'),
    },
  },
});
