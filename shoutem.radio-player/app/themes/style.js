import { Platform, StyleSheet } from 'react-native';
import { changeColorAlpha, getSizeRelativeToReference } from '@shoutem/theme';
import {
  createScopedResolver,
  dimensionRelativeToIphone,
  resolveFontFamily,
  resolveFontWeight,
} from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.radio-player.RadioPlayer': {
    clearRow: {
      backgroundColor: 'transparent',
      width: resolveVariable('sizes.window.width'),
      paddingBottom: getSizeRelativeToReference(
        resolveVariable('largeGutter'),
        812,
        resolveVariable('sizes.window.height'),
      ),
      paddingHorizontal: getSizeRelativeToReference(
        resolveVariable('largeGutter'),
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    nowPlaying: {
      backgroundColor: 'transparent',
      position: 'absolute',
      bottom: 0,
    },
    nowPlayingText: {
      color: resolveVariable('imageOverlayTextColor'),
      paddingBottom:
        getSizeRelativeToReference(
          resolveVariable('smallGutter'),
          812,
          resolveVariable('sizes.window.height'),
        ) * 2,
      fontSize: 15,
    },
    overlayStyle: {
      ...StyleSheet.absoluteFill,
      paddingTop: 0,
      paddingBottom: 0,
      marginBottom: 0,
    },
    streamTitle: {
      color: resolveVariable('streamTitleColor'),
      fontSize: 15,
    },
    hiddenImage: {
      opacity: 0,
    },
    playbackButton: {
      width: dimensionRelativeToIphone(75),
      height: dimensionRelativeToIphone(75),
      fontSize: dimensionRelativeToIphone(36),
      borderRadius: 200,
      padding: 0,
    },
    playbackMainCircle: {
      width: dimensionRelativeToIphone(150),
      height: dimensionRelativeToIphone(150),
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderColor: resolveVariable('primaryButtonBackgroundColor'),
      borderWidth: 2,
      position: 'absolute',
      left: -dimensionRelativeToIphone(37.5),
      top: -dimensionRelativeToIphone(37.5),
      borderRadius: 200,
    },
    playbackIcon: {
      width: dimensionRelativeToIphone(36),
      height: dimensionRelativeToIphone(36),
      marginLeft: getSizeRelativeToReference(
        10,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    spinner: {
      size: Platform.select({
        ios: 0,
        default: getSizeRelativeToReference(
          18,
          812,
          resolveVariable('sizes.window.height'),
        ),
      }),
    },
    artistName: {
      color: resolveVariable('imageOverlayTextColor'),
      fontFamily: resolveFontFamily(
        resolveVariable('text.fontFamily'),
        '700',
        resolveVariable('text.fontStyle'),
      ),
      fontWeight: resolveFontWeight('bold'),
      fontSize: 14,
    },
    songName: {
      color: resolveVariable('imageOverlayTextColor'),
      fontSize: 15,
    },
    activeSleepIconFill: resolveVariable('featuredColor'),
    inactiveSleepIconFill: resolveVariable('navBarIconsColor'),
  },

  'shoutem.radio-player.ArtworkRadioScreen': {
    screen: {
      backgroundColor: resolveVariable('screenBackgroundColor'),
    },
    radioPlayer: {
      playbackMainCircle: {
        borderColor: resolveVariable('playbackAnimatedCircleColor'),
      },
      playbackButton: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: resolveVariable('playbackButtonBorderColor'),
      },
      playbackIcon: { color: resolveVariable('playbackIconColor') },
      spinner: { color: '#bbbbbb', margin: 0 },
    },
    artistTitle: {
      color: resolveVariable('artistTitleColor'),
      fontWeight: '700',
      marginHorizontal: getSizeRelativeToReference(
        resolveVariable('mediumGutter'),
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    songNameTitle: {
      color: resolveVariable('songNameTitleColor'),
    },
    shareButton: {
      paddingHorizontal: getSizeRelativeToReference(
        resolveVariable('smallGutter'),
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    blurRadius: 7,
    overlay: {
      backgroundColor: changeColorAlpha(
        resolveVariable('tagOverlayColor'),
        0.5,
      ),
    },
    streamTitleContainer: {
      alignItems: 'flex-end',
      display: 'flex',
      position: 'absolute',
      top:
        resolveVariable('sizes.window.height') / 2 -
        getSizeRelativeToReference(
          250,
          812,
          resolveVariable('sizes.window.height'),
        ) -
        getSizeRelativeToReference(
          40,
          812,
          resolveVariable('sizes.window.height'),
        ) +
        getSizeRelativeToReference(
          resolveVariable('extraLargeGutter'),
          812,
          resolveVariable('sizes.window.height'),
        ),
    },
    streamTitle: {
      color: resolveVariable('streamTitleColor'),
      fontWeight: '700',
    },
    artworkContainer: {
      position: 'absolute',
      top:
        resolveVariable('sizes.window.height') / 2 -
        getSizeRelativeToReference(
          250,
          812,
          resolveVariable('sizes.window.height'),
        ) /
          2,
      width: getSizeRelativeToReference(
        250,
        812,
        resolveVariable('sizes.window.height'),
      ),
      height: getSizeRelativeToReference(
        250,
        812,
        resolveVariable('sizes.window.height'),
      ),
      overflow: 'hidden',
    },
    artworkCircularImage: {
      width: getSizeRelativeToReference(
        245,
        812,
        resolveVariable('sizes.window.height'),
      ),
      height: getSizeRelativeToReference(
        245,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderRadius: getSizeRelativeToReference(
        245 / 2,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderColor: changeColorAlpha(
        resolveVariable('secondaryButtonBackgroundColor'),
        0.4,
      ),
      borderWidth: resolveVariable('smallGutter'),
    },
    playbackButton: {
      opacity: 0.7,
    },
    playbackMainCircle: {
      borderColor: resolveVariable('secondaryButtonBackgroundColor'),
    },
    nowPlayingContainer: {
      position: 'absolute',
      bottom: getSizeRelativeToReference(
        125,
        812,
        resolveVariable('sizes.window.height'),
      ),
      height: getSizeRelativeToReference(
        40,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    nowPlayingContainerTabBar: {
      position: 'absolute',
      bottom: getSizeRelativeToReference(
        170,
        812,
        resolveVariable('sizes.window.height'),
      ),
      height: getSizeRelativeToReference(
        40,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    sleepTimerActiveText: {
      color: resolveVariable('featuredColor'),
    },
    smallActionButton: {
      paddingHorizontal: getSizeRelativeToReference(
        resolveVariable('smallGutter'),
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    smallActionIconFill: resolveVariable('shareButtonColor'),
    smallActionRow: {
      position: 'absolute',
      bottom: 0,
      height: getSizeRelativeToReference(
        80,
        812,
        resolveVariable('sizes.window.height'),
      ),
      width: resolveVariable('sizes.window.width'),
      paddingBottom: getSizeRelativeToReference(
        resolveVariable('largeGutter'),
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    smallActionContainerLeft: {
      width: resolveVariable('sizes.window.width') / 2,
      paddingLeft: getSizeRelativeToReference(
        resolveVariable('largeGutter'),
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    smallActionContainerRight: {
      width: resolveVariable('sizes.window.width') / 2,
      paddingRight: getSizeRelativeToReference(
        resolveVariable('largeGutter'),
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    smallActionText: {
      color: resolveVariable('shareButtonColor'),
    },
  },

  'shoutem.radio-player.SheetHeader': {
    container: {
      borderTopLeftRadius: getSizeRelativeToReference(
        10,
        812,
        resolveVariable('sizes.window.height'),
      ),
      borderTopRightRadius: getSizeRelativeToReference(
        10,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    iconFill: resolveVariable('text.color'),
  },

  'shoutem.radio-player.TimerOptions': {
    optionContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: getSizeRelativeToReference(
        resolveVariable('mediumGutter'),
        375,
        resolveVariable('sizes.window.width'),
      ),
      paddingVertical: getSizeRelativeToReference(
        resolveVariable('mediumGutter'),
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    optionText: {
      fontSize: 15,
      letterSpacing: 0.38,
      color: resolveVariable('text.color'),
      lineHeight: 24,
      paddingLeft: getSizeRelativeToReference(
        resolveVariable('smallGutter'),
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
  },

  'shoutem.radio-player.RadioActionSheet': {
    container: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    optionContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      padding: getSizeRelativeToReference(
        resolveVariable('mediumGutter'),
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    optionText: {
      fontSize: 15,
      letterSpacing: 0.38,
      color: resolveVariable('text.color'),
      lineHeight: 24,
      paddingLeft: getSizeRelativeToReference(
        resolveVariable('smallGutter'),
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    segmentContainer: {
      overflow: 'hidden',
      backgroundColor: resolveVariable('paperColor'),
      paddingVertical: getSizeRelativeToReference(
        resolveVariable('mediumGutter'),
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
  },
});
