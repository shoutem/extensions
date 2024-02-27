import { StyleSheet } from 'react-native';
import { changeColorAlpha, getSizeRelativeToReference } from '@shoutem/theme';
import {
  createScopedResolver,
  resolveFontFamily,
  resolveFontWeight,
  responsiveHeight,
  responsiveWidth,
} from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  [`${ext('RadioScreen')}`]: {
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
    activeSleepIconFill: resolveVariable('featuredColor'),
    inactiveSleepIconFill: resolveVariable('navBarIconsColor'),
    adBannerContainer: {
      position: 'absolute',
      top: responsiveHeight(90),
    },
  },

  [`${ext('RadioPlayer')}`]: {
    container: {
      width: responsiveHeight(75),
      height: responsiveHeight(75),
      backgroundColor: resolveVariable('paperColor'),
      fontSize: responsiveHeight(36),
      borderRadius: 200,
      padding: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    playbackMainCircle: {
      width: responsiveHeight(150),
      height: responsiveHeight(150),
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderColor: resolveVariable('primaryButtonBackgroundColor'),
      borderWidth: 2,
      position: 'absolute',
      left: -responsiveHeight(37.5),
      top: -responsiveHeight(37.5),
      borderRadius: 200,
    },
    playbackContainer: {
      height: responsiveHeight(75),
      width: responsiveHeight(75),
    },
    playbackIcon: {
      width: responsiveHeight(36),
      height: responsiveHeight(36),
    },
    spinner: {
      height: responsiveHeight(45),
      width: responsiveHeight(45),
    },
  },

  [`${ext('PlaybackAnimation')}`]: {
    playbackMainCircle: {
      width: responsiveHeight(150),
      height: responsiveHeight(150),
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderColor: resolveVariable('primaryButtonBackgroundColor'),
      borderWidth: 2,
      position: 'absolute',
      left: -responsiveHeight(37.5),
      top: -responsiveHeight(37.5),
      borderRadius: 200,
    },
  },

  [`${ext('ArtworkRadioScreen')}`]: {
    screen: {
      backgroundColor: resolveVariable('screenBackgroundColor'),
    },
    radioPlayer: {
      playbackMainCircle: {
        borderColor: resolveVariable('playbackAnimatedCircleColor'),
      },
      container: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: resolveVariable('playbackButtonBorderColor'),
        borderWidth: 1,
      },
      playbackIcon: { color: resolveVariable('playbackIconColor') },
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
      paddingHorizontal: responsiveWidth(resolveVariable('largeGutter')),
    },
    smallActionContainerLeft: {
      flex: 1,
    },
    smallActionContainerRight: {
      flex: 1,
    },
    smallActionText: {
      color: resolveVariable('shareButtonColor'),
    },
    disabledOpacity: {
      opacity: 0.5,
    },
    adBannerContainer: {
      position: 'absolute',
      top: responsiveHeight(90),
    },
  },

  [`${ext('SheetHeader')}`]: {
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

  [`${ext('TimerOptions')}`]: {
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

  [`${ext('RadioActionSheet')}`]: {
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
    sleepOptionDisabled: {
      opacity: 0.5,
    },
    sleepOptionEnabled: {
      opacity: 1,
    },
  },

  [`${ext('RadioRssScreen')}`]: {
    radioPlayerContainer: {
      marginTop: getSizeRelativeToReference(
        -200,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    clearRow: {
      backgroundColor: 'transparent',
      width: resolveVariable('sizes.window.width'),
    },
    nowPlaying: {
      position: 'absolute',
      bottom: 0,
    },
    nowPlayingText: {
      color: resolveVariable('imageOverlayTextColor'),
      fontSize: 15,
      paddingTop: resolveVariable('extraLargeGutter'),
    },
    overlayStyle: {
      ...StyleSheet.absoluteFill,
      paddingTop: 0,
      paddingBottom: 0,
      marginBottom: 0,
    },
    activeSleepIconFill: resolveVariable('featuredColor'),
    inactiveSleepIconFill: resolveVariable('navBarIconsColor'),
    adBannerContainer: {
      position: 'absolute',
      top: responsiveHeight(90),
    },
  },

  [`${ext('RssNewsFeed')}`]: {
    container: {
      flexDirection: 'column',
      backgroundColor: 'rgba(236, 236, 236, 0.6)',
      maxHeight: getSizeRelativeToReference(
        280,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
  },

  [`${ext('ArticleCard')}`]: {
    cardContainer: {
      height: getSizeRelativeToReference(
        200,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    card: {
      borderRadius: 5,
      marginRight: resolveVariable('mediumGutter'),
      flex: 1,
    },
    cardImage: {
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      flex: 0.5,
    },
    cartContent: {
      borderRadius: 5,
      justifyContent: 'space-between',
      overflow: 'hidden',
      flex: 0.5,
    },
  },

  [`${ext('ArticleList')}`]: {
    flexRow: {
      flexDirection: 'row',
    },
    title: {
      flex: 1,
      paddingBottom: resolveVariable('mediumGutter'),
    },
    seeAll: {
      flex: 1,
      textAlign: 'right',
    },
  },

  [`${ext('StreamMetadata')}`]: {
    artworkStyle: {
      borderRadius: 5,
      marginRight: responsiveWidth(20),
    },
    songMetaContainer: {
      flex: 1,
      padding: responsiveHeight(10),
      borderRadius: 8,
      flexDirection: 'row',
    },
    withOverlay: {
      backgroundColor: '#00000080',
    },
    metaTextContainer: {
      textWrap: true,
      width: '70%',
    },
    alignSelfCenter: {
      flex: 1,
      alignItems: 'center',
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
  },
});
