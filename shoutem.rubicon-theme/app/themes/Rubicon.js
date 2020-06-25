import {
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  Dimensions,
} from 'react-native';
import _ from 'lodash';

import {
  getTheme,
  defaultThemeVariables as defaultUiThemeVariables,
  dimensionRelativeToIphone,
  Device,
} from '@shoutem/ui';

import { INCLUDE, changeColorAlpha } from '@shoutem/theme';

import { autoRehydrate } from 'redux-persist';
import {
  IPHONE_X_HOME_INDICATOR_PADDING,
  IPHONE_X_NOTCH_PADDING,
  IPHONE_XR_NOTCH_PADDING,
  NAVIGATION_HEADER_HEIGHT,
  TAB_BAR_ITEM_HEIGHT,
} from '../const';

const window = Dimensions.get('window');

const NAVIGATION_BAR_HEIGHT = Device.select({
  iPhoneX: NAVIGATION_HEADER_HEIGHT + IPHONE_X_NOTCH_PADDING,
  iPhoneXR: NAVIGATION_HEADER_HEIGHT + IPHONE_XR_NOTCH_PADDING,
  default: NAVIGATION_HEADER_HEIGHT,
});

const TAB_BAR_HEIGHT = Device.select({
  iPhoneX: TAB_BAR_ITEM_HEIGHT + IPHONE_X_HOME_INDICATOR_PADDING,
  iPhoneXR: TAB_BAR_ITEM_HEIGHT + IPHONE_X_HOME_INDICATOR_PADDING,
  default: TAB_BAR_ITEM_HEIGHT,
});

export const defaultThemeVariables = {
  ...defaultUiThemeVariables,

  // Horizontal gutter is calculated to have 24px margin between every ICON and screen edge.
  gridItemHorizontalGutter: 17,
  gridItemVerticalGutter: 24,
};

export default (customVariables = {}) => {
  const variables = {
    ...defaultThemeVariables,
    ...customVariables,
  };

  return _.merge({}, getTheme(variables), {
    // Html
    'shoutem.ui.Html': {
      a: {
        text: {
          fontWeight: '700',
          color: variables.title.color,
        },
      },
      'se-attachment': {
        gallery: {
          container: {
            height: dimensionRelativeToIphone(130),
          },
        },
        video: {
          container: {
            width: 300,
          },
        },
      },
    },

    // SimpleHtml
    'shoutem.ui.SimpleHtml': {
      container: {
        padding: variables.mediumGutter,
      },
      prefix: {
        color: variables.text.color,
        fontFamily: 'Rubik-Regular',
        fontSize: 15,
      },
      baseFont: {
        ...variables.text,
      },
      tags: {
        h1: {
          fontWeight: '700',
          fontFamily: 'Rubik-Regular',
          marginBottom: variables.mediumGutter,
          marginTop: variables.mediumGutter,
          color: variables.heading.color,
        },
        h2: {
          fontWeight: '700',
          fontFamily: 'Rubik-Regular',
          marginBottom: variables.mediumGutter,
          marginTop: variables.mediumGutter,
          color: variables.heading.color,
        },
        h3: {
          fontWeight: '700',
          fontFamily: 'Rubik-Regular',
          marginTop: variables.mediumGutter,
          marginBottom: variables.mediumGutter,
          color: variables.heading.color,
        },
        h4: {
          fontWeight: '700',
          fontFamily: 'Rubik-Regular',
          marginTop: variables.mediumGutter,
          marginBottom: variables.mediumGutter,
          color: variables.heading.color,
        },
        h5: {
          fontWeight: '700',
          fontFamily: 'Rubik-Regular',
          marginTop: variables.mediumGutter,
          marginBottom: variables.mediumGutter,
          color: variables.heading.color,
        },
        a: {
          fontWeight: '700',
          fontFamily: 'Rubik-Regular',
          fontSize: 15,
          textDecorationLine: 'none',
          color: variables.title.color,
        },
        p: {
          fontFamily: 'Rubik-Regular',
          fontSize: 15,
          marginTop: variables.mediumGutter,
          marginBottom: variables.mediumGutter,
          color: variables.text.color,
        },
        li: {
          fontFamily: 'Rubik-Regular',
          fontSize: 15,
          color: variables.text.color,
        },
        img: {
          marginTop: variables.mediumGutter,
          marginBottom: variables.mediumGutter,
        },
      },
    },

    // Lightbox
    'shoutem.ui.Lightbox': {
      'shoutem.ui.Image': {
        '.preview': {
          flex: 1,
          resizeMode: 'contain',
        },
      },
    },

    statusBar: {
      backgroundColor: variables.statusBarColor,
      statusBarStyle: variables.statusBarStyle,
    },

    clearNavigationBar: {
      'shoutem.ui.Button': {
        [INCLUDE]: ['clearButton'],
        'shoutem.ui.Icon': {
          color: variables.navBarIconsColor,
        },
        'shoutem.ui.Text': {
          color: variables.navBarText.color,
        },
      },
    },

    //
    // Navigation
    // Drawer, TabBar, Sub-navigation

    mainNavigation: {
      '.selected': {
        // TouchableOpacity component
        // "Item" represent generic name for navigation action components
        // TabBarItem -> Button; Drawer -> Row; IconGrid -> Cell
        item: {
          backgroundColor: variables.mainNavSelectedItemBackground,
        },
        icon: {
          tintColor:
            variables.mainNavSelectedItemIconColor ||
            variables.mainNavSelectedItemColor,
        },
        text: {
          color:
            variables.mainNavSelectedItemTextColor ||
            variables.mainNavSelectedItemColor,
        },
      },
      item: {
        backgroundColor: variables.mainNavItemBackground,
      },
      icon: {
        tintColor: variables.mainNavItemIconColor || variables.mainNavItemColor,
      },
      text: {
        color: variables.mainNavItemTextColor || variables.mainNavItemColor,
      },
    },
    subNavigation: {
      '.main-navigation': {
        // Active when the IconGrid or List layout is on root screen (in app's main navigation)
        [INCLUDE]: ['mainNavigation'],
      },
      '.text-hidden': {},
      '.small-icon': {
        icon: {
          width: 24,
          height: 24,
        },
      },
      '.medium-icon': {
        icon: {
          width: 36,
          height: 36,
        },
      },
      '.large-icon': {
        icon: {
          width: 48,
          height: 48,
        },
      },
      '.extraLarge-icon': {
        icon: {
          width: 60,
          height: 60,
        },
      },
      '.xxl-icon': {
        icon: {
          width: 70,
          height: 70,
        },
      },
      '.xxxl-icon': {
        icon: {
          width: 80,
          height: 80,
        },
      },
      '.xxxxl-icon': {
        icon: {
          width: 90,
          height: 90,
        },
      },

      page: {
        [INCLUDE]: ['alignmentVariants'],
      },

      item: {
        backgroundColor: variables.subNavItemBackground,
      },

      icon: {
        tintColor: variables.subNavItemColor,
      },

      text: {
        color: variables.subNavItemColor,
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
      screen: {
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
        paddingBottom: TAB_BAR_HEIGHT,
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
        },
      },
      '.text-only': {
        text: {
          fontSize: 15,
        },
        item: {
          justifyContent: 'center',
        },
      },
      '.selected': {
        item: Device.select({
          iPhoneX: {
            borderTopWidth: 2,
            borderColor: variables.mainNavSelectedItemBorderColor,
          },
          iPhoneXR: {
            borderTopWidth: 2,
            borderColor: variables.mainNavSelectedItemBorderColor,
          },
          default: {
            borderBottomWidth: 2,
            borderColor: variables.mainNavSelectedItemBorderColor,
          },
        }),
      },
      item: {
        height: TAB_BAR_ITEM_HEIGHT,
        marginBottom: Device.select({
          iPhoneX: IPHONE_X_HOME_INDICATOR_PADDING,
          iPhoneXR: IPHONE_X_HOME_INDICATOR_PADDING,
          default: 0,
        }),
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0,
        borderRadius: 0,
        paddingHorizontal: variables.smallGutter,
        borderColor: 'transparent',
        touchableOpacity: {
          activeOpacity: 0.5,
        },
        touchableNativeFeedback: {
          background:
            Platform.OS === 'android' &&
            // Ripple effect is not supported on older Android versions and crashes the app
            (Platform.Version >= 21
              ? TouchableNativeFeedback.Ripple(
                changeColorAlpha(
                  variables.mainNavItemIconColor ||
                  variables.mainNavItemColor,
                  0.3,
                ),
              )
              : TouchableNativeFeedback.SelectableBackground()),
        },
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
        // container
        paddingTop: NAVIGATION_BAR_HEIGHT,
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
          shadowOpacity: 0,
        },
      },
      // Width of visible content when menu is opened
      visibleContentWidth: 54,
    },
    'shoutem.navigation.DrawerItem': {
      [INCLUDE]: ['mainNavigation'],
      item: {
        height: 64,
        marginBottom: variables.mediumGutter,
        padding: 0,
        borderWidth: 0,
        borderRadius: 0,
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'stretch',
        flexDirection: 'row',
        paddingLeft: variables.largeGutter,
        paddingRight: variables.smallGutter * 2,
        touchableOpacity: {
          activeOpacity: 0.5,
        },
        touchableNativeFeedback: {
          background:
            Platform.OS === 'android' &&
            // Ripple effect is not supported on older Android versions and crashes the app
            (Platform.Version >= 21
              ? TouchableNativeFeedback.Ripple(
                changeColorAlpha(
                  variables.mainNavItemIconColor ||
                  variables.mainNavItemColor,
                  0.2,
                ),
              )
              : TouchableNativeFeedback.SelectableBackground()),
        },
      },
      icon: {
        height: 24,
        padding: 12,
        width: null,
        flex: 0,
        resizeMode: 'contain',
        marginRight: variables.largeGutter,
      },
      text: {
        justifyContent: 'flex-start',
        margin: 0,
        fontSize: 15,
      },
    },
    'shoutem.navigation.IconGrid': {
      [INCLUDE]: ['subNavigation'],
      '.text-hidden': {
        item: {
          marginBottom: 44,
        },
      },

      '.comfortable': {
        page: {
          paddingTop: 48,
        },
        row: {
          paddingRight: 48,
        },
        '.2-rows': {
          item: {
            marginBottom: 24,
          },
        },
        '.3-rows': {
          item: {
            marginBottom: 24,
          },
        },
        '.4-rows': {
          item: {
            marginBottom: 24,
          },
        },
        '.5-rows': {
          item: {
            marginBottom: 12,
          },
        },
        '.6-rows': {
          page: {
            paddingTop: variables.gridItemVerticalGutter,
          },
          row: {
            paddingRight: variables.gridItemHorizontalGutter,
          },
        },
        '.2-columns': {
          item: {
            marginLeft: 48,
          },
        },
        '.3-columns': {
          item: {
            marginLeft: 36,
          },
        },
        '.4-columns': {
          page: {
            paddingTop: variables.gridItemVerticalGutter,
          },
          row: {
            paddingRight: variables.gridItemHorizontalGutter,
          },
        },
      },
      '.extraLarge-icon': {
        text: {
          height: 'auto',
          marginTop: 6,
          paddingTop: 4,
          paddingBottom: 4,
          fontSize: 11,
        },
      },
      '.xxl-icon': {
        text: {
          height: 'auto',
          marginTop: 8,
          paddingTop: 6,
          paddingBottom: 6,
          fontSize: 12,
        },
      },
      '.xxxl-icon': {
        text: {
          height: 'auto',
          marginTop: 12,
          paddingTop: 8,
          paddingBottom: 8,
          fontSize: 13,
        },
      },
      '.xxxxl-icon': {
        text: {
          height: 'auto',
          marginTop: 16,
          paddingTop: 8,
          paddingBottom: 10,
          fontSize: 14,
        },
      },

      page: {
        paddingTop: variables.gridItemVerticalGutter,
        // Compensate 2px that left on the row side. Row calculated with in IconGrid is 373.
        paddingHorizontal: 1,
      },
      row: {
        // Row width is calculated by adding up margin and width of all items in the row.
        // Number of columns is used as number of items in the row.

        '.left-alignment': {
          // If Grid is aligned to the left (gridAlignment = topLeft || middleLeft || bottomLeft)
          // Row content should also start from left.
          // DEFAULT is Left alignment
        },
        '.center-alignment': {
          // If Grid is is aligned to the center
          // (gridAlignment = topCenter || middleCenter || bottomCenter)
          // Same as left-alignment
        },
        '.right-alignment': {
          // If Grid is is aligned to right (gridAlignment = topRight || middleRight || bottomRight)
          // Row content should also start from right.
          justifyContent: 'flex-end',
        },
        paddingRight: variables.gridItemHorizontalGutter, // Used to calculate row width
        flexDirection: 'row',
      },
      item: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: 72, // Used to calculate row width
        marginLeft: variables.gridItemHorizontalGutter, // Used to calculate row width
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
        marginBottom: 12,
        maxWidth: 72,
        flex: -1,
      },
      'small-text': {
        fontSize: 11,
        lineHeight: 18,
      },
      'medium-text': {
        fontSize: 15,
        lineHeight: 24,
      },
      'large-text': {
        fontSize: 20,
        lineHeight: 32,
      },
    },
    'shoutem.navigation.List': {
      [INCLUDE]: ['subNavigation'],
      '.main-navigation': {
        item: {
          borderColor: variables.mainNavBorderColor,
        },
        chevron: {
          color: changeColorAlpha(
            variables.mainNavItemIconColor || variables.mainNavItemColor,
            0.5,
          ),
        },
      },
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
          paddingRight: variables.mediumGutter,
        },
      },
      '.large-icon': {
        item: {
          height: 80,
        },
      },
      '.text-hidden': {},

      '.icon-hidden': {
        iconAndTextContainer: {
          paddingLeft: 0,
        },
      },

      page: {
        flexDirection: 'column',
      },
      item: {
        alignItems: 'center',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: variables.subNavListBorderColor,
        height: 65,
      },
      iconAndTextContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        paddingLeft: variables.mediumGutter,
      },
      icon: {
        flex: 0,
      },
      text: {
        marginLeft: variables.mediumGutter,
      },
      chevronContainer: {
        marginRight: 7,
        height: 24,
        width: 24,
        justifyContent: 'center',
        alignItems: 'center',
      },
      chevron: {
        color: changeColorAlpha(variables.subNavItemColor, 0.5),
      },
      'small-text': {
        fontSize: 15,
        lineHeight: 23,
      },
      'medium-text': {
        fontSize: 25,
        lineHeight: 38,
      },
      'large-text': {
        fontSize: 40,
        lineHeight: 60,
      },
    },
    'shoutem.navigation.TileGrid': {
      gridRow: {
        padding: 0,
        margin: 0,
        flex: 0,
      },
      page: {
        // Page padding bottom is defined by item marginBottom
        '.small-gutter': {
          paddingTop: 2,
          paddingHorizontal: 2,
        },
        '.medium-gutter': {
          paddingTop: 4,
          paddingHorizontal: 4,
        },
        '.large-gutter': {
          paddingTop: 8,
          paddingHorizontal: 8,
        },
        '.no-gutter': {
          padding: 0,
          margin: 0,
        },
      },
      item: {
        [INCLUDE]: ['alignmentVariants'],
        // Related with page gutter
        '.small-gutter': {
          margin: 2,
          height: dimensionRelativeToIphone(179),
        },
        '.medium-gutter': {
          margin: 4,
          height: dimensionRelativeToIphone(173),
        },
        '.large-gutter': {
          margin: 8,
          height: dimensionRelativeToIphone(161),
        },
        '.no-gutter': {
          margin: 0,
          height: dimensionRelativeToIphone(188),
        },
        width: dimensionRelativeToIphone(188),
        backgroundColor: variables.subNavItemBackground,
      },
      text: {
        flex: 0,
        width: null,
        marginLeft: variables.smallGutter,
        color: variables.subNavItemColor,
      },
      'small-text': {
        fontSize: 15,
        lineHeight: 23,
      },
      'medium-text': {
        fontSize: 25,
        lineHeight: 38,
      },
      'large-text': {
        fontSize: 40,
        lineHeight: 60,
      },
      backgroundImage: {
        resizeMode: 'cover',
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
        backgroundColor: variables.subNavItemBackground,
      },
      text: {
        flex: 0,
        width: null,
        marginLeft: variables.mediumGutter,
        color: variables.subNavItemColor,
      },
      'small-text': {
        fontSize: 15,
        lineHeight: 23,
      },
      'medium-text': {
        fontSize: 25,
        lineHeight: 38,
      },
      'large-text': {
        fontSize: 40,
        lineHeight: 60,
      },
    },

    //
    // Empty State (error page)
    //
    'shoutem.ui.EmptyStateView': {
      'shoutem.ui.View': {
        'shoutem.ui.Subtitle': {
          marginTop: variables.mediumGutter,
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

      '.wide-subtitle': {
        'shoutem.ui.View': {
          'shoutem.ui.Subtitle': {
            marginTop: variables.mediumGutter,
            width: 180,
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
    },

    //
    // WebView
    //
    'shoutem.web-view.NavigationToolbar': {
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

    //
    // Photos
    //
    'shoutem.photos.PhotosGrid': {
      list: {
        listContent: {
          padding: variables.mediumGutter,
        },
      },
    },
    'shoutem.rss-photos.PhotosGrid': {
      list: {
        listContent: {
          padding: variables.mediumGutter,
        },
      },
    },

    // Agora Video Call Screen
    'shoutem.agora.VideoCallScreen': {
      agoraScreenContainer: {
        flex: 1,
        backgroundColor: '#222222',
      },
    },

    'shoutem.agora.VideoCallStartingView': {
      videoCallStartingView: {
        flex: 1,
        backgroundColor: '#222222',
      },
      peerName: {
        color: 'white',
        fontSize: 20,
      },
      bottomContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: Device.select({
          iPhoneX: 36 + IPHONE_X_HOME_INDICATOR_PADDING,
          iPhoneXR: 36 + IPHONE_X_HOME_INDICATOR_PADDING,
          default: 20,
        }),
      },
      controlButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
      },
    },

    'shoutem.agora.WaitingForPeerView': {
      waitingForPeerView: {
        backgroundColor: '#222222',
        flex: 1,
      },
      message: {
        flex: 1,
        marginHorizontal: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        'shoutem.ui.Text': {
          textAlign: 'center',
          color: 'white',
          fontSize: 20,
        },
      },
      localVideo: {
        flex: 1,
      },
      peerName: {
        color: 'white',
        fontSize: 20,
      },
      bottomContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: Device.select({
          iPhoneX: 36 + IPHONE_X_HOME_INDICATOR_PADDING,
          iPhoneXR: 36 + IPHONE_X_HOME_INDICATOR_PADDING,
          default: 20,
        }),
      },
    },

    // Agora Video Call View
    'shoutem.agora.VideoCallView': {
      videoCallView: {
        backgroundColor: '#222222',
        flex: 1,
      },
      agoraTwoPeersView: {
        flex: 1,
      },
      peerName: {
        color: 'white',
        fontSize: 20,
      },
      stopwatch: {
        container: {
          paddingVertical: 5,
          backgroundColor: 'transparent',
        },
        text: {
          fontSize: 15,
          color: 'white',
          marginLeft: 7,
        },
      },
      bottomContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: Device.select({
          iPhoneX: 36 + IPHONE_X_HOME_INDICATOR_PADDING,
          iPhoneXR: 36 + IPHONE_X_HOME_INDICATOR_PADDING,
          default: 20,
        }),
      },
    },

    // Agora Video Call View
    'shoutem.agora.LocalVideoContainer': {
      localVideoContainer: {
        position: 'absolute',
        width: 115,
        height: 161,
        top: Device.select({
          iPhoneX: 34 + IPHONE_X_NOTCH_PADDING,
          iPhoneXR: 30 + IPHONE_XR_NOTCH_PADDING,
          default: 30,
        }),
        right: 15,
      },
      localVideo: {
        overflow: 'hidden',
        flex: 1,
        borderRadius: 6,
      },
      switchCameraButton: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        height: 32,
        width: 32,
        borderRadius: 16,
        backgroundColor: 'white',
        alignSelf: 'flex-start',
      },
      switchCameraIcon: {
        textAlign: 'center',
        fontSize: 24,
        width: 24,
        height: 24,
        color: 'black',
      },
    },

    'shoutem.agora.ControlButtonsView': {
      controlButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
      },
      startCall: {
        height: 70,
        width: 70,
        borderRadius: 35,
        backgroundColor: '#00B300',
        margin: 15,
        'shoutem.ui.Icon': {
          transform: [{ rotate: '220deg' }],
          width: 24,
          height: 24,
          color: 'white',
        },
      },
      endCall: {
        height: 70,
        width: 70,
        borderRadius: 35,
        backgroundColor: '#FF5858',
        margin: 15,
        'shoutem.ui.Icon': {
          width: 24,
          height: 24,
          color: 'white',
        },
      },
      audioButton: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        margin: 15,
      },
      audioIcon: {
        width: 24,
        height: 24,
        color: 'black',
      },
      videoButton: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: 'white',
        margin: 15,
      },
      videoIcon: {
        width: 24,
        height: 24,
        color: 'black',
      },
      buttonDisabled: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: '#FFFFFF33',
        margin: 15,
      },
      iconDisabled: {
        width: 24,
        height: 24,
        color: '#FFFFFF4D',
      },
    },

    'shoutem.agora.ProfileImage': {
      profileImage: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        'shoutem.ui.ImageBackground': {
          height: 145,
          width: 145,
          borderRadius: 72,
          overflow: 'hidden',
        },
      },
    },

    // Auth Apple Sign In Button
    'shoutem.auth.AppleSignInButton': {
      appleButton: {
        width: '100%',
        minWidth: 140,
        height: 44,
        margin: 10,
        alignSelf: 'center',
      },
    },

    'shoutem.auth.FacebookButton': {
      facebookButton: {
        width: '100%',
        minWidth: 140,
        height: 44,
        marginVertical: 10,
        borderRadius: 6,
        backgroundColor: '#4267B2',
        alignSelf: 'center',
        'shoutem.ui.Text': {
          color: '#ffffff',
          fontSize: 16,
          fontWeight: '600',
          fontFamily: 'Rubik-Regular',
        },
        'shoutem.ui.Icon': {
          color: '#ffffff',
          fontSize: 16,
        },
      },
    },

    // Auth HorizontalSeparator
    'shoutem.auth.HorizontalSeparator': {
      'shoutem.ui.View': {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 22,
        'shoutem.ui.View': {
          backgroundColor: '#c5c3c3',
          flex: 5,
          height: 1,
          width: '100%',
        },
        'shoutem.ui.Text': {
          fontSize: 14,
          paddingLeft: 20,
          paddingRight: 20,
          color: '#c5c3c3',
        },
      },
    },

    // Auth PasswordTextInput
    'shoutem.auth.PasswordTextInput': {
      'shoutem.ui.View': {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        'shoutem.ui.TextInput': {
          borderRadius: 6,
          height: 50,
          flex: 1,
          marginBottom: 20,
          paddingHorizontal: 15,
          paddingVertical: 4,
        },
        'shoutem.ui.Button': {
          position: 'absolute',
          right: 0,
          top: 12,
          padding: 5,
        },
      },
    },

    'shoutem.auth.LoginForm': {
      usernameContainer: {
        marginBottom: 20,
        'shoutem.ui.Text': {
          fontSize: 15,
          paddingBottom: 5,
        },
        'shoutem.ui.TextInput': {
          borderRadius: 6,
          height: 50,
          paddingHorizontal: 15,
          paddingVertical: 4,
        },
      },

      passwordLabelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 5,
        'shoutem.ui.Text': {
          fontSize: 15,
        },
        'shoutem.ui.Button': {
          'shoutem.ui.Text': {
            color: variables.caption.color,
            fontSize: 11,
            fontWeight: '400',
            margin: 0,
          },
        },
      },

      loginButton: {
        borderRadius: 6,
        width: '100%',
        minWidth: 140,
        height: 44,
        marginTop: 32,
        marginBottom: 20,
        'shoutem.ui.Text': {
          margin: 0,
          fontSize: 16,
        },
      },
    },

    'shoutem.auth.LoginScreen': {
      loginScreen: {
        marginHorizontal: 30,
        marginTop: 40,
      },
    },

    'shoutem.auth.RegisterButton': {
      'shoutem.ui.View': {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        justifySelf: 'flex-end',
        marginTop: 10,
        paddingBottom: 20,
        'shoutem.ui.Caption': {
          lineHeight: 24,
          fontSize: 12,
        },
        'shoutem.ui.Button': {
          paddingLeft: 5,
          'shoutem.ui.Text': {
            lineHeight: 24,
            fontSize: 12,
            margin: 0,
          },
        },
      },
    },

    // Auth Register form
    'shoutem.auth.RegisterForm': {
      'shoutem.ui.View': {
        'shoutem.ui.Text': {
          paddingBottom: 5,
          fontSize: 15,
        },
        'shoutem.ui.TextInput': {
          borderRadius: 6,
          height: 50,
          marginBottom: 20,
          paddingHorizontal: 15,
          paddingVertical: 4,
        },
        'shoutem.ui.View': {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 20,
          'shoutem.ui.TextInput': {
            borderRadius: 6,
            height: 50,
            flex: 1,
          },
        },
      },
      registerButton: {
        borderRadius: 6,
        width: '100%',
        minWidth: 140,
        height: 44,
        marginVertical: 20,
        alignSelf: 'center',
        'shoutem.ui.Text': {
          fontSize: 16,
          margin: 0,
        },
      },
    },
    'shoutem.auth.RegisterScreen': {
      registerScreenMargin: {
        marginHorizontal: 30,
        marginTop: 40,
      },
    },

    // Camera
    'shoutem.camera.QRCodeScanner': {
      cameraContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      cameraFocusFrame: {
        // TODO: Reimplement this with relative sizes and test on multiple devices
        width: 175,
        height: 165,
        resizeMode: 'contain',
      },
      cameraView: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      noPermissionsMessage: {
        alignSelf: 'center',
        fontSize: 18,
        lineHeight: 20,
      },
    },

    // Deals
    'shoutem.deals.DealsListScreen': {
      titleContainer: Platform.select({
        android: {
          paddingRight: 40,
          paddingLeft: 20,
        },
        ios: {
          paddingRight: 50,
          paddingLeft: 20,
        },
      }),
    },

    'shoutem.deals.DealsGridScreen': {
      titleContainer: Platform.select({
        android: {
          paddingRight: 40,
          paddingLeft: 20,
        },
        ios: {
          paddingRight: 50,
          paddingLeft: 20,
        },
      }),
    },

    // Loyalty
    'shoutem.loyalty.PointsCardScreen': {
      qrBackground: {
        backgroundColor: '#ffffff',
        margin: 10,
      },
    },

    'shoutem.loyalty.VerificationScreen': {
      qrBackground: {
        backgroundColor: '#ffffff',
      },
    },

    'shoutem.loyalty.SmallPointCardView': {
      container: {
        borderRadius: 4,
        shadowColor: variables.shadowColor,
        shadowOpacity: 1,
        shadowOffset: { width: 1, height: 1 },
      },
      innerContainer: {
        borderRadius: 4,
        overflow: 'hidden',
      },
      pointsTitle: {
        marginLeft: 28,
        textAlign: 'left',
      },
      points: {
        marginLeft: 28,
        textAlign: 'left',
        fontSize: 36,
        lineHeight: 40,
      },
      qrBackground: {
        backgroundColor: '#ffffff',
        overflow: 'hidden',
      },
    },

    'shoutem.loyalty.RewardProgressBar': {
      '.short': {
        container: {
          marginTop: -2,
          marginRight: 12,
          marginLeft: -12,
        },
      },

      container: {
        height: 5,
        borderRadius: 100,
        backgroundColor: variables.backgroundColor,
      },

      earnedPoints: {
        borderRadius: 100,
        height: 5,
        backgroundColor: variables.featuredColor,
      },
    },

    'shoutem.loyalty.RewardsGaugeProgressBar': {
      '.secondary': {
        pointsLabel: {
          position: 'absolute',
          top: '40%',

          'shoutem.ui.Text': {
            color: '#ffffff',
          },

          'shoutem.ui.Title': {
            color: '#ffffff',
          },
        },

        progressBar: {
          opacity: 0.5,
          stroke: '#ffffff',
        },

        progressBarCompleted: {
          stroke: '#ffffff',
        },
      },

      container: {
        height: 275,
        width: 275,
      },

      pointsLabel: {
        position: 'absolute',
        top: '40%',
      },

      progressContainer: {
        height: 260,
        width: 260,
      },

      progressRadius: 120,

      reward: {
        position: 'absolute',
        marginLeft: -9,
        marginTop: -9,
      },
    },

    'shoutem.loyalty.GaugeProgressBar': {
      progressContainer: {
        transform: [{ rotate: '135deg' }],
      },

      progressBar: {
        fill: 'none',
        stroke: variables.lineColor,
        strokeLinecap: 'round',
        strokeWidth: 10,
      },

      progressBarCompleted: {
        fill: 'none',
        stroke: variables.indicatorColor,
        strokeLinecap: 'round',
        strokeWidth: 10,
      },
    },

    'shoutem.loyalty.PlaceRewardIcon': {
      reward: {
        backgroundColor: '#ffffff',
        borderColor: variables.lineColor,
        borderRadius: 36,
        borderWidth: 3,
        height: 36,
        padding: 2,
        width: 36,

        'shoutem.ui.Icon': {
          color: variables.lineColor,
        },
      },

      rewardReached: {
        backgroundColor: variables.indicatorColor,
        borderColor: '#ffffff',

        'shoutem.ui.Icon': {
          color: '#ffffff',
        },
      },
    },

    // Social
    'shoutem.social.CreateStatusScreen': {
      footer: {
        backgroundColor: variables.paperColor,
        paddingBottom: IPHONE_X_HOME_INDICATOR_PADDING + variables.smallGutter,
      },
    },

    'shoutem.social.StatusView': {
      reportButton: {
        fontSize: 16,
        color: '#C4C4C4',
        paddingVertical: 10,
        paddingLeft: 10,
      },
    },

    'shoutem.podcast.PodcastPlayer': {
      container: {
        paddingBottom: Device.select({
          iPhoneX: IPHONE_X_NOTCH_PADDING,
          iPhoneXR: IPHONE_XR_NOTCH_PADDING,
          default: 0,
        }),
      },
      slider: {
        height: 30,
        minimumTrackTintColor: changeColorAlpha(
          variables.primaryButtonText.color,
          0.6,
        ),
        maximumTrackTintColor: changeColorAlpha(
          variables.primaryButtonText.color,
          0.4,
        ),
        thumbTintColor: Platform.select({
          android: variables.primaryButtonText.color,
        }),
        marginVertical: 5,
      },
      skipButton: {
        width: 30,
        height: 30,
        padding: 0,
      },
      skipIcon: {
        color: variables.primaryButtonText.color,
      },
      skipIconSize: 35,
      timeDisplay: {
        lineHeight: 15,
        fontSize: 12,
      },
      playbackButtonStyle: {
        width: 90,
        height: 90,
        padding: 0,
        margin: 0,
        marginBottom: 3,
        marginLeft: 10,
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
      playbackIconStyle: {
        fontSize: 70,
        padding: 0,
        margin: 0,
      },
      spinnerStyle: {
        size: 40,
      },
    },

    'shoutem.radio.Radio': {
      clearRow: {
        backgroundColor: 'transparent',
        width: dimensionRelativeToIphone(375),
        paddingBottom: variables.largeGutter,
        paddingHorizontal: variables.largeGutter,
      },
      nowPlaying: {
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
      },
      nowPlayingText: {
        color: variables.imageOverlayTextColor,
        paddingBottom: variables.smallGutter * 2,
        fontSize: 15,
      },
      streamTitle: {
        color: variables.imageOverlayTextColor,
        fontSize: 15,
      },
      hiddenImage: {
        opacity: 0,
      },
    },

    'shoutem.radio.RadioPlayer': {
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
        borderColor: variables.primaryButtonBackgroundColor,
        borderWidth: 2,
        position: 'absolute',
        left: -dimensionRelativeToIphone(37.5),
        top: -dimensionRelativeToIphone(37.5),
        borderRadius: 200,
      },
      playbackIcon: {
        fontSize: dimensionRelativeToIphone(36),
        marginLeft: 10,
      },
      spinner: {
        marginTop: Platform.select({
          ios: 5,
        }),
        marginLeft: Platform.select({
          ios: 5,
        }),
        size: Platform.select({
          ios: 0,
          default: 18,
        }),
      },
    },

    // Notifications

    'shoutem.notification-center.NotificationRow': {
      message: {
        color: variables.notificationMessageColor,
      },
      timestamp: {
        color: variables.notificationTimestampColor,
      },
    },

    'shoutem.notification-center.NotificationDetailsScreen': {
      message: {
        color: variables.notificationMessageColor,
      },
      title: {
        color: variables.notificationTitleColor,
      },
      timestamp: {
        color: variables.notificationTimestampColor,
      },
    },

    // SendBird Extension

    'shoutem.sendbird.SectionFooter': {
      height: 15,
      backgroundColor: 'transparent',
    },

    'shoutem.sendbird.SectionHeader': {
      container: {
        height: 57,
        paddingLeft: 20,
        backgroundColor: '#FFFFFF',
      },
      text: {
        letterSpacing: -0.165,
        fontSize: 21,
        color: '#333333',
      },
    },

    'shoutem.sendbird.ChatWindowScreen': {
      screen: {
        backgroundColor: '#FFFFFF',
      },
      list: {
        listContent: {
          backgroundColor: '#FFFFFF',
        },
      },
    },

    'shoutem.sendbird.ExistingChannelListItem': {
      row: {
        height: 80,
        borderColor: 'rgba(130, 130, 130, 0.1)',
        borderBottomWidth: 1,
      },
      image: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginRight: 10,
      },
      indicator: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
      },
      unreadCountContainer: {
        backgroundColor: '#FF4F4F',
        height: 16,
        width: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      },
      unreadCountText: {
        color: '#FFFFFF',
        fontSize: 10,
      },
      text: {
        letterSpacing: -0.17,
        color: '#333333',
        fontSize: 13,
      },
      nickname: {
        fontSize: 15,
      },
      date: {
        opacity: 0.4,
        fontSize: 10,
      },
      unreadText: {
        fontWeight: '600',
      },
    },

    'shoutem.sendbird.SearchBar': {
      placeholderTextColor: 'rgba(0, 0, 0, 0.3)',
      container: {
        padding: 20,
        height: 80,
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(130, 130, 130, 0.1)',
        borderBottomWidth: 1,
      },
      input: {
        height: 40,
        borderRadius: 100,
        backgroundColor: '#F9F9F9',
        borderColor: 'rgba(130, 130, 130, 0.1)',
        borderWidth: 1,
        paddingTop: 11,
        paddingBottom: 11,
        paddingRight: 44,
        fontSize: 13,
        letterSpacing: -0.17,
        color: '#000000',
      },
      inputFocused: {
        borderColor: '#828282',
      },
      icon: {
        color: '#C4C4C4',
      },
      iconWrapper: {
        position: 'absolute',
        right: 35,
        top: 28,
      },
    },

    'shoutem.sendbird.EmptyChannelListComponent': {
      image: {
        resizeMode: 'contain',
        marginTop: 45,
        marginBottom: 30,
        height: (window.height * 227) / 812,
        width: window.width - 80,
      },
      title: {
        fontWeight: '500',
        fontSize: 21,
        lineHeight: 25,
        marginBottom: 20,
        letterSpacing: -0.165,
        color: '#000000',
      },
      description: {
        fontSize: 13,
        lineHeight: 18,
        letterSpacing: -0.165,
        color: '#333333',
        maxWidth: 200,
      },
    },

    'shoutem.sendbird.MessageBubble': {
      container: {
        borderRadius: 30,
        marginLeft: 40,
        marginRight: 20,
        backgroundColor: 'rgba(28, 171, 221, 0.1)',
        padding: 15,
      },
      secondaryContainer: {
        marginLeft: 20,
        marginRight: 40,
        backgroundColor: '#F9F9F9',
      },
      firstMessage: {
        borderTopEndRadius: 0,
      },
      fileMessage: {
        overflow: 'hidden',
        padding: 0,
      },
      firstMessageSecondary: {
        borderTopStartRadius: 0,
      },
      text: {
        fontSize: 13,
        letterSpacing: -0.17,
        color: '#000000',
      },
      secondaryText: {
        color: '#333333',
      },
      date: {
        opacity: 0.4,
        fontSize: 10,
        marginRight: 20,
        marginTop: 5,
      },
      dateSecondary: {
        marginRight: 0,
        marginLeft: 20,
      },
      docImage: {
        width: 200,
        height: 200,
      },
      fileNameText: {
        fontWeight: '500',
        fontSize: 13,
        lineHeight: 16,
        color: '#000000',
        maxWidth: 200,
      },
      fileSizeText: {
        fontSize: 10,
        lineHeight: 12,
        color: '#000000',
      },
    },

    'shoutem.sendbird.NewMessagesLabel': {
      text: {
        color: '#000000',
        fontSize: 10,
      },
      leadingLine: {
        height: 1,
        flex: 1,
        marginRight: 10,
        backgroundColor: '#333333',
        borderRadius: 1,
      },
      trailingLine: {
        height: 1,
        flex: 1,
        marginLeft: 10,
        backgroundColor: '#333333',
        borderRadius: 1,
      },
      textContainer: {
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#000000',
        paddingHorizontal: 8,
      },
    },

    'shoutem.sendbird.ChatEncryptionMessage': {
      container: {
        flex: 0,
        transform: [{ scaleY: -1 }],
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        maxWidth: 205,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        marginTop: 20,
      },
      text: {
        fontSize: 13,
        maxWidth: 156,
      },
      image: {
        width: 24,
        height: 24,
        marginRight: 5,
      },
    },

    'shoutem.sendbird.ChatInputBox': {
      container: {
        backgroundColor: '#FFFFFF',
        paddingLeft: 20,
        paddingTop: 14,
        paddingBottom: 9,
        paddingRight: 15,
        height: 60,
        borderColor: 'rgba(130, 130, 130, 0.1)',
        borderTopWidth: 1,
      },
      attachIcon: {
        icon: {
          width: 24,
          height: 24,
        },
        wrapper: {
          marginRight: 15,
        },
      },
      input: {
        flex: 1,
        height: 37,
        borderRadius: 100,
        backgroundColor: '#FFFFFF',
        borderColor: '#333333',
        borderWidth: 2,
        paddingTop: 9,
        paddingBottom: 10,
        paddingLeft: 12,
        paddingRight: 44,
        fontSize: 13,
        letterSpacing: -0.17,
        color: '#000000',
      },
      sendIcon: {
        icon: {
          width: 29,
          height: 29,
        },
        wrapper: {
          position: 'absolute',
          top: 17,
          right: 20,
        },
      },
    },

    'shoutem.sendbird.ProgressBar': {
      container: {
        width: '100%',
        height: 5,
        backgroundColor: 'transparent',
        alignItems: 'flex-start',
      },
      progress: {
        backgroundColor: '#39FF14',
        height: '100%',
      },
    },

    // Interactive FAQ

    'shoutem.interactive-faq.Question': {
      container: {
        height: 35,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#000000',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'transparent',
        borderRadius: 100,
      },

      backContainer: {
        backgroundColor: '#00AADF',
        borderColor: '#00AADF',
      },

      text: {
        paddingHorizontal: 10,
        fontSize: 13,
        lineHeight: 16,
        color: '#000000',
      },

      backText: {
        color: '#FFFFFF',
      },
    },

    'shoutem.interactive-faq.QuestionsBar': {
      container: {
        flexGrow: 0,
      },
      contentContainer: {
        height: 65,
        padding: 15,
        justifyContent: 'center',
        alignContent: 'center',
      },
    },

    'shoutem.interactive-faq.InteractiveFaqScreen': {
      paddingTop: 30,
      paddingHorizontal: 25,
    },

    'shoutem.interactive-faq.MessageBubble': {
      container: {
        padding: 15,
        marginBottom: 25,
        borderTopLeftRadius: 15,
        borderTopEndRadius: 0,
        borderBottomLeftRadius: 15,
        borderBottomEndRadius: 15,
        backgroundColor: 'rgba(28,171,221, 0.1)',
        alignSelf: 'flex-end',
      },
      botContainer: {
        borderTopLeftRadius: 0,
        borderTopEndRadius: 15,
        backgroundColor: '#F9F9F9',
        alignSelf: 'flex-start',
      },
      text: {
        fontSize: 13,
        lineHeight: 18,
        color: '#000000',
      },
      botText: {
        color: '#333333',
      },
    },
  });
};
