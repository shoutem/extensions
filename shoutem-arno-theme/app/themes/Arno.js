/* eslint-disable */
import {
  Platform,
  Dimensions,
  StyleSheet,
  StatusBar,
  NavigationExperimental,
} from 'react-native';

import {
  INCLUDE,
  createVariations,
  createSharedStyle,
  inverseColorBrightnessForAmount,
  changeColorAlpha,
  getSizeRelativeToReference,
} from '@shoutem/theme';
import { getTheme } from '@shoutem/ui';
import _ from 'lodash';

const window = Dimensions.get('window');

// Shoutem Extensions constants

// End of Shoutem Extension constants

// Shoutem UI constants

const Colors = {
  CLEAR: 'rgba(0, 0, 0, 0)',
  INDICATOR: '#222222',
};

const GALLERY_DOT_SIZE = 8;

const SMALL_GUTTER = 8;
const MEDIUM_GUTTER = 16;
const LARGE_GUTTER = 32;
const EXTRA_LARGE_GUTTER = 64;

const STATUS_BAR_OFFSET = (Platform.OS === 'android' ? -StatusBar.currentHeight : 0);
const NAVIGATION_BAR_HEIGHT = NavigationExperimental.Header.HEIGHT;

const sizeVariants = ['', 'left', 'right', 'top', 'bottom', 'horizontal', 'vertical'];
const textComponents = [
  'shoutem.ui.Heading',
  'shoutem.ui.Title',
  'shoutem.ui.Subtitle',
  'shoutem.ui.Text',
  'shoutem.ui.Caption',
];
const viewComponents = [
  'shoutem.ui.View',
  'shoutem.ui.Tile',
  'shoutem.ui.Card',
  'shoutem.ui.Row',
];

// Horizontal gutter is calculated to have 24px margin between every ICON and screen edge.
const GRID_ITEM_HORIZONTAL_GUTTER = 17;
const GRID_ITEM_VERTICAL_GUTTER = 24;

function dimensionRelativeToIphone(dimension, actualRefVal = window.width) {
  // 375 is iPhone width
  return getSizeRelativeToReference(dimension, 375, actualRefVal);
}

export default (variables = {}) => ({
  //
  // Common
  //
  guttersPadding: {
    ...createVariations('.sm-gutter', sizeVariants, 'padding', SMALL_GUTTER),
    ...createVariations('.md-gutter', sizeVariants, 'padding', MEDIUM_GUTTER),
    ...createVariations('.lg-gutter', sizeVariants, 'padding', LARGE_GUTTER),
    ...createVariations('.xl-gutter', sizeVariants, 'padding', EXTRA_LARGE_GUTTER),
  },

  guttersMargin: {
    ...createVariations('.sm-gutter', sizeVariants, 'margin', SMALL_GUTTER),
    ...createVariations('.md-gutter', sizeVariants, 'margin', MEDIUM_GUTTER),
    ...createVariations('.lg-gutter', sizeVariants, 'margin', LARGE_GUTTER),
    ...createVariations('.xl-gutter', sizeVariants, 'margin', EXTRA_LARGE_GUTTER),
  },

  commonVariants: {
    '.rounded-corners': {
      borderRadius: 2,
      borderWidth: 0,
      borderColor: Colors.CLEAR,
    },

    '.flexible': {
      flex: 1,
    },

    '.inflexible': {
      flex: 0,
    },

    '.collapsible': {
      flex: -1,
    },

    '.stretch': {
      alignSelf: 'stretch',
    },

    '.space-between': {
      justifyContent: 'space-between',
    },

    '.space-around': {
      justifyContent: 'space-around',
    },
  },

  alignmentVariants: {
    flexDirection: 'column',
    '.topLeft': {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    '.topCenter': {
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    '.topRight': {
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
    },
    '.middleLeft': {
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    '.middleCenter': {
      justifyContent: 'center',
      alignItems: 'center',
    },
    '.middleRight': {
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    '.bottomLeft': {
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
    },
    '.bottomCenter': {
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    '.bottomRight': {
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
    '.top': {
      justifyContent: 'flex-start',
    },
    '.middle': {
      justifyContent: 'center',
    },
    '.bottom': {
      justifyContent: 'flex-end',
    },
  },

  fillParent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  'fill-parent': {
    '.fill-parent': {
      [INCLUDE]: ['fillParent'],
    },
  },

  dimmedFeaturedBackground: {
    backgroundColor: inverseColorBrightnessForAmount(variables.featuredColor, 5),
  },

  featuredBackground: {
    backgroundColor: variables.featuredColor,
  },

  imageOverlayText: {
    ...createSharedStyle([...textComponents, 'shoutem.ui.Icon'], {
      color: variables.imageOverlayTextColor,
    }),
  },

  boldTextStyle: {
    fontWeight: '500',
  },

  italicTextStyle: {
    fontStyle: 'italic',
  },

  codeTextStyle: {
    fontFamily: 'Menlo',
  },

  multilineTextStyle: {
    '.v-center': {
      // Compensate for lineHeight, because
      // textAlignVertical is not supported on iOS
      marginTop: -4,
      marginBottom: 4,
    },

    lineHeight: 26,
  },

  resetTextAndCaptionOpacity: {
    // In some cases text and caption does not have opacity
    'shoutem.ui.Text': {
      opacity: 1,
    },
    'shoutem.ui.Caption': {
      opacity: 1,
    },
  },

  text: {
    [INCLUDE]: ['commonVariants', 'guttersMargin'],

    '.line-through': {
      textDecorationLine: 'line-through',
    },

    '.h-center': {
      textAlign: 'center',
    },

    '.bold': {
      [INCLUDE]: ['boldTextStyle'],
    },

    '.multiline': {
      [INCLUDE]: ['multilineTextStyle'],
    },

    backgroundColor: Colors.CLEAR,
  },

  'shoutem.ui.Heading': {
    [INCLUDE]: ['text'],

    ...variables.heading,
    lineHeight: 35,
  },

  'shoutem.ui.Title': {
    [INCLUDE]: ['text'],

    ...variables.title,
    lineHeight: 25,
  },

  'shoutem.ui.Subtitle': {
    [INCLUDE]: ['text'],

    ...variables.subtitle,
    lineHeight: 25,
  },

  'shoutem.ui.Text': {
    [INCLUDE]: ['text'],
    opacity: 0.7,
    ...variables.text,
  },

  'shoutem.ui.Caption': {
    [INCLUDE]: ['text'],

    lineHeight: 16,
    letterSpacing: 0.4,
    opacity: 0.7,
    ...variables.caption,
  },

  //
  // Indicators
  //
  indicator: {
    // Adds opacity to default color
    color: changeColorAlpha(Colors.INDICATOR, 0.5),
  },

  //
  // Images
  //
  imageSizes: {
    '.small-avatar': {
      width: dimensionRelativeToIphone(50),
      height: dimensionRelativeToIphone(50),
      borderRadius: 25,
      borderWidth: 0,
      resizeMode: 'cover',
    },

    '.small': {
      width: dimensionRelativeToIphone(65),
      height: dimensionRelativeToIphone(65),
    },

    '.medium-avatar': {
      width: dimensionRelativeToIphone(144),
      height: dimensionRelativeToIphone(144),
      borderRadius: 72,
      borderWidth: 0,
      resizeMode: 'cover',
    },

    '.medium': {
      width: dimensionRelativeToIphone(145),
      height: dimensionRelativeToIphone(92),
    },

    '.medium-wide': {
      width: dimensionRelativeToIphone(176),
      height: dimensionRelativeToIphone(176),
    },

    '.medium-square': {
      width: dimensionRelativeToIphone(144),
      height: dimensionRelativeToIphone(144),
    },

    // NOTE: Image resizing doesn't work correctly if both
    // dimensions are not explicitly defined, so we can't
    // use flex: 1, or alignSelf: 'stretch' here...
    '.featured': {
      width: dimensionRelativeToIphone(359),
      height: dimensionRelativeToIphone(345),
    },

    '.large': {
      width: dimensionRelativeToIphone(359),
      height: dimensionRelativeToIphone(268),
      alignSelf: 'center',
    },

    '.large-portrait': {
      width: dimensionRelativeToIphone(359),
      height: dimensionRelativeToIphone(496),
      alignSelf: 'center',
    },

    '.large-banner': {
      width: dimensionRelativeToIphone(359),
      height: dimensionRelativeToIphone(192),
      alignSelf: 'center',
    },

    '.large-square': {
      width: dimensionRelativeToIphone(359),
      height: dimensionRelativeToIphone(359),
      alignSelf: 'center',
    },

    '.large-wide': {
      width: dimensionRelativeToIphone(359),
      height: dimensionRelativeToIphone(228),
      alignSelf: 'center',
    },

    '.large-ultra-wide': {
      width: dimensionRelativeToIphone(359),
      height: dimensionRelativeToIphone(130),
      alignSelf: 'center',
    },
  },
  'shoutem.ui.Image': {
    [INCLUDE]: ['commonVariants', 'imageSizes', 'fill-parent'],

    'shoutem.ui.Tile': {
      [INCLUDE]: ['textCentricTile', 'fillParent', 'imageOverlayText'],

      backgroundColor: variables.imageOverlayColor,
    },

    heroAnimation(driver, { layout, options }) {
      return {
        transform: [
          {
            scale: driver.value.interpolate({
              inputRange: [-0.9 * layout.height, 0],
              outputRange: [3, 1],
              extrapolateRight: 'clamp',
            }),
          }, {
            translateY: driver.value.interpolate({
              inputRange: [-100, 100],
              outputRange: [-50, 50],
              extrapolateLeft: 'clamp',
            }),
          },
        ],
      };
    },

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'stretch',
    overflow: 'visible',
  },

  //
  // Containers
  //
  verticalFlexAlignment: {
    '.h-center': {
      alignItems: 'center',
    },

    '.h-start': {
      alignItems: 'flex-start',
    },

    '.h-end': {
      alignItems: 'flex-end',
    },

    '.v-center': {
      justifyContent: 'center',
    },

    '.v-start': {
      justifyContent: 'flex-start',
    },

    '.v-end': {
      justifyContent: 'flex-end',
    },
  },
  horizontalFlexAlignment: {
    '.h-center': {
      justifyContent: 'center',
    },

    '.h-start': {
      justifyContent: 'flex-start',
    },

    '.h-end': {
      justifyContent: 'flex-end',
    },

    '.v-center': {
      alignItems: 'center',
    },

    '.v-start': {
      alignItems: 'flex-start',
    },

    '.v-end': {
      alignItems: 'flex-end',
    },
  },
  'shoutem.ui.View': {
    [INCLUDE]: ['commonVariants', 'guttersPadding'],

    '.horizontal': {
      [INCLUDE]: ['horizontalFlexAlignment'],
      flexDirection: 'row',
      alignItems: 'flex-end',
    },

    '.vertical': {
      [INCLUDE]: ['verticalFlexAlignment'],
      flexDirection: 'column',
    },

    '.fill-parent': {
      [INCLUDE]: ['fillParent'],
    },

    '.overlay': {
      backgroundColor: variables.primaryOverlayColor,
    },

    '.solid': {
      backgroundColor: variables.paperColor,
    },

    '.wrap': {
      flexWrap: 'wrap',
    },

    '.dimmed': {
      '.featured': {
        [INCLUDE]: ['dimmedFeaturedBackground']
      }
    },

    '.featured': {
      [INCLUDE]: ['featuredBackground'],
    },

    '.center': {
      alignSelf: 'center',
    },
  },

  'shoutem.ui.Screen': {
    '.paper': {
      backgroundColor: variables.paperColor,
    },

    backgroundColor: variables.backgroundColor,
    flex: 1,
  },

  'shoutem.ui.Row': {
    ...createSharedStyle(textComponents, { flex: 1 }),

    'shoutem.ui.Image': {
      marginRight: MEDIUM_GUTTER,
    },

    'shoutem.ui.Icon': {
      '.disclosure': {
        opacity: 0.5,
        marginRight: -7,
        marginLeft: 4,
      },

      marginRight: MEDIUM_GUTTER,
    },

    'shoutem.ui.Button': {
      '.right-icon': {
        [INCLUDE]: ['tightButton', 'clearButton'],
        marginLeft: MEDIUM_GUTTER,
      },
    },

    'shoutem.ui.View': {
      '.notification-dot': {
        alignSelf: 'center',
        flex: 0,
        width: 6,
        height: 6,
        borderRadius: 3,
        borderColor: Colors.INDICATOR,
        backgroundColor: Colors.INDICATOR,
        marginLeft: -19,
        marginRight: 13,
      },

      '.vertical': {
        '*': {
          // Add a small gutter below each view
          marginBottom: SMALL_GUTTER,
        },

        // Compensate for the last view
        marginBottom: -SMALL_GUTTER,
      },

      flex: 1,
    },

    '*.top': {
      alignSelf: 'flex-start',
    },

    '.small': {
      height: 65,
      paddingVertical: 0,
    },

    flexGrow: 1,
    flexShrink: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: variables.paperColor,
    paddingHorizontal: LARGE_GUTTER,
    paddingVertical: MEDIUM_GUTTER,
  },

  textCentricTile: {
    'shoutem.ui.View': {
      '.actions': {
        position: 'absolute',
        top: MEDIUM_GUTTER,
        right: MEDIUM_GUTTER,
      },
    },

    'shoutem.ui.Image': {
      marginBottom: 0,
    },

    '*': {
      marginBottom: SMALL_GUTTER,
    },

    ...createSharedStyle(textComponents, {
      textAlign: 'center',
    }),

    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingTop: EXTRA_LARGE_GUTTER,
    paddingBottom: EXTRA_LARGE_GUTTER - SMALL_GUTTER,
  },

  'shoutem.ui.Tile': {
    [INCLUDE]: ['commonVariants', 'guttersPadding', 'resetTextAndCaptionOpacity'],

    'shoutem.ui.View': {
      '.content': {
        [INCLUDE]: ['resetTextAndCaptionOpacity'],

        '*': {
          marginBottom: MEDIUM_GUTTER - SMALL_GUTTER,
        },

        'shoutem.ui.Text': {
          opacity: 1,
        },
        'shoutem.ui.Caption': {
          opacity: 1,
        },

        alignSelf: 'stretch',
        paddingBottom: SMALL_GUTTER,
        paddingHorizontal: SMALL_GUTTER,
        marginTop: SMALL_GUTTER,
      },
    },

    'shoutem.ui.Image': {
      marginHorizontal: SMALL_GUTTER,
    },

    '.clear': {
      backgroundColor: Colors.CLEAR,
    },

    '.small': {
      'shoutem.ui.Image': {
        marginHorizontal: 0, // Reset default image size
      },

      'shoutem.ui.View': {
        '.content': {
          '*': {
            marginBottom: SMALL_GUTTER,
          },

          alignSelf: 'stretch',
          paddingTop: SMALL_GUTTER,
          paddingBottom: 0,
          paddingHorizontal: 0,
          marginBottom: -SMALL_GUTTER,
          marginTop: 0,
        },
      },

      width: 145,
      backgroundColor: variables.paperColor,
    },

    '.text-centric': {
      [INCLUDE]: ['textCentricTile'],
    },

    heroAnimation(driver, { layout, options }) {
      return {
        opacity: driver.value.interpolate({
          inputRange: [-0.2 * layout.height, 0, layout.height],
          outputRange: [0, 1, 0],
        }),
        transform: [
          {
            translateY: driver.value.interpolate({
              inputRange: [-100, 100],
              outputRange: [20, -20],
            }),
          },
        ],
      };
    },

    flex: -1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: variables.paperColor,
  },

  'shoutem.ui.Card': {
    [INCLUDE]: ['commonVariants'],

    'shoutem.ui.Image': {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOpacity: 1,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 16,
    },

    'shoutem.ui.View.content': {
      'shoutem.ui.Subtitle': {
        marginBottom: MEDIUM_GUTTER,
      },

      flex: 1,
      alignSelf: 'stretch',
      paddingTop: 6,
    },

    width: dimensionRelativeToIphone(176),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: variables.paperColor,
    borderRadius: 1,
    shadowColor: variables.shadowColor,
    marginBottom: MEDIUM_GUTTER,
  },

  'shoutem.ui.Overlay': {
    [INCLUDE]: ['guttersPadding'],

    ...createSharedStyle(textComponents, {
      textAlign: 'center',
    }),

    ...createSharedStyle(viewComponents, {
      ...createSharedStyle([...textComponents, 'shoutem.ui.Icon'], {
        textAlign: 'center',
        color: variables.tagOverlayTextColor,
      }),
    }),

    '.rounded-small': {
      width: 38,
      height: 38,
      borderRadius: 19,
      padding: 0,
    },

    '.fill-parent': {
      [INCLUDE]: ['fillParent'],
    },

    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2 * SMALL_GUTTER,
    paddingBottom: 2 * SMALL_GUTTER,
    paddingHorizontal: MEDIUM_GUTTER,
    backgroundColor: variables.tagOverlayColor,
  },

  //
  // Buttons
  //
  'shoutem.ui.TouchableOpacity': {
    [INCLUDE]: ['commonVariants'],

    activeOpacity: 0.8,
  },

  tightButton: {
    'shoutem.ui.Icon': {
      marginRight: 0,
    },

    'shoutem.ui.Text': {
      marginRight: 0,
    },

    paddingLeft: 0,
    paddingRight: 0,
  },

  clearButton: {
    backgroundColor: Colors.CLEAR,
    borderWidth: 0,
    borderRadius: 0,
  },

  textualButton: {
    'shoutem.ui.Text': {
      // Inherit color
      ..._.omit(variables.text, ['color']),
    },
  },

  'shoutem.ui.Button': {
    [INCLUDE]: ['commonVariants', 'guttersMargin', 'resetTextAndCaptionOpacity'],

    '.tight': {
      [INCLUDE]: ['tightButton'],
    },

    '.clear': {
      [INCLUDE]: ['clearButton'],
    },

    '.textual': {
      [INCLUDE]: ['textualButton'],
    },

    '.secondary': {
      'shoutem.ui.Icon': {
        color: variables.secondaryButtonTextColor,
      },

      'shoutem.ui.Text': {
        color: variables.secondaryButtonTextColor,
      },

      backgroundColor: variables.secondaryButtonBackgroundColor,
      borderColor: variables.secondaryButtonBorderColor,
    },

    '.full-width': {
      'shoutem.ui.Icon': {
        fontSize: 16,
      },

      flex: 1,
      alignSelf: 'stretch',
      borderRadius: 0,
      borderWidth: 0,
      height: 48,
    },

    // Vertically stacked icon and text
    '.stacked': {
      'shoutem.ui.Icon': {
        marginVertical: MEDIUM_GUTTER,
        marginRight: 0,
      },

      'shoutem.ui.Text': {
        [INCLUDE]: ['boldTextStyle'],
        textAlign: 'center',
        marginVertical: 0,
        marginRight: 0,
        fontFamily: 'MuktaVaani-Medium',
      },

      width: 120,
      height: 82,
      flexDirection: 'column',
    },

    'shoutem.ui.Text': {
      ...variables.primaryButtonText,
      letterSpacing: 1,
      marginVertical: 6,
    },

    'shoutem.ui.Icon': {
      color: variables.primaryButtonText.color,
      fontSize: 24,
      marginRight: 10,
    },

    underlayColor: changeColorAlpha(variables.primaryButtonBackgroundColor, 0.5),

    backgroundColor: variables.primaryButtonBackgroundColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: variables.primaryButtonText.color,
    paddingLeft: MEDIUM_GUTTER,
    paddingRight: MEDIUM_GUTTER,
    borderRadius: 50,
  },

  //
  // Media
  //
  'shoutem.ui.Icon': {
    '.indicator': {
      [INCLUDE]: ['indicator'],
    },

    '.scroll-indicator': {
      [INCLUDE]: ['indicator'],
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: MEDIUM_GUTTER,
      color: variables.lightLine,
    },

    backgroundColor: Colors.CLEAR,
    color: variables.primaryButtonText.color,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 24,
  },

  //
  // Collections
  //
  'shoutem.ui.ListView': {
    'shoutem.ui.Divider': {
      [INCLUDE]: ['sectionHeaderDivider'],

      borderTopWidth: 0,
    },

    listContent: {
      paddingBottom: SMALL_GUTTER,
      backgroundColor: variables.backgroundColor,
    },

    refreshControl: {
      tintColor: variables.secondaryButtonBackgroundColor,
    },

    loadMoreSpinner: {
      paddingVertical: 25,
    },
  },

  'shoutem.ui.GridRow': {
    '*': {
      flex: 1,
      alignSelf: 'stretch',
      marginLeft: SMALL_GUTTER,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 0,
    },

    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingRight: SMALL_GUTTER,
    paddingTop: SMALL_GUTTER,
  },

  //
  // Other
  //
  hoverNavigationBar: {
    navigationHeader: {
      paddingTop: 0,
    },
  },
  clearNavigationBar: {
    [INCLUDE]: ['imageOverlayText'],
    'shoutem.ui.Button': {
      [INCLUDE]: ['clearButton'],
      'shoutem.ui.Icon': {
        color: variables.imageOverlayTextColor,
      },
      'shoutem.ui.Text': {
        color: variables.imageOverlayTextColor,
      },
    },
    container: {
      backgroundColor: 'transparent',
      borderBottomColor: 'transparent',
    },
  },
  navigationBarTextAnimations: {
    solidifyAnimation(driver, { layout, animationOptions }) {
      return {
        color: driver.value.interpolate({
          inputRange: [250, 300],
          outputRange: [
            variables.imageOverlayTextColor,
            variables.navBarText.color
          ],
          extrapolate: 'clamp',
        }),
      };
    },
    // Child components composed by composeChildren of NavigationBar automatically
    // get the same animationName as NavigationBar.
    // If component doesn't have animation for animation name error will be thrown.
    // This animations are provided to all NavigationBar children so that if NavigationBar
    // has animation we do not get error that children does not have an animation.
    // TODO
    //   remove this function when animationName propagation is happening only if Icon/Title
    //   are having animationName defined
    boxingAnimation() {
      // Only NavigationBar container is animated
      // Providing boxing animation just not to get error
      return {};
    },
  },
  navigationBar: {
    '.no-border': {
      container: {
        borderBottomWidth: 0,
      },
    },

    '.featured': {
      'shoutem.ui.Button': {
        'shoutem.ui.Icon': {
          color: variables.featuredNavBarIconsColor,
        },
        'shoutem.ui.Text': {
          color: variables.featuredNavBarIconsColor,
        },
      },

      ...createSharedStyle(['shoutem.ui.Title', 'shoutem.ui.Icon', 'shoutem.ui.Text'], {
        color: variables.featuredNavBarTitleColor,
      }),

      container: {
        [INCLUDE]: ['featuredBackground'],
        borderBottomWidth: 0,
      },
    },

    'shoutem.ui.Icon': {
      [INCLUDE]: ['navigationBarTextAnimations'],
      color: variables.navBarText.color,
      fontSize: 24,
    },

    'shoutem.ui.Text': {
      [INCLUDE]: ['navigationBarTextAnimations'],
      color: variables.navBarText.color,
      fontSize: 15,
    },

    'shoutem.ui.Button': {
      [INCLUDE]: ['clearButton', 'tightButton'],
      'shoutem.ui.Icon': {
        [INCLUDE]: ['navigationBarTextAnimations'],
        color: variables.featuredNavBarIconsColor,
        marginVertical: 9,
      },
      'shoutem.ui.Text': {
        [INCLUDE]: ['navigationBarTextAnimations'],
        color: variables.featuredNavBarIconsColor,
        letterSpacing: 0,
      },
      paddingHorizontal: 9,
    },

    'shoutem.ui.DropDownMenu': {
      horizontalContainer: {
        marginTop: SMALL_GUTTER,
        marginRight: SMALL_GUTTER,
      },
      selectedOption: {
        'shoutem.ui.Icon': {
          color: variables.featuredNavBarIconsColor,
        },
        'shoutem.ui.Text': {
          ...variables.navBarLinks,
        },
      },
    },

    boxingAnimation(driver, { layout, animationOptions }) {
      return {
        container: {
          borderBottomColor: driver.value.interpolate({
            // Animate to approx title top offset
            inputRange: [0, 45],
            outputRange: [Colors.CLEAR, variables.navBarBorderColor],
            extrapolate: 'clamp',
          }),
          borderBottomWidth: 1,
        },
      };
    },

  },
  'shoutem.ui.NavigationBar': {
    [INCLUDE]: ['navigationBar'],

    '.clear': {
      [INCLUDE]: ['clearNavigationBar'],
    },

    'shoutem.ui.Title': {
      solidifyAnimation(driver, { layout, animationOptions }) {
        return {
          color: driver.value.interpolate({
            inputRange: [250, 300],
            outputRange: [Colors.CLEAR, variables.navBarText.color],
            extrapolate: 'clamp',
          }),
        };
      },
      boxingAnimation() {
        return {};
      },
      color: variables.navBarText.color,
      fontWeight: 'bold',
    },

    solidifyAnimation(driver, { layout, animationOptions }) {
      return {
        container: {
          backgroundColor: driver.value.interpolate({
            inputRange: [250, 300],
            outputRange: [Colors.CLEAR, variables.paperColor],
            extrapolate: 'clamp',
          }),
          borderBottomColor: driver.value.interpolate({
            inputRange: [250, 300],
            outputRange: [Colors.CLEAR, variables.navBarBorderColor],
            extrapolate: 'clamp',
          }),
        },
      };
    },

    container: {
      [INCLUDE]: ['fillParent'],
      height: 70,
      backgroundColor: variables.navBarBackground,
      borderBottomColor: variables.navBarBorderColor,
      borderBottomWidth: 1,
      padding: 15,
    },

    componentsContainer: {
      flex: 1,
      alignItems: 'flex-end',
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: 'transparent',
    },

    component: {
      height: 24,
      marginBottom: -8,
      alignSelf: 'flex-end',
      flex: 1,
    },

    leftComponent: {
      alignItems: 'flex-start',
      flex: 1,
    },

    centerComponent: {
      alignItems: 'center',
      flex: 1,
    },

    rightComponent: {
      alignItems: 'flex-end',
      flex: 1,
    },
  },
  'shoutem.ui.navigation.NavigationBar': {
    [INCLUDE]: ['navigationBar'],

    '.hover': {
      [INCLUDE]: ['hoverNavigationBar'],
    },

    '.clear': {
      [INCLUDE]: ['clearNavigationBar', 'hoverNavigationBar'],
    },

    '.fade': {
      gradient: {
        [INCLUDE]: ['fillParent'],
        colors: [Colors.CLEAR, 'rgba(0, 0, 0, 0.3)', Colors.CLEAR],
        locations: [0.0, 0.6, 1.0],
        solidifyAnimation(driver) {
          return {
            opacity: driver.value.interpolate({
              inputRange: [250, 300],
              outputRange: [1, 0],
            }),
          };
        }
      },
    },

    'shoutem.ui.View': {
      '.container': {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },

    'shoutem.ui.Title': {
      solidifyAnimation(driver) {
        return {
          color: driver.value.interpolate({
            inputRange: [250, 300],
            outputRange: [Colors.CLEAR, variables.navBarText.color],
            extrapolate: 'clamp',
          }),
        };
      },

      boxingAnimation(driver) {
        return {
          opacity: driver.value.interpolate({
            inputRange: [250, 300],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          })
        };
      },

      flex: 1,
      textAlign: 'center',
      fontSize: 15,
      lineHeight: 18,
      color: variables.navBarText.color,
    },

    solidifyAnimation(driver) {
      return {
        container: {
          backgroundColor: driver.value.interpolate({
            inputRange: [250, 300],
            outputRange: [Colors.CLEAR, variables.navBarBackground],
            extrapolate: 'clamp',
          }),
        },
      };
    },

    navigationHeader: {
      paddingTop: NAVIGATION_BAR_HEIGHT,
    },
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: NAVIGATION_BAR_HEIGHT,
      backgroundColor: variables.navBarBackground,
    },
  },

  'shoutem.ui.navigation.CardStack': {
    '.without-transitions': {
      interpolateCardStyle(props) {
        const {
          navigationState,
          scene,
        } = props;

        const focused = navigationState.index === scene.index;
        const opacity = focused ? 1 : 0;
        const translate = focused ? 0 : 1000000;
        return {
          opacity,
          transform: [
            { translateX: translate },
            { translateY: translate },
          ],
        };
      },
    },

    cardStack: {},
    card: {},
  },

  sectionHeaderDivider: {
    'shoutem.ui.Caption': {
      lineHeight: variables.caption.fontSize * 1.4,
      marginTop: -1,
      marginBottom: SMALL_GUTTER,
      marginHorizontal: MEDIUM_GUTTER,
    },

    paddingTop: 25,
    backgroundColor: variables.sectionHeaderBackgroundColor,
  },
  'shoutem.ui.Divider': {
    '.line': {
      '.small': {
        marginLeft: 0,
        width: 55,
      },
      '.center': {
        alignSelf: 'center',
      },
      paddingTop: 0,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: variables.lineColor,
      marginLeft: LARGE_GUTTER,
    },

    '.section-header': {
      [INCLUDE]: ['sectionHeaderDivider'],
    },

    alignSelf: 'stretch',
    paddingTop: 25,
    paddingLeft: LARGE_GUTTER,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  //
  // Form components
  //
  'shoutem.ui.TextInput': {
    [INCLUDE]: ['commonVariants', 'guttersMargin'],
    selectionColor: variables.text.color,
    placeholderTextColor: changeColorAlpha(variables.text.color, 0.5),
    backgroundColor: variables.paperColor,
    height: 55,
    paddingHorizontal: MEDIUM_GUTTER,
    ...variables.text,

  },

  'shoutem.ui.DropDownMenu': {
    '.horizontal': {
      horizontalContainer: {
        height: 40,
        backgroundColor: inverseColorBrightnessForAmount(variables.paperColor, 5),
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: window.width,
        marginTop: 0,
      },
    },

    '.featured': {
      '.horizontal': {
        horizontalContainer: {
          [INCLUDE]: ['dimmedFeaturedBackground'],
          backgroundColor: inverseColorBrightnessForAmount(variables.featuredColor, 5),
        },
      },
    },

    visibleOptions: 7,

    selectedOption: {
      [INCLUDE]: ['tightButton', 'clearButton', 'textualButton'],
      'shoutem.ui.Icon': {
        // TODO - see why Icon width and content alignment can not be defined properly
        width: 12,
        paddingLeft: -4.5,
      },

      'shoutem.ui.Text': {
        ...variables.text,
        margin: 0,
      },

      flexDirection: 'row',
      paddingHorizontal: 10,
      borderRadius: 40,
      borderWidth: 1,
    },

    modal: {
      'shoutem.ui.Button.close': {
        'shoutem.ui.Icon': {
          color: changeColorAlpha(variables.subtitle.color, 0.5),
          fontSize: 24,
        },

        position: 'absolute',
        justifyContent: 'flex-start',
        paddingLeft: 64,
        bottom: EXTRA_LARGE_GUTTER,
        left: 0,
        right: 0,
      },

      flex: 1,
      marginTop: -(EXTRA_LARGE_GUTTER + LARGE_GUTTER),
      justifyContent: 'center',
      alignItems: 'flex-end',
      backgroundColor: changeColorAlpha(variables.backgroundColor, 0.97),
    },

    modalItem: {
      [INCLUDE]: ['resetTextAndCaptionOpacity'],

      'shoutem.ui.Text': {
        flex: 1,
        width: window.width,
        alignSelf: 'stretch',
        lineHeight: 40,
        letterSpacing: 1.1,
        paddingTop: 32,
        paddingHorizontal: 64,
        ...variables.subtitle,
      },
      flex: 1,
    },
  },

  //
  // Media
  //
  'shoutem.ui.RichMedia': {
    b: {
      [INCLUDE]: ['boldTextStyle'],
    },
    strong: {
      [INCLUDE]: ['boldTextStyle'],
    },
    i: {
      [INCLUDE]: ['italicTextStyle'],
    },
    em: {
      [INCLUDE]: ['italicTextStyle'],
    },
    pre: {
      [INCLUDE]: ['codeTextStyle'],
    },
    code: {
      [INCLUDE]: ['codeTextStyle'],
    },
    a: {
      fontWeight: '500',
      color: 'blue',
    },
    h1: {
      color: '#000',
      fontSize: 28,
    },
    h2: {
      color: '#000',
      fontSize: 24,
    },
    h3: {
      fontWeight: '900',
      color: '#000',
      fontSize: 18,
    },
    h4: {
      fontWeight: '700',
      color: '#000',
      fontSize: 16,
    },
    h5: {
      fontWeight: '500',
      color: '#000',
      fontSize: 14,
    },
    video: {
      height: 200,
    },
    img: {
      height: 200,
    },
    p: {
      [INCLUDE]: ['shoutem.ui.Text', 'multilineTextStyle'],
    },
    div: {
      [INCLUDE]: ['shoutem.ui.Text', 'multilineTextStyle'],
    },
    container: {
      backgroundColor: variables.paperColor,
      margin: MEDIUM_GUTTER,
    },
  },

  'shoutem.ui.Video': {
    container: {
      backgroundColor: variables.paperColor,
      flex: 1,
      height: 240,
    },
  },

  //
  // HorizontalPager
  //

  'shoutem.ui.HorizontalPager': {
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      backgroundColor: 'transparent',
      overflow: 'visible',
    },
    page: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    nextPageInsetSize: 20,
  },

  //
  // PageIndicators
  //

  'shoutem.ui.PageIndicators': {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 10,
    },
    indicatorContainer: {
      alignItems: 'center',
      'shoutem.ui.View': {
        width: GALLERY_DOT_SIZE,
        height: GALLERY_DOT_SIZE,
        borderRadius: GALLERY_DOT_SIZE / 2,
        // TODO - confirm opacity
        backgroundColor: changeColorAlpha(Colors.INDICATOR, 0.7),
        marginLeft: GALLERY_DOT_SIZE / 2,
        marginRight: GALLERY_DOT_SIZE / 2,
        '.selected': {
          backgroundColor: Colors.INDICATOR,
        },
      },
    },
  },

  //
  // InlineGallery
  //
  'shoutem.ui.InlineGallery': {
    '*': {
      flex: 1,
    },

    '.large-wide': {
      height: dimensionRelativeToIphone(238),
    },

    '.large-ultra-wide': {
      height: dimensionRelativeToIphone(130),
    },

    height: dimensionRelativeToIphone(345),
    pageMargin: 20,
  },

  //
  // ImageGallery
  //

  galleryOverlayAnimations: {
    fadeOutAnimation(driver, { layout, options }) {
      return {
        backgroundColor: driver.value.interpolate({
          inputRange: [0, 1],
          outputRange: [
            variables.paperColor,
            '#000000',
          ],
        }),
        opacity: driver.value.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
        }),
      };
    },
  },

  'shoutem.ui.ImageGallery': {
    [INCLUDE]: ['guttersPadding'],
    pageMargin: 0,
    container: {
      flex: 1,
      lightsOffAnimation(driver, { layout, options }) {
        return {
          backgroundColor: driver.value.interpolate({
            inputRange: [0, 1],
            outputRange: [
              variables.paperColor,
              '#000000',
            ],
          }),
        };
      },
    },
    page: {
      flex: 1,
      justifyContent: 'center',
      overflow: 'hidden',
    },
    title: {
      container: {
        // Top position will most likely be 0 or 70
        [INCLUDE]: ['galleryOverlayAnimations'],
        position: 'absolute',
        backgroundColor: variables.paperColor,
        paddingTop: MEDIUM_GUTTER,
        paddingHorizontal: MEDIUM_GUTTER,
        height: 60,
        top: 0,
        left: 0,
        right: 0,
      },
      text: {
        color: variables.title.color,
        textAlign: 'center',
      },
    },
    description: {
      container: {
        [INCLUDE]: ['galleryOverlayAnimations'],
        position: 'absolute',
        backgroundColor: variables.paperColor,
        paddingTop: SMALL_GUTTER,
        bottom: 0,
        left: 0,
        right: 0,
      },
      scroll: {
        maxHeight: 200,
        padding: MEDIUM_GUTTER,
      },
      text: {
        color: variables.title.color,
        textAlign: 'center',
      },
    },
  },

  //
  // Other
  //
  'shoutem.ui.ImagePreview': {
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    fullScreenContainer: {
      flex: 1,
      backgroundColor: 'black',
    },
    image: {
      flex: 1,
    },
    thumbnail: {},
    header: {
      position: 'absolute',
      top: STATUS_BAR_OFFSET,
      left: 0,
      backgroundColor: 'transparent',
    },
    closeIcon: {
      color: 'white',
      marginLeft: 15,
      marginTop: -STATUS_BAR_OFFSET + 20,
    },
  },

  'shoutem.ui.ImageGallery': {
    imagePreview: {
      image: {},
    },
  },

  'shoutem.ui.MapView': {
    flex: 1,
  },

  'shoutem.ui.InlineMap': {
    [INCLUDE]: ['imageSizes'],

    '.top-aligned': {
      justifyContent: 'flex-start',
    },

    '.bottom-aligned': {
      justifyContent: 'flex-end',
    },

    '.medium-tall': {
      height: 160,
    },

    'shoutem.ui.View': {
      'shoutem.ui.View': {
        'shoutem.ui.Overlay': {
          'shoutem.ui.View': {
            'shoutem.ui.Heading': {
              color: 'white',
              marginVertical: 8,
            },

            'shoutem.ui.Title': {
              color: 'white',
              marginVertical: 12,
            },

            'shoutem.ui.Subtitle': {
              color: 'white',
              marginTop: 80,
            },

            'shoutem.ui.Caption': {
              color: 'white',
              marginTop: 5,
            },

            'shoutem.ui.Text': {
              color: 'white',
            },
          },

          alignSelf: 'stretch',
          marginVertical: 0,
        },

        [INCLUDE]: ['fillParent'],
      },
    },

    [INCLUDE]: ['commonVariants'],
    flex: 0,
  },

  // ***************** //
  // END OF SHOUTEM-UI //
  // ***************** //

  //
  // Navigation
  // Drawer, TabBar, Folder

  mainNavigation: {
    '.selected': {
      // TouchableOpacity component
      // "Item" represent generic name for navigation action components
      // TabBarItem -> Button; Drawer -> Row; IconGrid -> Cell
      item: {
        backgroundColor: variables.mainNavSelectedItemBackground,
      },
      icon: {
        tintColor: variables.mainNavSelectedItemColor,
      },
      text: {
        color: variables.mainNavSelectedItemColor,
      },
    },
    item: {
      backgroundColor: variables.mainNavItemBackground,
    },
    icon: {
      tintColor: variables.mainNavItemColor,
    },
    text: {
      color: variables.mainNavItemColor,
    },
  },
  folderNavigation: {
    [INCLUDE]: ['mainNavigation'],
    '.text-hidden': {},
    '.small-icon': {
      icon: {
        width: 24,
        height: 24,
      }
    },
    '.medium-icon': {
      icon: {
        width: 36,
        height: 36,
      }
    },
    '.large-icon': {
      icon: {
        width: 48,
        height: 48,
      },
    },

    icon: {
      tintColor: variables.folderItemColor,
    },

    text: {
      color: variables.folderItemColor,
    },

    scrollView: {
      flex: 1,
      alignSelf: 'stretch',
    },
    // Only available when screen has background image
    backgroundWrapper: {
      flex: 1,
      alignSelf: 'stretch',
      'shoutem.ui.Image': {
        [INCLUDE]: ['fillParent'],
      },
    },
  },
  'shoutem.navigation.TabBar': {
    'shoutem.ui.Screen': {
      // TabBar container
      'shoutem.ui.View': {
        position: 'absolute',
        borderTopWidth: 1,
        borderColor: variables.mainNavBorderColor,
        backgroundColor: variables.mainNavBackground,
        bottom: 0,
        left: 0,
        right: 0,
      },
      paddingBottom: 60, // TabBar height
    },
  },
  'shoutem.navigation.TabBarItem': {
    [INCLUDE]: ['mainNavigation'],
    '.icon-and-text': {
      icon: {
        marginTop: 8,
      },
      text: {
        marginBottom: 8,
        fontSize: 10,
      },
    },
    '.icon-only': {
      item: {
        justifyContent: 'center',
      }
    },
    '.text-only': {
      text: {
        fontSize: 15,
      },
      item: {
        justifyContent: 'center',
      }
    },
    '.selected': {
      item: {
        borderColor: variables.mainNavSelectedItemBorderColor,
      }
    },
    item: {
      height: 60,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 0,
      borderBottomWidth: 2,
      borderRadius: 0,
      paddingHorizontal: SMALL_GUTTER,
      borderColor: 'transparent',
      activeOpacity: 1,
    },
    icon: {
      height: 24,
      padding: 12,
      width: null,
      flex: 0,
      resizeMode: 'contain',
    },
    text: {
      fontWeight: 'normal',
      flex: -1,
      margin: 0,
    },
  },
  'shoutem.navigation.Drawer': {
    menu: {
      // Reverse Drawer full-screen marginTop offset and add real offset by design
      paddingTop: NAVIGATION_BAR_HEIGHT + 55,
      backgroundColor: variables.mainNavBackground,
    },
    underlayScreensWrapper: {
      marginLeft: -1,
      borderLeftWidth: 1,
      borderColor: variables.mainNavBorderColor,
    },
    screenStack: {
      cardStack: {
        shadowColor: 'rgba(0, 0, 0, 0.12)',
        shadowOpacity: 1,
        shadowRadius: 12,
      },
      card: {
        shadowOpacity: 0
      },
    },
    // Width of visible content when menu is opened
    visibleContentWidth: 54,
  },
  'shoutem.navigation.DrawerItem': {
    [INCLUDE]: ['mainNavigation'],
    item: {
      height: 64,
      marginBottom: MEDIUM_GUTTER,
      padding: 0,
      borderWidth: 0,
      borderRadius: 0,
      alignItems: 'center',
      justifyContent: 'flex-start',
      alignSelf: 'stretch',
      flexDirection: 'row',
      paddingLeft: LARGE_GUTTER,
      paddingRight: SMALL_GUTTER * 2,
      activeOpacity: 0.5,
    },
    icon: {
      height: 24,
      padding: 12,
      width: null,
      flex: 0,
      resizeMode: 'contain',
      marginRight: LARGE_GUTTER,
    },
    text: {
      justifyContent: 'flex-start',
      margin: 0,
      fontSize: 15,
    },
  },
  'shoutem.navigation.IconGrid': {
    [INCLUDE]: ['folderNavigation'],
    '.text-hidden': {
      item: {
        marginBottom: GRID_ITEM_VERTICAL_GUTTER,
      },
    },
    page: {
      [INCLUDE]: ['alignmentVariants'],

      paddingTop: GRID_ITEM_VERTICAL_GUTTER,
      // Compensate 2px that left on the row side. Row calculated with in IconGrid is 373.
      paddingHorizontal: 1,
    },
    row: {
      // Row width is calculated by adding up margin and width of all items in the row.
      // Number of columns is used as number of items in the row.

      '.left-alignment': {
        // If Grid is is aligned to right (gridAlignment = topLeft || middleLeft || bottomLeft)
        // Row content should also start from left.
        // DEFAULT is Left alignment
      },
      '.center-alignment': {
        // If Grid is is aligned to right (gridAlignment = topCenter || middleCenter || bottomCenter)
        // Same as left-alignment
      },
      '.right-alignment': {
        // If Grid is is aligned to right (gridAlignment = topRight || middleRight || bottomRight)
        // Row content should also start from right.
        justifyContent: 'flex-end',
      },
      paddingRight: GRID_ITEM_HORIZONTAL_GUTTER, // Used to calculate row width
      flexDirection: 'row',
    },
    item: {
      backgroundColor: 'transparent', // Override MainNavigation item color
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      width: 72, // Used to calculate row width
      marginLeft: GRID_ITEM_HORIZONTAL_GUTTER, // Used to calculate row width
      marginBottom: 0,
      height: null, // to stretch item height by its content
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 64,
      height: 64,
    },
    icon: {},
    text: {
      fontSize: 10,
      marginBottom: 12,
      height: 12,
      lineHeight: 12,
      maxWidth: 72,
      flex: -1,
    },
  },
  'shoutem.navigation.List': {
    [INCLUDE]: ['folderNavigation'],
    // In item alignments, set on builder
    '.in-item-alignment-left': {
      iconAndTextContainer: {
        justifyContent: 'flex-start',
      },
    },
    '.in-item-alignment-center': {
      iconAndTextContainer: {
        justifyContent: 'center',
      },
    },
    '.in-item-alignment-right': {
      iconAndTextContainer: {
        justifyContent: 'flex-end',
        paddingRight: MEDIUM_GUTTER,
      },
    },
    '.large-icon': {
      item: {
        height: 80,
      },
    },
    '.text-hidden': {},

    page: {
      flexDirection: 'column',
    },
    item: {
      alignItems: 'center',
      flexDirection: 'row',
      borderTopWidth: 1,
      borderColor: variables.folderListBorderColor,
      backgroundColor: variables.paperColor,
      height: 65,
    },
    iconAndTextContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
      paddingLeft: MEDIUM_GUTTER,
    },
    icon: {
      flex: 0,
    },
    text: {
      fontSize: 15,
      marginLeft: MEDIUM_GUTTER,
    },
    chevronContainer: {
      marginRight: 7,
      height: 24,
      width: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chevron: {
      color: variables.mainNavItemColor,
    },
  },

  'shoutem.navigation.CardList': {
    page: {
      // Page padding bottom is defined by item marginBottom
      '.small-gutter': {
        paddingTop: 8,
        paddingHorizontal: 8,
      },
      '.medium-gutter': {
        paddingTop: 16,
        paddingHorizontal: 16,
      },
      '.large-gutter': {
        paddingTop: 24,
        paddingHorizontal: 24,
      },
      '.full-width': {
        paddingHorizontal: 0,
      },
      '.no-gutter': {},
      flexDirection: 'column',
    },
    item: {
      [INCLUDE]: ['alignmentVariants'],
      // Related with page gutter
      '.small-gutter': {
        marginBottom: 8,
      },
      '.medium-gutter': {
        marginBottom: 16,
      },
      '.large-gutter': {
        marginBottom: 24,
      },
      '.no-gutter': {},
      // Represents height/pageWidth ratio
      heights: {
        small: 0.33,
        medium: 0.5,
        large: 0.625,
      },
    },
    text: {
      flex: 0,
      width: null,
      fontSize: 15,
      marginLeft: MEDIUM_GUTTER,
      color: variables.folderItemColor,
    },
  },

  //
  // Empty State (error page)
  //
  'shoutem.ui.EmptyStateView': {
    'shoutem.ui.View': {
      'shoutem.ui.Subtitle': {
        marginTop: MEDIUM_GUTTER,
        width: 120,
      },

      'shoutem.ui.View': {
        '.anchor-bottom': {
          position: 'absolute',
          bottom: 0,
        },

        '.icon-placeholder': {
          height: 62,
          width: 62,
          backgroundColor: 'rgba(3, 3, 3, 0.1)',
          borderRadius: 31,
          justifyContent: 'center',
        },
      },
    },
  },

  //
  // WebView
  //
  'shoutem.webview.NavigationToolbar': {
    'shoutem.ui.View': {
      '.container': {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 56,
        backgroundColor: '#eeeeee',
        borderTopColor: 'rgba(20, 20, 20, 0.2)',
        borderTopWidth: StyleSheet.hairlineWidth,
      },

      'shoutem.ui.View': {
        '.navigation-buttons': {
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 140,
        },

        'shoutem.ui.Button': {
          'shoutem.ui.Icon': {
            '.disabled': {
              color: '#a6a6a6',
            },

            color: '#5f5f5f',
          },
        },
      },
    },
  },
})
