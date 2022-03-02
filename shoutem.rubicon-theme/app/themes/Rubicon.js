import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import _ from 'lodash';
import {
  changeColorAlpha,
  getSizeRelativeToReference,
  INCLUDE,
  inverseColorBrightnessForAmount,
} from '@shoutem/theme';
import {
  calculateLineHeight,
  defaultThemeVariables as defaultUiThemeVariables,
  Device,
  dimensionRelativeToIphone,
  getTheme,
  resolveFontFamily,
  resolveFontStyle,
  resolveFontWeight,
} from '@shoutem/ui';
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
  notchedAndroid: NAVIGATION_HEADER_HEIGHT + StatusBar.currentHeight,
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
          fontWeight: resolveFontWeight('700'),
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
        fontFamily: resolveFontFamily(
          variables.text.fontFamily,
          variables.text.fontWeight,
          variables.text.fontStyle,
        ),
        fontWeight: resolveFontWeight(variables.text.fontWeight),
        fontStyle: resolveFontStyle(variables.text.fontStyle),
      },
      table: {
        fitContainerWidth: true,
        fitContainerHeight: true,
        cellPaddingEm: 0.25,
        borderWidthPx: 0.25,
        linkColor: variables.links.colors,
        thBorderColor: '#E1E1E1',
        tdBorderColor: '#E1E1E1',
        thOddBackground: '#F3F3F3',
        thOddColor: variables.title.color,
        thEvenBackground: '#F3F3F3',
        thEvenColor: variables.title.color,
        trOddBackground: variables.paperColor,
        trOddColor: variables.text.color,
        trEvenBackground: variables.paperColor,
        trEvenColor: variables.text.color,
      },
      tableCss: `th, td {
        text-align: left;
      }
      th {
        border-bottom: 2px solid #343434 !important;
      }`,
      tags: {
        h1: {
          fontFamily: resolveFontFamily(
            variables.heading.fontFamily,
            '700',
            variables.heading.fontStyle,
          ),
          fontWeight: resolveFontWeight('700'),
          fontStyle: resolveFontStyle(variables.heading.fontStyle),
          marginBottom: variables.mediumGutter,
          marginTop: variables.mediumGutter,
          color: variables.heading.color,
        },
        h2: {
          fontFamily: resolveFontFamily(
            variables.heading.fontFamily,
            '700',
            variables.heading.fontStyle,
          ),
          fontWeight: resolveFontWeight('700'),
          fontStyle: resolveFontStyle(variables.heading.fontStyle),
          marginBottom: variables.mediumGutter,
          marginTop: variables.mediumGutter,
          color: variables.heading.color,
        },
        h3: {
          fontFamily: resolveFontFamily(
            variables.heading.fontFamily,
            '700',
            variables.heading.fontStyle,
          ),
          fontWeight: resolveFontWeight('700'),
          fontStyle: resolveFontStyle(variables.heading.fontStyle),
          marginTop: variables.mediumGutter,
          marginBottom: variables.mediumGutter,
          color: variables.heading.color,
        },
        h4: {
          fontFamily: resolveFontFamily(
            variables.heading.fontFamily,
            '700',
            variables.heading.fontStyle,
          ),
          fontWeight: resolveFontWeight('700'),
          fontStyle: resolveFontStyle(variables.heading.fontStyle),
          marginTop: variables.mediumGutter,
          marginBottom: variables.mediumGutter,
          color: variables.heading.color,
        },
        h5: {
          fontFamily: resolveFontFamily(
            variables.heading.fontFamily,
            '700',
            variables.heading.fontStyle,
          ),
          fontWeight: resolveFontWeight('700'),
          fontStyle: resolveFontStyle(variables.heading.fontStyle),
          marginTop: variables.mediumGutter,
          marginBottom: variables.mediumGutter,
          color: variables.heading.color,
        },
        a: {
          fontFamily: resolveFontFamily(
            variables.title.fontFamily,
            '700',
            variables.title.fontStyle,
          ),
          fontWeight: resolveFontWeight('700'),
          fontStyle: resolveFontStyle(variables.title.fontStyle),
          fontSize: 15,
          textDecorationLine: 'none',
          color: variables.title.color,
        },
        p: {
          fontFamily: resolveFontFamily(
            variables.text.fontFamily,
            variables.text.fontWeight,
            variables.text.fontStyle,
          ),
          fontWeight: resolveFontWeight(variables.text.fontWeight),
          fontStyle: resolveFontStyle(variables.text.fontStyle),
          fontSize: 15,
          lineHeight: calculateLineHeight(15),
          marginTop: variables.mediumGutter,
          marginBottom: variables.mediumGutter,
          color: variables.text.color,
        },
        li: {
          fontFamily: resolveFontFamily(
            variables.text.fontFamily,
            variables.text.fontWeight,
            variables.text.fontStyle,
          ),
          fontWeight: resolveFontWeight(variables.text.fontWeight),
          fontStyle: resolveFontStyle(variables.text.fontStyle),
          fontSize: 15,
          color: variables.text.color,
        },
        img: {
          marginTop: variables.mediumGutter,
          marginBottom: variables.mediumGutter,
        },
        strong: Platform.select({
          android: {
            fontFamily: 'System',
          },
        }),
        em: Platform.select({
          android: {
            fontFamily: 'System',
          },
        }),
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
      activeTintColor:
        variables.mainNavSelectedItemIconColor ||
        variables.mainNavSelectedItemColor,
      inactiveTintColor:
        variables.mainNavItemIconColor || variables.mainNavItemColor,
      activeBackgroundColor: variables.mainNavSelectedItemBackground,
      inactiveBackgroundColor: variables.mainNavItemBackground,
      container: {
        borderTopWidth: 1,
        borderTopColor: variables.mainNavBorderColor,
        backgroundColor: variables.mainNavBackground,
        minHeight: TAB_BAR_ITEM_HEIGHT,
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
        fontWeight: resolveFontWeight('normal'),
        flex: -1,
        margin: 0,
      },
    },
    'shoutem.navigation.Drawer': {
      menu: {
        backgroundColor: variables.mainNavBackground,
        width: window.width * 0.8,
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
        paddingTop: Platform.isPad && 8,
        fontSize: 11,
        lineHeight: calculateLineHeight(11),
      },
      'medium-text': {
        fontSize: 15,
        lineHeight: calculateLineHeight(15),
      },
      'large-text': {
        fontSize: 20,
        lineHeight: calculateLineHeight(20),
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
        lineHeight: calculateLineHeight(15),
      },
      'medium-text': {
        fontSize: 25,
        lineHeight: calculateLineHeight(25),
      },
      'large-text': {
        fontSize: 40,
        lineHeight: calculateLineHeight(40),
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
        lineHeight: calculateLineHeight(15),
      },
      'medium-text': {
        fontSize: 25,
        lineHeight: calculateLineHeight(25),
      },
      'large-text': {
        fontSize: 40,
        lineHeight: calculateLineHeight(40),
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
        lineHeight: calculateLineHeight(15),
      },
      'medium-text': {
        fontSize: 25,
        lineHeight: calculateLineHeight(25),
      },
      'large-text': {
        fontSize: 40,
        lineHeight: calculateLineHeight(40),
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
            alignItems: 'center',
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

    'shoutem.web-view.WebViewScreen': {
      container: {
        flex: 1,
      },
    },

    'shoutem.web-view.WebViewWithShareScreen': {
      container: {
        flex: 1,
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

    // Affiliate
    'shoutem.affiliate.About': {
      spinnerContainer: { justifyContent: 'center', alignItems: 'center' },
      spinner: { justifyContent: 'center', alignItems: 'center' },
    },

    'shoutem.affiliate.LevelProgressBar': {
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

    'shoutem.affiliate.LevelGaugeProgressBar': {
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

    'shoutem.affiliate.RewardIcon': {
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

    // About
    'shoutem.about.About': {
      spinnerContainer: { justifyContent: 'center', alignItems: 'center' },
      spinner: { justifyContent: 'center', alignItems: 'center' },
    },

    // Affiliate
    'shoutem.affiliate.Banner': {
      divider: { height: 5, padding: 0 },
    },

    'shoutem.affiliate.LevelsListScreen': {
      gaugeContainer: {
        width: '100%',
        marginBottom: variables.mediumGutter,
        alignItems: 'center',
      },
      spinner: {
        marginTop: 50,
      },
    },

    'shoutem.affiliate.LevelItem': {
      divider: { height: 5, padding: 0 },
      icon: { height: 35, width: 35, opacity: 0.75 },
      pointsReached: { opacity: 1 },
    },

    'shoutem.affiliate.ProgressBar': {
      container: {
        height: 275,
        width: 275,
      },

      pointsLabel: {
        position: 'absolute',
        top: '35%',
      },

      progressContainer: {
        height: 260,
        width: 260,
      },

      progressRadius: 120,

      level: {
        position: 'absolute',
        marginLeft: -9,
        marginTop: -9,
      },

      shareCodeButton: {},
    },

    'shoutem.affiliate.GaugeProgressBar': {
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
        stroke: variables.secondaryButtonBackgroundColor,
        strokeLinecap: 'round',
        strokeWidth: 10,
      },

      refreshIcon: {
        width: 18,
      },
    },

    'shoutem.affiliate.LevelIcon': {
      level: {
        backgroundColor: variables.primaryButtonBackgroundColor,
        borderColor: variables.secondaryButtonBackgroundColor,
        borderWidth: 1,
        borderRadius: 50,
        height: 30,
        opacity: 0.75,
        padding: 5,
        paddingBottom: 6,
        width: 30,
      },

      levelReached: {
        backgroundColor: variables.secondaryButtonBackgroundColor,
        borderRadius: 50,
        height: 30,
        opacity: 1,
        padding: 5,
        paddingBottom: 6,
        width: 30,
      },

      icon: {
        color: variables.secondaryButtonBackgroundColor,
        fontSize: 18,
      },

      iconLevelReached: {
        color: variables.primaryButtonBackgroundColor,
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
          notchedAndroid: 30 + StatusBar.currentHeight,
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
          fontWeight: resolveFontWeight('600'),
          fontFamily: 'Rubik-Regular',
        },
        'shoutem.ui.Icon': {
          color: '#ffffff',
          width: 16,
          height: 16,
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
        'shoutem.ui.TextInput': {
          borderColor: variables.text.color,
          borderRadius: 6,
          height: 50,
          flex: 1,
          paddingHorizontal: 15,
          paddingVertical: 4,
        },
        'shoutem.ui.Button': {
          position: 'absolute',
          right: 0,
          paddingTop: 13,
          paddingBottom: 13,
        },
      },
    },

    'shoutem.auth.LoginForm': {
      usernameContainer: {
        'shoutem.ui.Text': {
          fontSize: 15,
          paddingBottom: 5,
        },
        'shoutem.ui.TextInput': {
          borderColor: variables.text.color,
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
            fontWeight: resolveFontWeight('400'),
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
        paddingHorizontal: 30,
        paddingTop: 40,
      },
    },

    'shoutem.auth.RegisterButton': {
      'shoutem.ui.View': {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        justifySelf: 'flex-end',
        marginTop: 10,
        paddingBottom: 20,
        'shoutem.ui.Caption': {
          lineHeight: 24,
          fontSize: variables.text.fontSize,
        },
        'shoutem.ui.Button': {
          paddingLeft: 5,
          'shoutem.ui.Text': {
            lineHeight: 24,
            fontSize: variables.text.fontSize,
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
          borderColor: variables.text.color,
          borderRadius: 6,
          height: 50,
          paddingHorizontal: 15,
          paddingVertical: 4,
        },
        'shoutem.ui.View': {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          'shoutem.ui.TextInput': {
            borderRadius: 6,
            height: 50,
            flex: 1,
          },
        },
        'shoutem.ui.TouchableOpacity': {
          'shoutem.ui.Caption': {
            color: '#659CEC',
          },
        },
      },
      registerButton: {
        borderRadius: 6,
        width: '100%',
        minWidth: 140,
        height: 44,
        marginTop: 40,
        alignSelf: 'center',
        'shoutem.ui.Text': {
          fontSize: 16,
          margin: 0,
        },
      },
    },

    'shoutem.auth.RegisterScreen': {
      registerScreenMargin: {
        paddingHorizontal: 30,
        paddingTop: 40,
      },
    },

    'shoutem.auth.TermsAndPrivacy': {
      container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      },
      link: {
        margin: 0,
        fontWeight: resolveFontWeight('700'),
      },
    },

    'shoutem.auth.PasswordRecoveryScreen': {
      textContainer: {
        marginTop: 40,
        marginBottom: 40,
        marginLeft: 30,
        marginRight: 18,
      },
      title: {
        fontSize: 24,
        lineHeight: 32,
      },
      description: {
        marginTop: 12,
        fontSize: 15,
        lineHeight: 24,
      },
      emailInput: {
        borderRadius: 6,
      },
      inputCaption: {
        marginBottom: 3,
        opacity: 0.4,
        fontSize: 15,
        lineHeight: 18,
      },
      confirmButton: {
        width: '50%',
        marginTop: 24,
        borderRadius: 6,
      },
    },

    'shoutem.auth.EditProfileScreen': {
      container: { flex: 1 },
      username: { bottom: 0 },
      deleteAccountButtonText: { color: variables.errorText.color },
    },

    'shoutem.auth.ConfirmDeletionScreen': {
      deleteAccountButtonContainer: {
        marginTop: 30,
        height: 55,
      },
      deleteAccountButtonText: {
        disabled: { color: changeColorAlpha(variables.errorText.color, 0.5) },
        enabled: { color: variables.errorText.color },
      },
      deleteAccountDescription: { textAlign: 'center' },
      textInput: {
        borderWidth: 0,
        wiggleAnimation: { paddingHorizontal: 0 },
      },
    },

    'shoutem.auth.ChangePasswordScreen': {
      keyboardAvoidingViewContainer: {
        flex: 1,
      },
      textContainer: {
        marginTop: 40,
        marginBottom: 40,
        marginLeft: 30,
        marginRight: 18,
      },
      title: {
        fontSize: 24,
        lineHeight: 32,
      },
      description: {
        marginTop: 12,
        fontSize: 15,
        lineHeight: 24,
      },
      inputCaption: {
        marginBottom: 3,
        opacity: 0.4,
        fontSize: 15,
        lineHeight: 18,
      },
      inputWrapper: {
        marginBottom: 26,
      },
      codeInput: {
        height: 50,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 6,
      },
      confirmButton: {
        width: '50%',
        marginTop: 24,
        marginBottom: 30,
        borderRadius: 6,
      },
    },

    'shoutem.besttime.OpenHours': {
      openText: {
        color: '#EF1095',
      },
    },

    'shoutem.besttime.ForecastScreen': {
      buttonText: {
        color: variables.secondaryButtonTextColor,
      },
    },

    'shoutem.besttime.ForecastGraph': {
      'shoutem.ui.View': {
        'shoutem.ui.View': {
          '.overlaid': {
            paddingTop: 80,
            position: 'absolute',
          },
        },
      },
      axisColor: variables.text.color,
      yAxisSvg: {
        fill: variables.text.color,
        fontSize: 10,
      },
      xAxisSvg: {
        fill: variables.text.color,
        fontSize: 10,
        textAnchor: 'end',
      },
      chartContentInsets: {
        bottom: 5,
        top: 20,
      },
      forecastColor: variables.featuredColor,
      liveBarChart: {
        position: 'absolute',
        marginLeft: 6,
        height: 160,
        paddingRight: 15,
        width: window.width - 40,
      },
      liveColor: '#EF1095DD',
      rawBarChart: {
        height: 160,
        paddingRight: 15,
        width: window.width - 40,
      },
      xAxis: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        width: window.width - 40,
      },
      yAxis: {
        height: 180,
        paddingLeft: 15,
      },
      yAxisContentInsets: {
        top: 20,
        bottom: 25,
      },
    },

    'shoutem.besttime.SearchScreen': {
      backgroundImage: {
        [INCLUDE]: ['fillParent'],
        width: window.width,
        height: window.height,
      },
    },

    'shoutem.besttime.SearchInput': {
      'shoutem.ui.View': {
        'shoutem.ui.View': {
          'shoutem.ui.Icon': {
            backgroundColor: variables.paperColor,
            marginHorizontal: 10,
            marginVertical: 5,
            color: variables.navBarIconsColor,
          },

          'shoutem.ui.TextInput': {
            backgroundColor: variables.paperColor,
            height: 30,
            paddingVertical: 0,
            paddingLeft: 0,
            marginLeft: 0,
            width: window.width - dimensionRelativeToIphone(130),
          },

          'shoutem.ui.Button': {
            'shoutem.ui.Icon': {
              color: variables.navBarIconsColor,
              marginRight: 0,
              paddingLeft: 10,
            },
          },

          backgroundColor: variables.paperColor,
          borderRadius: 6,
          marginHorizontal: variables.mediumGutter,
        },

        backgroundColor: variables.navBarBackground,
        height: 40,
      },
    },

    'shoutem.besttime.SearchInstructions': {
      'shoutem.ui.View': {
        flex: 1,
      },
    },

    'shoutem.besttime.GooglePlacesError': {
      'shoutem.ui.View': {
        flex: 1,
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

    // Checklist
    'shoutem.checklist.ChecklistScreen': {
      disabledSaveButtonText: {
        color: variables.backgroundColor,
        opacity: 0.5,
      },
      endFillColor: {
        color: variables.backgroundColor,
      },
      saveButton: {
        bottom: variables.mediumGutter,
        height: dimensionRelativeToIphone(44),
        left: variables.mediumGutter,
        position: 'absolute',
        width: window.width - variables.mediumGutter * 2,
      },
      saveButtonText: {
        color: variables.backgroundColor,
      },
      scrollViewContainer: {
        paddingBottom: variables.largeGutter + dimensionRelativeToIphone(44),
      },
    },

    'shoutem.checklist.Checklist': {
      mainContainer: {
        backgroundColor: variables.paperColor,
        padding: variables.mediumGutter,
        marginTop: variables.mediumGutter,
        width: window.width,
      },
      simpleHtml: {
        container: {
          paddingHorizontal: 0,
        },
      },
      imagesMaxWidth: window.width - variables.mediumGutter * 2,
    },

    'shoutem.checklist.ChecklistItem': {
      disabledIconFill: changeColorAlpha(variables.featuredColor, 0.5),
      iconFill: variables.featuredColor,
      mainContainer: {
        marginBottom: variables.mediumGutter,
      },
      simpleHtml: {
        container: {
          paddingVertical: 0,
          paddingLeft: variables.smallGutter,
          flex: 1,
        },
      },
      imagesMaxWidth:
        window.width - variables.smallGutter - variables.mediumGutter * 2 - 24,
    },

    'shoutem.checklist.ChecklistNavBarButton': {
      buttonText: {
        ...variables.navBarText,
        color: variables.navBarIconsColor,
      },
    },

    'shoutem.checklist.SubmitMessageScreen': {
      contactButton: {
        backgroundColor: variables.primaryButtonBackgroundColor,
        borderWidth: 0,
        bottom: variables.mediumGutter * 2 + dimensionRelativeToIphone(44),
        height: dimensionRelativeToIphone(44),
        left: variables.mediumGutter,
        position: 'absolute',
        width: window.width - variables.mediumGutter * 2,
      },
      contactButtonIcon: {
        bottom: dimensionRelativeToIphone(9),
        right: 0,
        position: 'absolute',
      },
      contactButtonIconFill: variables.backgroundColor,
      contactButtonText: {
        ...variables.primaryButtonText,
        color: variables.backgroundColor,
      },
      endFillColor: {
        color: variables.backgroundColor,
      },
      goBackButton: {
        backgroundColor: changeColorAlpha(variables.featuredColor, 0.1),
        borderWidth: 0,
        bottom: variables.mediumGutter,
        height: dimensionRelativeToIphone(44),
        left: variables.mediumGutter,
        position: 'absolute',
        width: window.width - variables.mediumGutter * 2,
      },
      goBackButtonText: {
        color: variables.featuredColor,
      },
      overlayText: {
        fontFamily: resolveFontFamily(variables.title.fontFamily, '600'),
        fontSize: 35,
        lineHeight: calculateLineHeight(35),
      },
      scrollViewContainerOneButton: {
        paddingBottom: variables.mediumGutter + dimensionRelativeToIphone(44),
      },
      scrollViewContainerTwoButtons: {
        paddingBottom:
          variables.mediumGutter * 2 + dimensionRelativeToIphone(44) * 2,
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

    // Invision Community
    'shoutem.invision-community.LoginButton': {
      invisionButton: {
        width: '100%',
        minWidth: 140,
        height: 44,
        marginVertical: 10,
        borderRadius: 6,
        backgroundColor: '#24476F',
        alignSelf: 'center',
      },
      invisionButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: resolveFontWeight('600'),
        fontFamily: 'Rubik-Regular',
      },
      invisionButtonLogo: {
        width: 16,
        height: 16,
      },
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

    // CMS

    'shoutem.cms.SearchInput': {
      container: {
        backgroundColor: variables.navBarBackground,
        height: 44,
        justifyContent: 'center',
      },
      searchBackground: {
        backgroundColor: variables.searchInputBackgroundColor || '#F0F0F0',
        borderRadius: 4,
        marginHorizontal: variables.smallGutter,
        height: 30,
      },
      searchIcon: {
        color: variables.searchTextColor || '#666666',
        marginHorizontal: 10,
        marginVertical: 5,
      },
      searchTextInput: {
        backgroundColor: variables.searchInputBackgroundColor || '#F0F0F0',
        color: variables.searchTextColor || '#666666',
        height: 30,
        marginLeft: 0,
        paddingVertical: 0,
        paddingLeft: 0,
        placeholderTextColor: variables.searchTextColor || '#666666',
        selectionColor: variables.searchTextColor || '#666666',
        width: window.width - dimensionRelativeToIphone(110),
      },
      clearSearchContainer: {
        height: 30,
        width: 44,
      },
      clearSearchIcon: {
        color: variables.searchTextColor || '#666666',
      },
    },

    'shoutem.cms.FullGridRowItemView': {
      container: {
        borderColor: 'rgba(68,79,108,0.2)',
        borderRadius: 4,
        borderWidth: 1,
        marginBottom: 8,
      },
      imageContainer: { height: dimensionRelativeToIphone(224) },
      textContainer: {
        backgroundColor: variables.paperColor,
        borderTopColor: 'rgba(68,79,108,0.2)',
        borderTopWidth: 1,
        height: dimensionRelativeToIphone(92),
        paddingBottom: 4,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
      },
      title: { fontSize: 20, fontWeight: 'bold', lineHeight: 24 },
      description: {
        fontSize: 14,
        lineHeight: 16,
        paddingBottom: 16,
        paddingTop: 4,
      },
    },

    'shoutem.cms.HalfGridRowItemView': {
      [INCLUDE]: ['shoutem.cms.FullGridRowItemView'],
      container: {
        ...['shoutem.cms.FullGridRowItemView'],
        marginHorizontal: 4,
      },
      imageContainer: { height: dimensionRelativeToIphone(110) },
      textContainer: {
        ...['shoutem.cms.FullGridRowItemView'],
        height: dimensionRelativeToIphone(108),
      },
    },

    // Places

    'shoutem.places.PlacesGridScreen': {
      list: { marginHorizontal: 8, marginTop: 8 },
    },

    'shoutem.places.PlaceFullGridRowView': {
      container: {
        borderColor: 'rgba(68,79,108,0.2)',
        borderRadius: 4,
        borderWidth: 1,
        marginBottom: 8,
      },
      imageContainer: { height: dimensionRelativeToIphone(224) },
      textContainer: {
        backgroundColor: variables.gridItemBackgroundColor,
        borderTopColor: 'rgba(68,79,108,0.2)',
        borderTopWidth: 1,
        height: dimensionRelativeToIphone(92),
        paddingBottom: 4,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
      },
      title: { fontSize: 20, fontWeight: 'bold', lineHeight: 24 },
      description: {
        fontSize: 14,
        lineHeight: 16,
        paddingBottom: 16,
        paddingTop: 4,
      },
    },

    'shoutem.places.PlaceHalfGridRowView': {
      [INCLUDE]: ['shoutem.places.PlaceFullGridRowView'],
      container: {
        ...['shoutem.places.PlaceFullGridRowView'],
        marginHorizontal: 4,
      },
      imageContainer: { height: dimensionRelativeToIphone(110) },
      textContainer: {
        ...['shoutem.places.PlaceFullGridRowView'],
        height: dimensionRelativeToIphone(108),
      },
    },

    // Social
    'shoutem.social.CreateStatusScreen': {
      textInput: {
        width: '90%',
        height: '100%',
        ...variables.text,
        fontFamily: resolveFontFamily(
          variables.text.fontFamily,
          variables.text.fontWeight,
          variables.text.fontStyle,
        ),
        fontWeight: resolveFontWeight(variables.text.fontWeight),
        fontStyle: resolveFontStyle(variables.text.fontStyle),
        padding: variables.mediumGutter,
      },
      profileAvatar: {
        width: getSizeRelativeToReference(40, 375, window.width),
        height: getSizeRelativeToReference(40, 375, window.width),
        borderRadius: getSizeRelativeToReference(20, 375, window.width),
      },
      attachedImage: { width: '100%' },
      overlay: { backgroundColor: variables.imageOverlayColor },
      removeImageIcon: { color: 'rgba(255,255,255,0.8)' },
    },

    'shoutem.social.SearchScreen': {
      contentContainerStyle: {
        flexGrow: 1,
      },
    },
    'shoutem.social.StatusDetailsScreen': {
      container: { height: getSizeRelativeToReference(80, 812, window.height) },
      textInput: {
        ...variables.text,
        fontFamily: resolveFontFamily(
          variables.text.fontFamily,
          variables.text.fontWeight,
          variables.text.fontStyle,
        ),
        fontWeight: resolveFontWeight(variables.text.fontWeight),
        fontStyle: resolveFontStyle(variables.text.fontStyle),
        flex: 1,
        margin: getSizeRelativeToReference(15, 375, window.width),
        maxHeight: 100,
      },
      list: {
        listContent: {
          backgroundColor: variables.paperColor,
          marginTop: getSizeRelativeToReference(6, 812, window.height),
        },
      },
    },

    'shoutem.social.MemberView': {
      menuButton: {
        width: 24,
        height: 24,
        color: '#C4C4C4',
        paddingVertical: 10,
        paddingLeft: 10,
      },
      userProfileName: {
        color: changeColorAlpha(variables.text.subtitle, 0.5),
        fontFamily: resolveFontFamily(
          variables.subtitle.fontFamily,
          variables.subtitle.fontWeight,
          'italic',
        ),
        fontStyle: resolveFontStyle('italic'),
      },
    },

    'shoutem.social.SocialWallScreen': {
      screen: {
        backgroundColor: variables.paperColor,
      },
      list: {
        listContent: {
          backgroundColor: variables.paperColor,
          marginTop: getSizeRelativeToReference(15, 812, window.height),
        },
      },
      newStatusInput: {
        backgroundColor: variables.searchInputBackgroundColor,
        height: getSizeRelativeToReference(40, 812, window.height),
        borderRadius: 10,
        justifyContent: 'center',
      },
      newStatusPlaceholderText: { opacity: 0.5 },
      profileAvatar: {
        height: getSizeRelativeToReference(40, 812, window.height),
        width: getSizeRelativeToReference(40, 812, window.height),
        borderRadius: getSizeRelativeToReference(20, 812, window.height),
      },
    },

    'shoutem.social.StatusView': {
      container: {
        backgroundColor: variables.paperColor,
        marginHorizontal: getSizeRelativeToReference(15, 375, window.width),
        marginBottom: getSizeRelativeToReference(6, 812, window.height),
        borderColor: variables.paperColor,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 1, height: 2 },
        elevation: 2,
      },
      newComment: {
        backgroundColor: variables.searchInputBackgroundColor,
        borderRadius: 10,
        height: getSizeRelativeToReference(38, 812, window.height),
        padding: getSizeRelativeToReference(10, 812, window.height),
        marginTop: getSizeRelativeToReference(10, 812, window.height),
        marginBottom: getSizeRelativeToReference(15, 812, window.height),
        marginHorizontal: getSizeRelativeToReference(15, 375, window.width),
      },
      placeholderText: { opacity: 0.5 },
    },

    'shoutem.social.StatusHeader': {
      profileImage: {
        height: getSizeRelativeToReference(40, 812, window.height),
        width: getSizeRelativeToReference(40, 812, window.height),
        borderRadius: 20,
      },
      moreIcon: {
        color: variables.navBarIconsColor,
      },
    },

    'shoutem.social.StatusContent': {
      image: { width: '100%' },
    },

    'shoutem.social.Interactions': {
      button: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: getSizeRelativeToReference(5, 375, window.width),
      },
      likeButtonWidth: {
        width: getSizeRelativeToReference(80, 375, window.width),
      },
      commentsButtonWidth: {
        width: getSizeRelativeToReference(110, 375, window.width),
      },
      icon: {
        color: variables.text.color,
      },
      iconText: {
        marginLeft: getSizeRelativeToReference(5, 375, window.width),
        fontFamily: resolveFontFamily(
          variables.text.fontFamily,
          '500',
          variables.text.fontStyle,
        ),
      },
    },

    'shoutem.social.Like': {
      heartIcon: {
        color: variables.paperColor,
        stroke: variables.text.color,
      },
      heartIconLiked: {
        color: variables.likeButtonFillColor,
        stroke: variables.likeButtonFillColor,
      },
    },

    'shoutem.social.CommentView': {
      container: {
        flexDirection: 'row',
        marginVertical: getSizeRelativeToReference(5, 812, window.height),
        marginHorizontal: getSizeRelativeToReference(15, 375, window.width),
      },
      profileImage: {
        marginRight: getSizeRelativeToReference(10, 375, window.width),
        marginTop: getSizeRelativeToReference(10, 375, window.width),
      },
      contentContainer: {
        flex: 1,
        backgroundColor: variables.paperColor,
        padding: getSizeRelativeToReference(3, 375, window.width),
        marginHorizontal: 0,
        marginBottom: getSizeRelativeToReference(6, 812, window.height),
        borderRadius: 12,
        borderColor: variables.paperColor,
        borderWidth: 1,
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 1, height: 2 },
        elevation: 1,
      },
      row: { paddingTop: getSizeRelativeToReference(10, 812, window.height) },
      contentInnerContainer: { padding: 0 },
      username: {
        fontFamily: resolveFontFamily(
          variables.text.fontFamily,
          '500',
          variables.text.fontStyle,
        ),
      },
      timeAgo: { fontSize: 10, lineHeight: calculateLineHeight(10) },
      comment: {
        container: {
          paddingHorizontal: getSizeRelativeToReference(5, 375, window.width),
          paddingBottom: 0,
        },
        tags: {
          p: {
            fontSize: 13,
            lineHeight: calculateLineHeight(13),
            marginVertical: 0,
          },
          a: {
            fontSize: 13,
            lineHeight: calculateLineHeight(13),
            // TODO: SimpleHtml blocks font changes. For now, this works for iOS only
            fontWeight: '400',
            color: '#0000EE',
          },
        },
      },
      attachment: {
        width: '100%',
        height: getSizeRelativeToReference(163, 812, window.height),
      },
    },

    'shoutem.social.NewStatusFooter': {
      container: {
        flexDirection: 'row',
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
        paddingTop: getSizeRelativeToReference(5, 812, window.height),
        paddingBottom: getSizeRelativeToReference(10, 812, window.height),
      },
      attachmentIcon: {
        color: variables.text.color,
      },
      button: {
        justifyContent: 'center',
        padding: variables.mediumGutter,
        backgroundColor: 'rgba(136, 143, 161, 0.1)',
        borderRadius: 10,
      },
      buttonMargin: {
        marginRight: variables.smallGutter,
      },
    },

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
          window.width -
          3 * variables.mediumGutter -
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
        width: dimensionRelativeToIphone(36),
        height: dimensionRelativeToIphone(36),
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

    'shoutem.radio-player.RadioPlayer': {
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
        width: dimensionRelativeToIphone(36),
        height: dimensionRelativeToIphone(36),
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
      artistName: {
        color: variables.imageOverlayTextColor,
        fontFamily: resolveFontFamily(
          variables.text.fontFamily,
          '700',
          variables.text.fontStyle,
        ),
        fontWeight: resolveFontWeight('bold'),
        fontSize: 14,
      },
      songName: {
        color: variables.imageOverlayTextColor,
        fontSize: 15,
      },
    },

    'shoutem.radio-player.ArtworkRadioScreen': {
      screen: { backgroundColor: variables.screenBackgroundColor },
      blurRadius: 7,
      overlay: {
        backgroundColor: variables.screenOverlayColor,
      },
      streamTitleContainer: {
        bottom: variables.extraLargeGutter + variables.extraLargeGutter,
      },
      streamTitle: {
        color: variables.streamTitleColor,
        fontWeight: '700',
      },
      artworkContainer: {
        width: getSizeRelativeToReference(250, 812, window.height),
        height: getSizeRelativeToReference(250, 812, window.height),
        overflow: 'hidden',
      },
      artworkCircularImage: {
        width: getSizeRelativeToReference(245, 812, window.height),
        height: getSizeRelativeToReference(245, 812, window.height),
        borderRadius: getSizeRelativeToReference(245 / 2, 812, window.height),
        borderColor: variables.artworkCircularImageBorderColor,
        borderWidth: variables.smallGutter,
      },
      radioPlayer: {
        playbackMainCircle: {
          borderColor: variables.playbackAnimatedCircleColor,
        },
        playbackButton: {
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderColor: variables.playbackButtonBorderColor,
        },
        playbackIcon: { color: variables.playbackIconColor },
        spinner: { color: '#bbbbbb', margin: 0 },
      },
      nowPlayingContainer: { top: variables.extraLargeGutter },
      artistTitle: { color: variables.artistTitleColor, fontWeight: '700' },
      songNameTitle: { color: variables.songNameTitleColor },
      shareIcon: {
        style: {
          color: variables.shareButtonColor,
          width: getSizeRelativeToReference(40, 812, window.height),
          height: getSizeRelativeToReference(40, 812, window.height),
        },
      },
      shareButton: {
        paddingHorizontal: variables.smallGutter,
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

    'shoutem.notification-center.NotificationDailySettingsScreen': {
      confirmButton: {
        borderRadius: 2,
        marginHorizontal: 'auto',
        marginTop: 50,
        width: '40%',
      },
      subtitle: {
        textAlign: 'center',
      },
      timePickerButton: {
        buttonContainer: {
          backgroundColor: variables.primaryButtonBackgroundColor,
        },
      },
    },

    'shoutem.notification-center.ReminderSettingsScreen': {
      confirmButton: {
        borderRadius: 2,
        marginHorizontal: 'auto',
        marginTop: 50,
        width: '40%',
      },
      subtitle: {
        textAlign: 'center',
      },
      timePickerButton: {
        buttonContainer: {
          backgroundColor: variables.primaryButtonBackgroundColor,
        },
      },
    },

    'shoutem.notification-center.SettingsToggle': {
      trackColor: variables.primaryButtonBackgroundColor,
    },

    'shoutem.notification-center.SettingDetailsNavigationItem': {
      icon: {
        color: '#BDC0CB',
        margin: 0,
      },
    },

    // Onboarding

    'shoutem.onboarding.OnboardingScreen': {
      imageBackground: {
        width: '100%',
        height: '100%',
      },
      image: {
        resizeMode: 'stretch',
      },
      container: {
        flex: 1,
        marginHorizontal: getSizeRelativeToReference(
          variables.largeGutter,
          375,
          window.width,
        ),
        marginTop: getSizeRelativeToReference(80, 812, window.height),
        marginBottom:
          variables.largeGutter +
          getSizeRelativeToReference(48, 812, window.height),
      },
      footerContainer: {
        position: 'absolute',
        bottom: getSizeRelativeToReference(40, 812, window.height),
        left: variables.largeGutter,
        right: variables.largeGutter,
      },
      button: {
        height: getSizeRelativeToReference(48, 812, window.height),
      },
      pageIndicators: {
        container: {
          // Manually offset bottom for button height
          marginBottom:
            variables.mediumGutter +
            getSizeRelativeToReference(48, 812, window.height),
        },
        indicatorContainer: {
          'shoutem.ui.View': {
            backgroundColor: variables.imageOverlayTextColor,

            '.selected': {
              backgroundColor: changeColorAlpha(
                variables.imageOverlayTextColor,
                0.7,
              ),
            },
          },
        },
      },
    },

    'shoutem.onboarding.ImageContent': {
      container: {
        flex: 1,
        // Manually offset bottom for footer height
        marginBottom:
          variables.largeGutter +
          getSizeRelativeToReference(48, 812, window.height),
      },
      featuredImage: {
        flex: 1,
        alignSelf: 'center',
        width: getSizeRelativeToReference(285, 375, window.width),
        height: getSizeRelativeToReference(285, 812, window.height),
        marginVertical: getSizeRelativeToReference(40, 812, window.height),
        resizeMode: 'contain',
      },
      topTextContainer: {
        flex: 1,
        justifyContent: 'center',
      },
      bottomTextContainer: {
        flex: 1,
      },
      title: {
        color: variables.onboardingTitleTextColor,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 32,
        lineHeight: calculateLineHeight(32),
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        fontWeight: resolveFontWeight('700'),
        marginBottom: getSizeRelativeToReference(10, 812, window.height),
      },
      description: {
        color: variables.onboardingDescriptionTextColor,
        textAlign: 'center',
        fontSize: 15,
        lineHeight: calculateLineHeight(15),
      },
    },

    'shoutem.onboarding.TextContent': {
      textContainerTop: {
        flex: 1,
        justifyContent: 'flex-start',
      },
      textContainerMiddle: {
        flex: 1,
        justifyContent: 'center',
      },
      textContainerBottom: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: TAB_BAR_HEIGHT,
      },
      title: {
        color: variables.onboardingTitleTextColor,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 32,
        lineHeight: calculateLineHeight(32),
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        fontWeight: resolveFontWeight('700'),
        marginBottom: getSizeRelativeToReference(10, 812, window.height),
      },
      description: {
        color: variables.onboardingDescriptionTextColor,
        textAlign: 'center',
        fontSize: 15,
        lineHeight: calculateLineHeight(15),
      },
    },

    // i18n

    'shoutem.i18n.LanguageListItem': {
      container: {
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
      },

      text: {
        fontSize: 15,
        lineHeight: 18,
        color: '#222222',
      },

      localisedText: {
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.5,
        color: '#888888',
      },
    },

    // SendBird Extension

    'shoutem.sendbird.MessageListScreen': {
      sectionContainer: {
        backgroundColor: variables.backgroundColor,
      },
      sectionTitle: {
        fontWeight: '500',
        margin: 20,
      },
    },

    'shoutem.sendbird.SectionFooter': {
      height: 15,
      backgroundColor: 'transparent',
    },

    'shoutem.sendbird.ErrorModal': {
      outerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },

      container: {
        paddingHorizontal: 42,
        paddingVertical: 68,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        width: '100%',
        borderRadius: 10,
      },

      image: {
        width: 200,
        height: 156,
        marginBottom: 48,
      },

      title: {
        marginBottom: 22,
        fontWeight: resolveFontWeight('500'),
        fontSize: 21,
        textAlign: 'center',
      },

      description: {
        fontSize: 15,
        marginBottom: 48,
        textAlign: 'center',
      },

      button: {
        backgroundColor: '#4AA8DA',
        borderRadius: 2,
      },

      buttonText: {
        fontSize: 13,
        fontWeight: resolveFontWeight('500'),
        color: '#FFFFFF',
      },
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
      spinnerContainer: {
        paddingVertical: 15,
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
        fontWeight: resolveFontWeight('600'),
      },
    },

    'shoutem.sendbird.MemberListItem': {
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
      text: {
        letterSpacing: -0.17,
        color: '#333333',
        fontSize: 13,
      },
      nickname: {
        fontSize: 15,
      },
    },

    'shoutem.sendbird.SearchBar': {
      placeholderTextColor: 'rgba(0, 0, 0, 0.3)',
      container: {
        padding: 20,
        height: 80,
        backgroundColor: variables.backgroundColor,
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
        fontWeight: resolveFontWeight('500'),
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
        marginLeft: 49,
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
      withProfileImage: {
        marginLeft: 5,
      },
      secondaryText: {
        color: '#333333',
      },
      linkText: {
        color: '#0645AD',
      },
      date: {
        opacity: 0.4,
        fontSize: 10,
        marginRight: 20,
        marginTop: 5,
      },
      dateSecondary: {
        marginRight: 0,
        marginLeft: 49,
      },
      profileImage: {
        width: 24,
        height: 24,
        marginLeft: 20,
        borderRadius: 12,
      },
      docImage: {
        width: 200,
        height: 200,
      },
      fileNameText: {
        fontWeight: resolveFontWeight('500'),
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
        minHeight: 37,
        maxHeight: 80,
        borderRadius: 100,
        backgroundColor: 'transparent',
        borderColor: '#333333',
        borderWidth: 2,
        paddingTop: 9,
        paddingBottom: 10,
        paddingLeft: 16,
        paddingRight: 44,
        fontSize: 13,
        letterSpacing: -0.17,
        textAlignVertical: 'center',
        color: '#000000',
        overflow: 'hidden',
      },
      sendIcon: {
        icon: {
          width: 29,
          height: 29,
        },
        wrapper: {
          position: 'absolute',
          top: '50%',
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

    // In-App Purchases

    'shoutem.in-app-purchases.SuccessModal': {
      container: {
        flex: 1,
        paddingBottom: 56,
        paddingHorizontal: 40,
        paddingTop: 80,
        justifyContent: 'space-between',
        backgroundColor: variables.paperColor,
      },

      modal: {
        margin: 0,
      },

      button: {
        height: 48,
        borderRadius: 0,
        borderColor: variables.primaryButtonBorderColor,
        backgroundColor: variables.primaryButtonBackgroundColor,
      },

      buttonText: {
        fontSize: 17,
        lineHeight: 24,
        color: variables.primaryButtonText.color,
        fontWeight: '400',
      },

      description: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginVertical: 16,
      },

      title: {
        color: variables.title.color,
        fontWeight: '500',
        fontSize: 24,
        lineHeight: 32,
        textAlign: 'center',
        letterSpacing: -0.408,
        marginVertical: 16,
      },
    },

    'shoutem.in-app-purchases.SubscriptionsScreen': {
      scrollContainer: {
        paddingBottom: 16,
      },

      scrollGradient: {
        locations: [0, 0.8, 1],
        colors: [
          changeColorAlpha(variables.paperColor, 0),
          changeColorAlpha(variables.paperColor, 0),
          changeColorAlpha(variables.paperColor, 0.5),
        ],
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },

      buttonContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
        marginTop: 16,
      },

      button: {
        height: 48,
        borderRadius: 6,
        borderColor: variables.primaryButtonBorderColor,
        backgroundColor: variables.primaryButtonBackgroundColor,
      },

      buttonSecondary: {
        marginTop: 16,
        backgroundColor: variables.secondaryButtonBackgroundColor,
        borderColor: variables.secondaryButtonBorderColor,
      },

      buttonText: {
        fontSize: 17,
        lineHeight: 24,
        color: variables.primaryButtonText.color,
        fontWeight: '400',
      },

      buttonTextSecondary: {
        color: variables.secondaryButtonTextColor,
      },

      trialText: {
        fontSize: 14,
        lineHeight: 24,
        marginTop: 8,
        textAlign: 'center',
      },

      leadingText: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        padding: 16,
      },

      image: {
        marginTop: 16,
        width: window.width,
        height: window.width * 0.5,
      },

      spinner: {
        color: variables.primaryButtonText.color,
        size: 20,
      },

      spinnerSecondary: {
        color: variables.secondaryButtonTextColor,
      },
    },

    'shoutem.in-app-purchases.TermsAndPolicy': {
      mainText: {
        textAlign: 'center',
        marginBottom: 16,
      },

      linkText: {
        ...variables.links,
        fontFamily: resolveFontFamily(
          variables.links.fontFamily,
          variables.links.fontWeight,
          variables.links.fontStyle,
        ),
        fontWeight: resolveFontWeight(variables.links.fontWeight),
        fontStyle: resolveFontStyle(variables.links.fontStyle),
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

    // News

    'shoutem.news.ArticleDetailsScreen': {
      outerPadding: 10,
    },

    // Layouts

    'shoutem.layouts.FullGridRowItemView': {
      container: {
        borderColor: 'rgba(68,79,108,0.2)',
        borderRadius: 4,
        borderWidth: 1,
        marginBottom: 8,
      },
      imageContainer: { height: dimensionRelativeToIphone(224) },
      textContainer: {
        backgroundColor: variables.newsGrid122ItemBackgroundColor,
        borderTopColor: 'rgba(68,79,108,0.2)',
        borderTopWidth: 1,
        height: dimensionRelativeToIphone(92),
        paddingBottom: 4,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
      },
      title: { fontSize: 20, fontWeight: 'bold', lineHeight: 24 },
      description: {
        fontSize: 14,
        lineHeight: 16,
        paddingBottom: 16,
        paddingTop: 4,
      },
    },

    'shoutem.layouts.FeaturedGridRowItemView': {
      [INCLUDE]: ['shoutem.layouts.FullGridRowItemView'],
      container: {
        borderWidth: 0,
        overflow: 'visible',
        shadowColor: 'rgba(0, 0, 0, 0.12)',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      description: {
        fontSize: 16,
        lineHeight: 24,
      },
      imageContainer: {
        // Image has to be a square, 1:1 ratio. Using (-16) because
        // shoutem.layouts.Grid122FullRowView.container.marginHorizontal = 8
        height: window.width - 16,
      },
      textContainer: {
        height: dimensionRelativeToIphone(110),
      },
    },

    'shoutem.layouts.HalfGridRowItemView': {
      [INCLUDE]: ['shoutem.layouts.FullGridRowItemView'],
      container: {
        ...['shoutem.layouts.FullGridRowItemView'],
        marginHorizontal: 4,
      },
      imageContainer: { height: dimensionRelativeToIphone(110) },
      textContainer: {
        ...['shoutem.layouts.FullGridRowItemView'],
        height: dimensionRelativeToIphone(108),
      },
    },

    'shoutem.layouts.CompactListSkeletonPlaceholder': {
      featuredItem: {
        width: dimensionRelativeToIphone(365),
        height: dimensionRelativeToIphone(345),
        alignSelf: 'center',
        paddingVertical: variables.smallGutter,
      },
      image: {
        height: 67,
        width: 67,
        borderRadius: 2,
        marginRight: variables.mediumGutter,
      },
      shortLine: {
        marginBottom: variables.smallGutter,
        height: 15,
        width: Dimensions.get('window').width / 2,
      },
      longLine: {
        marginBottom: variables.mediumGutter,
        height: 15,
        width: Dimensions.get('window').width / 2 + 30,
      },
      dateStampLine: {
        marginVertical: variables.smallGutter,
        height: 10,
        width: 100,
      },
    },

    'shoutem.layouts.DetailsSkeletonPlaceholder': {
      image: { height: 300, width: '100%' },
      contentContainer: { flexDirection: 'column', alignItems: 'center' },
      titleLine: {
        height: 30,
        width: 200,
        marginTop: variables.largeGutter,
        marginBottom: variables.mediumGutter,
      },
      shortLine: {
        marginTop: variables.smallGutter,
        height: 15,
        width: Dimensions.get('window').width - variables.extraLargeGutter,
      },
      longLine: {
        marginTop: variables.smallGutter,
        height: 15,
        width: Dimensions.get('window').width - variables.largeGutter,
      },
    },

    'shoutem.layouts.FixedGridSkeletonPlaceholder': {
      card: {
        borderWidth: 1,
        borderColor: 'rgba(102, 102, 102, 0.1)',
        overflow: 'hidden',
        height: 200,
        width: '48%',
      },
      featuredItem: {
        width: dimensionRelativeToIphone(365),
        height: dimensionRelativeToIphone(345),
      },
      image: { height: 88 },
      shortLine: { width: 80, marginBottom: variables.smallGutter },
      longLine: { width: 100, marginBottom: variables.smallGutter },
      dateStampLine: {
        height: 10,
        width: 70,
        marginTop: variables.mediumGutter,
      },
    },

    'shoutem.layouts.LargeListSkeletonPlaceholder': {
      image: { width: window.width, height: dimensionRelativeToIphone(238) },
      shortLine: {
        marginBottom: variables.smallGutter,
        height: 15,
        width: Dimensions.get('window').width / 2,
      },
      longLine: {
        marginBottom: variables.mediumGutter,
        height: 15,
        width: Dimensions.get('window').width / 2 + variables.largeGutter,
      },
      dateStampLine: {
        marginVertical: variables.smallGutter,
        height: 10,
        width: 100,
      },
    },

    'shoutem.layouts.TileListSkeletonPlaceholder': {
      itemContainer: { flex: 1, width: '100%', marginBottom: 1 },
    },

    // User-profile
    'shoutem.user-profile.FormInput': {
      textInput: {
        borderColor: variables.text.color,
        borderRadius: 6,
        paddingHorizontal: variables.mediumGutter,
        paddingVertical: variables.smallGutter,
        textAlignVertical: 'center',
      },

      multilineTextInput: {
        height: 70,
        textAlignVertical: 'top',
      },

      label: {
        fontSize: variables.text.fontSize,
        paddingHorizontal: variables.smallGutter,
        paddingVertical: variables.smallGutter,
      },
    },

    'shoutem.user-profile.SubmitButton': {
      container: {
        marginTop: variables.largeGutter,
        marginBottom: Device.select({
          iPhoneX: IPHONE_X_HOME_INDICATOR_PADDING,
          iPhoneXR: IPHONE_X_HOME_INDICATOR_PADDING,
          default: variables.smallGutter,
        }),
        marginHorizontal: variables.smallGutter,
      },

      button: {
        borderRadius: 6,
      },
    },

    'shoutem.user-profile.ImageUpload': {
      label: {
        fontSize: variables.text.fontSize,
        paddingHorizontal: variables.smallGutter,
        paddingVertical: variables.smallGutter,
        marginBottom: variables.mediumGutter,
      },

      imageCarousel: {
        container: { marginBottom: variables.mediumGutter },
      },

      actionSheet: {
        tintColor: 'black',
        userInterfaceStyle: 'light',
      },
    },

    'shoutem.user-profile.TextValue': {
      labelContainer: {
        width: '30%',
      },

      divider: {
        borderBottomWidth: 1,
      },

      label: {
        fontSize: variables.text.fontSize,
        paddingHorizontal: variables.smallGutter,
        paddingVertical: variables.smallGutter,
      },

      pressableLink: {
        textDecorationLine: 'underline',
      },

      pressedLink: {
        opacity: 0.5,
      },
    },

    'shoutem.user-profile.EditProfileScreen': {
      padding: {
        padding: variables.mediumGutter,
        marginBottom: Device.select({
          iPhoneX: IPHONE_X_HOME_INDICATOR_PADDING,
          iPhoneXR: IPHONE_X_HOME_INDICATOR_PADDING,
          default: variables.smallGutter,
        }),
      },
    },

    'shoutem.user-profile.SubmissionCompletedScreen': {
      title: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
      },
      description: { textAlign: 'center', fontSize: 15 },
    },

    'shoutem.user-profile.EmptyImagesView': {
      icon: { width: 66, height: 66 },
      uploadContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: dimensionRelativeToIphone(275),
      },
      uploadMessage: {
        paddingTop: variables.largeGutter,
      },
    },

    'shoutem.user-profile.ImageCarousel': {
      container: {
        justifyContent: 'center',
      },
      galleryContainer: {
        height: getSizeRelativeToReference(250, 812, window.height),
        width: '100%',
      },
      overlayContainer: {
        width: '100%',
        zIndex: 1,
        position: 'absolute',
        bottom: 18,
      },
      roundedImageContainer: {
        alignSelf: 'center',
        width: getSizeRelativeToReference(250, 812, window.height),
        height: getSizeRelativeToReference(250, 812, window.height),
      },
      roundedImage: {
        width: getSizeRelativeToReference(250, 812, window.height),
        height: getSizeRelativeToReference(250, 812, window.height),
        borderRadius: getSizeRelativeToReference(125, 812, window.height),
      },
      loadingContainer: { height: '70%' },
      imageGalleryShown: { opacity: 1 },
      imageGalleryHidden: { opacity: 0 },
      overlayText: { paddingBottom: 26, fontSize: 11, color: '#FFFFFF' },
      image: { flex: 1 },
      carouselButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignSelf: 'flex-end',
        position: 'absolute',
        top: variables.mediumGutter,
        right: variables.mediumGutter,
        borderColor: 'transparent',
        backgroundColor: changeColorAlpha('gray', 0.1),
      },
      carouselIcon: { color: '#FFFFFF', width: 20, height: 20 },
      uploadButton: {
        marginVertical: variables.mediumGutter,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
      uploadText: {
        color: variables.primaryButtonText.color,
        fontSize: 15,
        fontWeight: 'bold',
      },
      pageIndicators: {
        indicatorContainer: {
          'shoutem.ui.View': {
            backgroundColor: changeColorAlpha(
              variables.imageOverlayTextColor,
              0.4,
            ),

            '.selected': {
              backgroundColor: variables.imageOverlayTextColor,
            },
          },
        },
      },
    },

    'shoutem.user-profile.MyProfileScreen': {
      container: {
        paddingBottom: Device.select({
          iPhoneX: IPHONE_X_HOME_INDICATOR_PADDING,
          iPhoneXR: IPHONE_X_HOME_INDICATOR_PADDING,
          notchedAndroid: variables.smallGutter,
          default: variables.smallGutter,
        }),
        paddingTop: variables.mediumGutter,
      },
    },

    'shoutem.user-profile.UserProfileScreen': {
      container: {
        paddingBottom: Device.select({
          iPhoneX: IPHONE_X_HOME_INDICATOR_PADDING,
          iPhoneXR: IPHONE_X_HOME_INDICATOR_PADDING,
          notchedAndroid: variables.smallGutter,
          default: variables.smallGutter,
        }),
      },
    },

    'shoutem.user-profile.ImagesPreview': {
      container: {
        justifyContent: 'center',
      },
      galleryContainer: {
        height: getSizeRelativeToReference(250, 812, window.height),
        width: '100%',
        marginTop: variables.mediumGutter,
      },
      overlayContainer: {
        width: '100%',
        zIndex: 1,
        position: 'absolute',
        bottom: 18,
      },
      overlayText: { paddingBottom: 26, fontSize: 11, color: '#FFFFFF' },
      label: {
        fontSize: variables.text.fontSize,
        paddingHorizontal: variables.smallGutter,
        paddingVertical: variables.smallGutter,
        marginBottom: variables.mediumGutter,
      },
      imageContainer: {
        // Not flexible
        alignSelf: 'center',
        width: '100%',
        height: '100%',
      },
      roundedImageContainer: {
        width: getSizeRelativeToReference(250, 812, window.height),
      },
      roundedImage: {
        borderRadius: getSizeRelativeToReference(125, 812, window.height),
      },
      pageIndicators: {
        indicatorContainer: {
          'shoutem.ui.View': {
            backgroundColor: changeColorAlpha(
              variables.imageOverlayTextColor,
              0.4,
            ),

            '.selected': {
              backgroundColor: variables.imageOverlayTextColor,
            },
          },
        },
      },
      galleryHeaderContainer: {
        height: dimensionRelativeToIphone(90),
        zIndex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: variables.mediumGutter,
        paddingTop: Device.select({
          iPhoneX: variables.extraLargeGutter,
          iPhoneXR: variables.extraLargeGutter,
          notchedAndroid: variables.extraLargeGutter,
          default: 10,
        }),
      },
      emptyGalleryContainer: {
        paddingVertical: variables.extraLargeGutter,
      },
      closeGalleryIcon: {
        color: '#FFFFFF',
      },
      galleryHeaderTitle: {
        alignSelf: 'center',
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      imageGallery: {
        container: {
          marginTop: -NAVIGATION_BAR_HEIGHT,
          backgroundColor: 'rgba(0,0,0,0.9)',
        },
      },
      divider: {
        borderBottomWidth: 1,
      },
    },

    'shoutem.user-profile.BaseUserProfile': {
      name: {
        fontSize: 16,
        lineHeight: calculateLineHeight(16),
      },
      nick: {
        fontSize: 13,
        lineHeight: calculateLineHeight(13),
        opacity: 0.6,
      },
      profileImage: {
        borderRadius: dimensionRelativeToIphone(145 / 2),
      },
    },

    'shoutem.ginger.CheckoutScreen': {
      scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: getSizeRelativeToReference(10, 375, window.width),
        paddingTop: getSizeRelativeToReference(5, 375, window.width),
        backgroundColor: variables.paperColor,
      },
      buttonContainer: {
        backgroundColor: variables.paperColor,
        paddingHorizontal: getSizeRelativeToReference(30, 375, window.width),
        paddingVertical: getSizeRelativeToReference(30, 375, window.width),
      },
      infoSection: {
        flexDirection: 'row',
        paddingHorizontal: getSizeRelativeToReference(10, 375, window.width),
        paddingVertical: getSizeRelativeToReference(15, 375, window.width),
        backgroundColor: '#F3F4F6',
      },
      infoIcon: {
        width: getSizeRelativeToReference(24, 375, window.width),
        height: getSizeRelativeToReference(24, 375, window.width),
        color: variables.text.color,
      },
      infoText: {
        fontSize: 12,
        lineHeight: 16,
        marginLeft: 10,
        flexShrink: 1,
      },
      addressSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      sectionTitle: {
        color: variables.text.color,
        fontSize: 15,
        lineHeight: 18,
        letterSpacing: 0.361,
        marginBottom: 3,
        marginTop: 10,
        opacity: 1,
      },
      sectionValue: {
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: 0.361,
        opacity: 0.7,
        paddingLeft: getSizeRelativeToReference(15, 375, window.width),
        paddingVertical: 5,
      },
      dropdownContainer: {
        paddingTop: 0,
        paddingHorizontal: 0,
        paddingBottom: 0,
      },
      dropdownSelectedOptionContainer: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.12)',
        height: getSizeRelativeToReference(50, 812, window.height),
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
      },
      dropdownSelectedOption: {
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: 0.361,
        opacity: 0.7,
      },
      textInput: {
        padding: getSizeRelativeToReference(15, 375, window.width),
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.12)',
        minHeight: getSizeRelativeToReference(90, 812, window.height),
      },
      spinner: {
        color: variables.primaryButtonText.color,
      },
    },

    'shoutem.ginger.CartIcon': {
      outerContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      },
      innerContainer: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: variables.indicatorColor,
        justifyContent: 'center',
        alignItems: 'center',
      },
      indicatorText: {
        fontSize: 7,
        color: '#FFFFFF',
      },
    },

    'shoutem.ginger.LargeProductListItem': {
      container: {
        backgroundColor: variables.paperColor,
        shadowColor: variables.shadowColor,
        shadowOffset: { width: 1, height: 2 },
        shadowRadius: 10,
        shadowOpacity: 1,
        borderRadius: 4,
        padding: getSizeRelativeToReference(15, 375, window.width),
        marginBottom: getSizeRelativeToReference(10, 812, window.height),
      },
      textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      image: {
        borderRadius: 4,
        width: getSizeRelativeToReference(200, 375, window.width),
        height: getSizeRelativeToReference(200, 375, window.width),
        marginBottom: getSizeRelativeToReference(23, 812, window.height),
        alignSelf: 'center',
      },
      title: {
        flexShrink: 1,
        fontSize: 15,
        lineHeight: 18,
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        fontWeight: resolveFontWeight('700'),
        marginBottom: getSizeRelativeToReference(23, 812, window.height),
      },
      subtitle: {
        fontFamily: resolveFontFamily(variables.subtitle.fontFamily, '500'),
        fontWeight: resolveFontWeight('500'),
        fontSize: 14,
        lineHeight: 18,
        letterSpacing: -0.165,
      },
      price: {
        fontFamily: resolveFontFamily(variables.subtitle.fontFamily, '500'),
        fontWeight: resolveFontWeight('500'),
        fontSize: 20,
        lineHeight: 24,
        letterSpacing: -0.165,
      },
      button: {
        marginTop: getSizeRelativeToReference(12, 812, window.height),
        height: getSizeRelativeToReference(48, 812, window.height),
      },
    },

    'shoutem.ginger.SmallProductListItem': {
      container: {
        backgroundColor: variables.paperColor,
        shadowColor: variables.shadowColor,
        shadowOffset: { width: 1, height: 2 },
        shadowRadius: 10,
        shadowOpacity: 1,
        borderRadius: 4,
        marginBottom: getSizeRelativeToReference(10, 812, window.height),
      },
      infoContainer: {
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        borderRadius: 4,
        padding: getSizeRelativeToReference(16, 375, window.width),
        maxWidth: getSizeRelativeToReference(185, 375, window.width),
      },
      image: {
        borderRadius: 4,
        width: getSizeRelativeToReference(160, 375, window.width),
        height: getSizeRelativeToReference(128, 812, window.height),
      },
      title: {
        fontSize: 20,
        lineHeight: 24,
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        fontWeight: resolveFontWeight('700'),
        marginBottom: 8,
      },
      subtitle: {
        fontFamily: resolveFontFamily(variables.subtitle.fontFamily, '700'),
        fontWeight: resolveFontWeight('700'),
        fontSize: 12,
        lineHeight: 14,
        letterSpacing: 0.5,
      },
      button: {
        borderRadius: 4,
        height: getSizeRelativeToReference(40, 812, window.height),
      },
      buttonIcon: {
        width: 24,
        height: 24,
      },
      buttonText: {
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        fontWeight: resolveFontWeight('700'),
        lineHeight: 14,
      },
      spinner: {
        color: variables.primaryButtonText.color,
      },
    },

    'shoutem.ginger.Category': {
      container: {
        marginHorizontal: getSizeRelativeToReference(15, 375, window.width),
      },
      category: {
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        fontWeight: resolveFontWeight('700'),
        letterSpacing: -0.165,
        fontSize: 15,
        lineHeight: 24,
      },
      selectedCategory: {
        color: changeColorAlpha(variables.text.color, 0.5),
      },
    },

    'shoutem.ginger.CategoryPicker': {
      container: {
        paddingHorizontal: getSizeRelativeToReference(8, 375, window.width),
        paddingVertical: getSizeRelativeToReference(15, 375, window.width),
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: variables.paperColor,
      },
    },

    'shoutem.ginger.ProductDetailsScreen': {
      container: {
        paddingVertical: getSizeRelativeToReference(24, 812, window.height),
        paddingHorizontal: getSizeRelativeToReference(30, 375, window.width),
      },
      image: {
        width: getSizeRelativeToReference(200, 375, window.width),
        height: getSizeRelativeToReference(200, 375, window.width),
        marginBottom: getSizeRelativeToReference(12, 812, window.height),
      },
      title: {
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        fontWeight: resolveFontWeight('700'),
        fontSize: 16,
        lineHeight: 19,
        marginBottom: getSizeRelativeToReference(16, 812, window.height),
      },
      subtitle: {
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        fontWeight: resolveFontWeight('700'),
        fontSize: 12,
        lineHeight: 14,
        letterSpacing: 0.5,
        marginBottom: getSizeRelativeToReference(16, 812, window.height),
        opacity: 0.5,
      },
      price: {
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        fontWeight: resolveFontWeight('700'),
        fontSize: 24,
        lineHeight: 28,
        marginBottom: getSizeRelativeToReference(15, 812, window.height),
      },
      quantityIcon: {
        width: getSizeRelativeToReference(16, 375, window.width),
        height: getSizeRelativeToReference(16, 375, window.width),
        color: changeColorAlpha(variables.text.color, 0.5),
        marginRight: getSizeRelativeToReference(5, 375, window.width),
        marginBottom: getSizeRelativeToReference(16, 812, window.height),
      },
      button: {
        marginLeft: getSizeRelativeToReference(10, 375, window.width),
        flex: 1,
      },
      spinner: {
        color: variables.primaryButtonText.color,
      },
      buttonText: {
        fontSize: 13,
        lineHeight: 13,
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        fontWeight: resolveFontWeight('700'),
      },
      description: {
        marginTop: getSizeRelativeToReference(15, 812, window.height),
        fontSize: 13,
        lineHeight: 16,
      },
      paginationContainer: {
        paddingHorizontal: 0,
        paddingVertical: 0,
        marginBottom: getSizeRelativeToReference(15, 812, window.height),
      },
      paginationDotContainer: {
        marginHorizontal: 0,
      },
      paginationDot: {
        width: getSizeRelativeToReference(10, 375, window.width),
        height: getSizeRelativeToReference(10, 375, window.width),
        borderRadius: getSizeRelativeToReference(10, 375, window.width) / 2,
        marginHorizontal: getSizeRelativeToReference(7, 375, window.width),
        backgroundColor: variables.primaryButtonBackgroundColor,
      },
    },

    'shoutem.ginger.OrderCancellationScreen': {
      container: {
        paddingTop: getSizeRelativeToReference(15, 812, window.height),
        paddingBottom: getSizeRelativeToReference(30, 812, window.height),
        paddingHorizontal: getSizeRelativeToReference(30, 375, window.width),
        flexGrow: 1,
      },
      infoContainer: {
        marginBottom: getSizeRelativeToReference(30, 812, window.height),
      },
      sectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: getSizeRelativeToReference(15, 812, window.height),
      },
      imageContainer: {
        paddingHorizontal: getSizeRelativeToReference(4, 375, window.width),
        marginTop: getSizeRelativeToReference(10, 812, window.height),
      },
      image: {
        width: getSizeRelativeToReference(57, 375, window.width),
        height: getSizeRelativeToReference(57, 375, window.width),
        marginRight: getSizeRelativeToReference(23, 375, window.width),
      },
      sectionTitle: {
        fontWeight: resolveFontWeight('500'),
        fontFamily: resolveFontFamily(variables.text.fontFamily, '500'),
        fontSize: 15,
        lineHeight: 26,
      },
      dropdownContainer: {
        paddingTop: 0,
        paddingHorizontal: 0,
        paddingBottom: 0,
      },
      dropdownSelectedOptionContainer: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.12)',
        height: getSizeRelativeToReference(50, 812, window.height),
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
      },
      dropdownSelectedOption: {
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: 0.361,
        opacity: 0.7,
      },
      dropdownSectionTitle: {
        color: variables.text.color,
        fontSize: 15,
        lineHeight: 18,
        letterSpacing: 0.361,
        marginBottom: 3,
        marginTop: 10,
        opacity: 1,
      },
      textInput: {
        padding: getSizeRelativeToReference(15, 375, window.width),
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.12)',
        minHeight: getSizeRelativeToReference(90, 812, window.height),
      },
      buttonContainer: {
        backgroundColor: variables.paperColor,
        paddingHorizontal: getSizeRelativeToReference(30, 375, window.width),
        paddingBottom: getSizeRelativeToReference(30, 375, window.width),
      },
      button: {
        marginTop: getSizeRelativeToReference(10, 812, window.height),
      },
    },

    'shoutem.ginger.OrderCompleteScreen': {
      container: {
        paddingBottom: getSizeRelativeToReference(30, 375, window.width),
        flexGrow: 1,
      },
      titleContainer: {
        paddingVertical: getSizeRelativeToReference(15, 812, window.height),
        flexDirection: 'row',
        justifyContent: 'center',
      },
      title: {
        fontSize: 20,
        lineHeight: 25,
        letterSpacing: 0.5,
      },
      confirmationText: {
        fontSize: 14,
        lineHeight: 26,
        paddingTop: getSizeRelativeToReference(30, 812, window.height),
        paddingBottom: getSizeRelativeToReference(15, 812, window.height),
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
      },
      orderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: getSizeRelativeToReference(15, 812, window.height),
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
      },
      orderText: {
        fontWeight: resolveFontWeight('500'),
        fontFamily: resolveFontFamily(variables.text.fontFamily, '500'),
        fontSize: 15,
        lineHeight: 26,
      },
      infoText: {
        fontSize: 14,
        lineHeight: 26,
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
      },
      priceText: {
        fontSize: 14,
        lineHeight: 26,
        fontWeight: resolveFontWeight('700'),
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        marginBottom: getSizeRelativeToReference(15, 812, window.height),
        marginTop: getSizeRelativeToReference(30, 812, window.height),
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
      },
      actionRow: {
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
        flex: 1,
        height: getSizeRelativeToReference(56, 812, window.height),
        flexDirection: 'row',
        alignItems: 'center',
      },
      icon: {
        width: getSizeRelativeToReference(24, 375, window.width),
        height: getSizeRelativeToReference(24, 375, window.width),
        marginRight: getSizeRelativeToReference(10, 375, window.width),
      },
      actionText: {
        fontSize: 15,
        lineHeight: 24,
      },
      separator: {
        height: 1,
        flexDirection: 'row',
        flex: 1,
        backgroundColor: variables.lineColor,
      },
      buttonContainer: {
        backgroundColor: variables.paperColor,
        paddingHorizontal: getSizeRelativeToReference(30, 375, window.width),
        paddingBottom: getSizeRelativeToReference(30, 375, window.width),
      },
      button: {
        height: getSizeRelativeToReference(44, 812, window.height),
        marginTop: getSizeRelativeToReference(10, 812, window.height),
        borderRadius: 4,
      },
      map: {
        width: window.width,
        height: getSizeRelativeToReference(160, 812, window.height),
      },
      mapTextContainer: {
        backgroundColor: variables.imageOverlayColor,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1,
      },
      mapText: {
        textAlign: 'center',
        flexShrink: 1,
        color: variables.primaryButtonText.color,
        marginBottom: getSizeRelativeToReference(24, 812, window.height),
        fontSize: 12,
        lineHeight: 14,
      },
    },

    'shoutem.ginger.OrderDetailsScreen': {
      container: {
        paddingTop: getSizeRelativeToReference(15, 375, window.width),
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
      },
      mainScrollContainer: {
        flexGrow: 0,
      },
      scrollContainer: {
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
        paddingVertical: getSizeRelativeToReference(30, 375, window.width),
      },
      sectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: getSizeRelativeToReference(10, 812, window.height),
      },
      sectionHeading: {
        fontWeight: resolveFontWeight('500'),
        fontFamily: resolveFontFamily(variables.text.fontFamily, '500'),
        fontSize: 15,
        lineHeight: 26,
        color: '#666666',
      },
      sectionInfo: {
        fontWeight: resolveFontWeight('500'),
        fontFamily: resolveFontFamily(variables.text.fontFamily, '500'),
        fontSize: 15,
        lineHeight: 26,
      },
      sectionInfoPositive: {
        color: '#19A68F',
      },
      sectionInfoNegative: {
        color: variables.errorText.color,
      },
      sectionIcon: {
        width: getSizeRelativeToReference(24, 375, window.width),
        height: getSizeRelativeToReference(24, 375, window.width),
        marginRight: getSizeRelativeToReference(4, 375, window.width),
        color: '#666666',
      },
      itemsHeading: {
        marginBottom: getSizeRelativeToReference(10, 812, window.height),
        fontWeight: resolveFontWeight('600'),
        fontFamily: resolveFontFamily(variables.text.fontFamily, '600'),
        fontSize: 16,
        lineHeight: 18,
        letterSpacing: -0.165,
      },
      actionRow: {
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
        height: getSizeRelativeToReference(56, 812, window.height),
        flexDirection: 'row',
        alignItems: 'center',
      },
      icon: {
        width: getSizeRelativeToReference(24, 375, window.width),
        height: getSizeRelativeToReference(24, 375, window.width),
        marginRight: getSizeRelativeToReference(10, 375, window.width),
      },
      actionText: {
        fontSize: 15,
        lineHeight: 24,
      },
      separator: {
        height: 1,
        flexDirection: 'row',
        backgroundColor: variables.lineColor,
      },
    },

    'shoutem.ginger.SelectLocationScreen': {
      container: {
        flex: 1,
        backgroundColor: variables.paperColor,
        justifyContent: 'center',
        alignItems: 'center',
      },
      image: {
        height: getSizeRelativeToReference(285, 375, window.width),
        width: getSizeRelativeToReference(285, 375, window.width),
      },
      autocompleteContainer: {
        paddingVertical: getSizeRelativeToReference(15, 812, window.height),
        paddingHorizontal: getSizeRelativeToReference(10, 375, window.width),
      },
      autocompleteStyles: {
        container: {
          flex: 1,
        },
        textInputContainer: {
          flexDirection: 'row',
          marginBottom: getSizeRelativeToReference(10, 812, window.height),
        },
        textInput: {
          fontSize: 13,
          lineHeight: 16,
          justifyContent: 'center',
          borderRadius: 10,
          backgroundColor: 'rgba(136, 143, 161, 0.1)',
          height: getSizeRelativeToReference(48, 812, window.height),
          paddingLeft: getSizeRelativeToReference(16, 375, window.width),
          // Take clear button into account
          paddingRight: getSizeRelativeToReference(32, 375, window.width),
          flex: 1,
        },
        row: {
          height: getSizeRelativeToReference(48, 812, window.height),
          flexDirection: 'row',
          justifyContent: 'center',
          borderRadius: 10,
        },
        loader: {
          marginTop: getSizeRelativeToReference(15, 375, window.width),
          height: getSizeRelativeToReference(15, 375, window.width),
        },
        separator: {
          height: getSizeRelativeToReference(1, 812, window.height),
          backgroundColor: variables.paperColor,
        },
      },
      placeholderColor: changeColorAlpha(variables.text.color, 0.6),
      closeIconContainer: {
        position: 'absolute',
        right: getSizeRelativeToReference(16, 375, window.width),
        height: getSizeRelativeToReference(48, 812, window.height),
        justifyContent: 'center',
        zIndex: 2,
        elevation: 2,
      },
      closeIcon: {
        color: variables.primaryButtonBackgroundColor,
        width: getSizeRelativeToReference(15, 375, window.width),
        height: getSizeRelativeToReference(15, 375, window.width),
      },
      currentLocationContainer: {
        alignItems: 'center',
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
      },
      currentLocationIcon: {
        flexDirection: 'row',
        height: getSizeRelativeToReference(16, 375, window.width),
        width: getSizeRelativeToReference(16, 375, window.width),
        marginRight: getSizeRelativeToReference(4, 375, window.width),
      },
      listItem: {
        fontSize: 13,
        lineHeight: 16,
      },
      listItemContainer: {
        justifyContent: 'center',
        backgroundColor: variables.backgroundColor,
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
        marginBottom: 1,
        marginTop: 1,
      },
      firstItemContainer: {
        marginTop: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      },
      lastItemContainer: {
        marginBottom: 0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      },
    },

    'shoutem.ginger.OrderListScreen': {
      container: {
        padding: getSizeRelativeToReference(15, 375, window.width),
        paddingBottom: getSizeRelativeToReference(15, 375, window.width),
      },
      sectionHeaderContainer: {
        flexDirection: 'row',
        flex: 1,
        paddingVertical: getSizeRelativeToReference(10, 812, window.height),
      },
      sectionHeaderText: {
        fontSize: 16,
        lineHeight: 18,
        letterSpacing: -0.165,
        fontWeight: resolveFontWeight('600'),
        fontFamily: resolveFontFamily(variables.text.fontFamily, '600'),
      },
    },

    'shoutem.ginger.OrderListItem': {
      container: {
        backgroundColor: variables.paperColor,
        padding: getSizeRelativeToReference(10, 375, window.width),
        flexDirection: 'row',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 1,
        shadowRadius: 10,
        shadowOffset: { width: 1, height: 2 },
        borderRadius: 12,
        marginTop: getSizeRelativeToReference(5, 375, window.width),
        marginBottom: getSizeRelativeToReference(5, 375, window.width),
      },
      contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        marginLeft: getSizeRelativeToReference(18, 375, window.width),
      },
      image: {
        width: getSizeRelativeToReference(62, 375, window.width),
        height: getSizeRelativeToReference(62, 375, window.width),
        borderRadius: 8,
        overflow: 'hidden',
      },
      icon: {
        marginLeft: getSizeRelativeToReference(10, 375, window.width),
        width: getSizeRelativeToReference(16, 375, window.width),
        height: getSizeRelativeToReference(16, 375, window.width),
      },
      countIndicator: {
        fontWeight: resolveFontWeight('700'),
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        fontSize: 20,
        lineHeight: 24,
        letterSpacing: 0.5,
        color: variables.paperColor,
      },
      orderIdText: {
        fontWeight: resolveFontWeight('500'),
        fontFamily: resolveFontFamily(variables.text.fontFamily, '500'),
        fontSize: 14,
        lineHeight: 18,
        letterSpacing: -0.165,
        opacity: 0.7,
      },
      dateText: {
        fontWeight: resolveFontWeight('500'),
        fontFamily: resolveFontFamily(variables.text.fontFamily, '500'),
        fontSize: 14,
        lineHeight: 18,
        letterSpacing: -0.165,
        marginTop: getSizeRelativeToReference(10, 812, window.height),
        opacity: 0.7,
      },
      orderStatusPositive: {
        color: '#19A68F',
        opacity: 1,
      },
      orderStatusNegative: {
        color: variables.errorText.color,
        opacity: 1,
      },
      priceText: {
        fontWeight: resolveFontWeight('600'),
        fontFamily: resolveFontFamily(variables.text.fontFamily, '600'),
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.17,
      },
      paginationContainer: {
        paddingHorizontal: 0,
        paddingVertical: 0,
        marginBottom: getSizeRelativeToReference(15, 812, window.height),
      },
      paginationDotContainer: {
        marginHorizontal: 0,
      },
      paginationDot: {
        width: getSizeRelativeToReference(10, 375, window.width),
        height: getSizeRelativeToReference(10, 375, window.width),
        borderRadius: getSizeRelativeToReference(10, 375, window.width) / 2,
        marginHorizontal: getSizeRelativeToReference(7, 375, window.width),
        backgroundColor: variables.primaryButtonBackgroundColor,
      },
      overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: variables.imageOverlayColor,
      },
    },

    'shoutem.ginger.CancelOrderScreen': {
      container: {
        paddingTop: getSizeRelativeToReference(15, 812, window.height),
        paddingBottom: getSizeRelativeToReference(30, 812, window.height),
        paddingHorizontal: getSizeRelativeToReference(30, 375, window.width),
        flexGrow: 1,
      },
      infoContainer: {
        marginBottom: getSizeRelativeToReference(30, 812, window.height),
      },
      sectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: getSizeRelativeToReference(15, 812, window.height),
      },
      imageContainer: {
        paddingHorizontal: getSizeRelativeToReference(4, 375, window.width),
        marginTop: getSizeRelativeToReference(10, 812, window.height),
      },
      image: {
        width: getSizeRelativeToReference(57, 375, window.width),
        height: getSizeRelativeToReference(57, 375, window.width),
        marginRight: getSizeRelativeToReference(23, 375, window.width),
      },
      sectionTitle: {
        fontWeight: resolveFontWeight('500'),
        fontFamily: resolveFontFamily(variables.text.fontFamily, '500'),
        fontSize: 15,
        lineHeight: 26,
      },
      dropdownContainer: {
        paddingTop: 0,
        paddingHorizontal: 0,
        paddingBottom: 0,
      },
      dropdownSelectedOptionContainer: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.12)',
        height: getSizeRelativeToReference(50, 812, window.height),
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
      },
      dropdownSelectedOption: {
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: 0.361,
        opacity: 0.7,
      },
      dropdownSectionTitle: {
        color: variables.text.color,
        fontSize: 15,
        lineHeight: 18,
        letterSpacing: 0.361,
        marginBottom: 3,
        marginTop: 10,
        opacity: 1,
      },
      textInput: {
        padding: getSizeRelativeToReference(15, 375, window.width),
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.12)',
        minHeight: getSizeRelativeToReference(90, 812, window.height),
      },
      buttonContainer: {
        backgroundColor: variables.paperColor,
        paddingHorizontal: getSizeRelativeToReference(30, 375, window.width),
        paddingBottom: getSizeRelativeToReference(30, 375, window.width),
      },
      button: {
        marginTop: getSizeRelativeToReference(10, 812, window.height),
      },
      map: {
        width: window.width,
        height: getSizeRelativeToReference(160, 812, window.height),
      },
    },

    'shoutem.ginger.QuantitySelector': {
      container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: getSizeRelativeToReference(10, 375, window.width),
        height: getSizeRelativeToReference(44, 812, window.height),
        width: getSizeRelativeToReference(116, 375, window.width),
        borderRadius: 4,
        backgroundColor: '#EDEDED',
      },
      containerCompact: {
        padding: 0,
        backgroundColor: 'transparent',
        height: getSizeRelativeToReference(16, 812, window.height),
        width: getSizeRelativeToReference(80, 375, window.width),
      },
      control: {
        width: getSizeRelativeToReference(24, 375, window.width),
        height: getSizeRelativeToReference(24, 375, window.width),
      },
      controlCompact: {
        width: getSizeRelativeToReference(16, 375, window.width),
        height: getSizeRelativeToReference(16, 375, window.width),
      },
      count: {
        fontSize: 15,
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        fontWeight: resolveFontWeight('700'),
        lineHeight: 24,
      },
      countCompact: {
        fontWeight: 'normal',
        lineHeight: 16,
        letterSpacing: 0.5,
      },
    },

    'shoutem.ginger.CartListItem': {
      mainContainer: {
        padding: getSizeRelativeToReference(15, 375, window.width),
        borderRadius: 4,
        backgroundColor: variables.paperColor,
        marginTop: getSizeRelativeToReference(10, 375, window.width),
      },
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: variables.paperColor,
      },
      image: {
        width: getSizeRelativeToReference(65, 375, window.width),
        height: getSizeRelativeToReference(57, 812, window.height),
        marginRight: getSizeRelativeToReference(10, 375, window.width),
      },
      contentContainer: {
        flexDirection: 'row',
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'space-between',
      },
      infoContainer: {
        justifyContent: 'space-between',
      },
      priceContainer: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      },
      title: {
        fontSize: 15,
        lineHeight: 18,
      },
      units: {
        fontSize: 12,
        lineHeight: 15,
      },
      price: {
        fontSize: 15,
        lineHeight: 18,
      },
      discountPrice: {
        fontSize: 12,
        lineHeight: 15,
        textDecorationLine: 'line-through',
        opacity: 0.3,
      },
      lowQuantityText: {
        color: variables.errorText.color,
        marginLeft: getSizeRelativeToReference(75, 375, window.width),
        marginTop: getSizeRelativeToReference(5, 375, window.width),
        fontSize: 12,
        lineHeight: 15,
      },
      removeButton: {
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.5,
        opacity: 0.5,
      },
      bonusImage: {
        width: getSizeRelativeToReference(16, 375, window.width),
        height: getSizeRelativeToReference(16, 375, window.width),
        marginLeft: getSizeRelativeToReference(4, 375, window.width),
      },
    },

    'shoutem.ginger.PromoCodeModal': {
      container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'flex-end',
      },
      contentContainer: {
        paddingTop: getSizeRelativeToReference(15, 812, window.height),
        paddingBottom: getSizeRelativeToReference(30, 812, window.height),
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        backgroundColor: variables.paperColor,
      },
      headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: getSizeRelativeToReference(13, 812, window.height),
        height: getSizeRelativeToReference(44, 812, window.height),
      },
      title: {
        fontSize: 15,
        lineHeight: 18,
        letterSpacing: -0.165,
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        fontWeight: resolveFontWeight('700'),
      },
      iconContainer: {
        position: 'absolute',
        top: getSizeRelativeToReference(10, 812, window.height),
        left: getSizeRelativeToReference(15, 375, window.width),
      },
      icon: {
        width: getSizeRelativeToReference(24, 375, window.width),
        height: getSizeRelativeToReference(24, 375, window.width),
      },
      label: {
        fontSize: 15,
        lineHeight: 18,
        letterSpacing: 0.361,
        paddingLeft: getSizeRelativeToReference(10, 375, window.width),
        marginTop: getSizeRelativeToReference(15, 812, window.height),
        marginBottom: getSizeRelativeToReference(3, 812, window.height),
      },
      info: {
        marginTop: getSizeRelativeToReference(5, 812, window.height),
        paddingHorizontal: getSizeRelativeToReference(10, 375, window.width),
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: 0.361,
        opacity: 0.6,
      },
      infoError: {
        opacity: 1,
        color: variables.errorText.color,
      },
      input: {
        marginHorizontal: getSizeRelativeToReference(10, 375, window.width),
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
        paddingVertical: getSizeRelativeToReference(17, 812, window.height),
        borderRadius: 6,
        borderColor: 'rgba(0, 0, 0, 0.12)',
        borderWidth: 1,
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: 0.361,
      },
      button: {
        marginTop: getSizeRelativeToReference(15, 812, window.height),
        marginHorizontal: getSizeRelativeToReference(30, 375, window.width),
        marginBottom: getSizeRelativeToReference(10, 812, window.height),
      },
      clearButton: {
        marginTop: 0,
        backgroundColor: variables.errorText.color,
        borderColor: variables.errorText.color,
        borderRadius: 4,
      },
    },

    'shoutem.ginger.RetailerListModal': {
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      },
      contentContainer: {
        padding: getSizeRelativeToReference(15, 375, window.width),
        backgroundColor: variables.paperColor,
        borderRadius: 8,
        width: getSizeRelativeToReference(325, 375, window.width),
      },
      titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      licencesContainer: {
        flexDirection: 'row',
      },
      rowContainer: {
        width: getSizeRelativeToReference(295 / 2, 375, window.width),
      },
      title: {
        fontWeight: resolveFontWeight('500'),
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        letterSpacing: -0.165,
        fontSize: 13,
        lineHeight: 24,
        marginBottom: getSizeRelativeToReference(10, 812, window.height),
      },
      text: {
        letterSpacing: -0.165,
        fontSize: 13,
        lineHeight: 24,
        marginBottom: getSizeRelativeToReference(10, 812, window.height),
        flexShrink: 1,
      },
      closeIcon: {
        width: getSizeRelativeToReference(24, 375, window.width),
        height: getSizeRelativeToReference(24, 375, window.width),
        color: variables.title.color,
      },
    },

    'shoutem.ginger.ConfirmationModal': {
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      },
      contentContainer: {
        padding: getSizeRelativeToReference(15, 375, window.width),
        backgroundColor: variables.paperColor,
        borderRadius: 8,
        width: getSizeRelativeToReference(275, 375, window.width),
      },
      caption: {
        letterSpacing: 0.5,
        fontSize: 15,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: getSizeRelativeToReference(15, 375, window.width),
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      button: {
        flex: 1,
        flexDirection: 'row',
        minWidth: getSizeRelativeToReference(120, 375, window.width),
        height: getSizeRelativeToReference(44, 812, window.height),
        borderRadius: 4,
      },
      confirmButton: {
        flex: 1,
        flexDirection: 'row',
        minWidth: getSizeRelativeToReference(120, 375, window.width),
        marginLeft: getSizeRelativeToReference(5, 375, window.width),
        backgroundColor: variables.errorText.color,
        borderColor: variables.errorText.color,
      },
    },

    'shoutem.ginger.ForgotPasswordScreen': {
      emailInput: {
        borderRadius: 6,
      },
      label: {
        paddingLeft: 5,
        fontSize: 15,
        lineHeight: 18,
      },
      confirmButton: {
        marginBottom: Device.select({
          iPhoneX: IPHONE_X_HOME_INDICATOR_PADDING,
          iPhoneXR: IPHONE_X_HOME_INDICATOR_PADDING,
          default: variables.largeGutter,
        }),
        marginHorizontal: getSizeRelativeToReference(
          variables.mediumGutter,
          375,
          window.width,
        ),
      },
      headerTitle: {
        color: '#FFFFFF',
      },
      headerBackButton: {
        color: '#FFFFFF',
      },
      titleContainer: {
        marginHorizontal: getSizeRelativeToReference(
          variables.mediumGutter,
          375,
          window.width,
        ),
        marginVertical: getSizeRelativeToReference(
          variables.largeGutter,
          812,
          window.height,
        ),
      },
      title: {
        color: '#FFFFFF',
      },
      subtitle: {
        color: '#FFFFFF',
        marginTop: getSizeRelativeToReference(
          variables.mediumGutter,
          812,
          window.height,
        ),
      },
      inputContainer: {
        marginHorizontal: getSizeRelativeToReference(
          variables.mediumGutter,
          375,
          window.width,
        ),
      },
    },

    'shoutem.ginger.OrderInformation': {
      container: {
        borderRadius: 4,
        backgroundColor: variables.paperColor,
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
        paddingBottom: getSizeRelativeToReference(15, 375, window.width),
        marginTop: getSizeRelativeToReference(15, 375, window.width),
      },
      containerWithBorder: {
        borderWidth: 1,
        borderColor: 'rgba(136, 143, 161, 0.1)',
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: getSizeRelativeToReference(15, 375, window.width),
      },
      subRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: getSizeRelativeToReference(10, 375, window.width),
        paddingLeft: getSizeRelativeToReference(10, 375, window.width),
      },
      title: {
        fontSize: 15,
        lineHeight: 16,
        letterSpacing: 0.361,
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        fontWeight: resolveFontWeight('700'),
      },
      discountTitle: {
        fontFamily: resolveFontFamily(variables.text.fontFamily, '400'),
        fontWeight: resolveFontWeight('400'),
        textDecorationLine: 'line-through',
        opacity: 0.5,
        marginRight: getSizeRelativeToReference(10, 375, window.width),
      },
      caption: {
        fontSize: 15,
        lineHeight: 16,
        letterSpacing: 0.361,
      },
      subCaption: {
        fontSize: 12,
        lineHeight: 13,
        letterSpacing: 0.361,
      },
      error: {
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.36,
        color: variables.errorText.color,
        marginTop: getSizeRelativeToReference(10, 812, window.height),
      },
      separator: {
        height: 1,
        flexDirection: 'row',
        flex: 1,
        backgroundColor: variables.lineColor,
        marginTop: getSizeRelativeToReference(15, 375, window.width),
      },
    },

    'shoutem.ginger.CartFooterButtons': {
      gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: -getSizeRelativeToReference(15, 812, window.height),
        height: getSizeRelativeToReference(15, 812, window.height),
      },
      gradientColors: [
        changeColorAlpha(variables.backgroundColor, 0),
        variables.backgroundColor,
      ],
      container: {
        backgroundColor: variables.backgroundColor,
        paddingHorizontal: getSizeRelativeToReference(30, 375, window.width),
        paddingBottom: getSizeRelativeToReference(30, 375, window.width),
      },
      button: {
        height: getSizeRelativeToReference(44, 812, window.height),
        marginTop: getSizeRelativeToReference(10, 812, window.height),
        borderRadius: 4,
      },
    },

    'shoutem.ginger.RegisterScreen': {
      button: {
        margin: getSizeRelativeToReference(
          variables.mediumGutter,
          375,
          window.width,
        ),
      },
      existingAccountLabel: {
        color: '#FFFFFF',
      },
      headerTitle: {
        color: '#FFFFFF',
      },
      headerBackButton: {
        color: '#FFFFFF',
      },
      loginLabel: {
        color: '#FFFFFF',
        fontFamily: resolveFontFamily(variables.text.fontFamily, '600'),
        fontWeight: resolveFontWeight('600'),
      },
    },

    'shoutem.ginger.KeyboardAwareContainer': {
      container: {
        flex: 1,
      },
      contentContainer: {
        paddingHorizontal: variables.smallGutter,
        paddingTop: variables.smallGutter,
        paddingBottom: Device.select({
          iPhoneX: variables.largeGutter + IPHONE_X_HOME_INDICATOR_PADDING,
          iPhoneXR: variables.largeGutter + IPHONE_X_HOME_INDICATOR_PADDING,
          default: variables.mediumGutter,
        }),
      },
    },

    'shoutem.ginger.LoadingButton': {
      button: {
        height: getSizeRelativeToReference(44, 812, window.height),
        borderRadius: 4,
        backgroundColor: variables.primaryButtonBackgroundColor,
        borderColor: variables.primaryButtonBorderColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
      },
      animationFilters: [
        {
          keypath: '*',
          color: variables.primaryButtonText.color,
        },
      ],
      buttonContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonIcon: {
        width: getSizeRelativeToReference(24, 375, window.width),
        height: getSizeRelativeToReference(24, 375, window.width),
        color: variables.primaryButtonText.color,
        marginRight: getSizeRelativeToReference(5, 375, window.width),
      },
      buttonText: {
        fontFamily: resolveFontFamily(variables.text.fontFamily, '700'),
        fontWeight: resolveFontWeight('700'),
        lineHeight: 14,
        fontSize: 12,
        color: variables.primaryButtonText.color,
      },
      buttonBackgroundAnimation: (animatedValue, errorMode) => ({
        backgroundColor: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [
            variables.primaryButtonBackgroundColor,
            errorMode ? variables.errorText.color : 'rgb(25, 166, 143)',
          ],
        }),
        borderColor: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [
            variables.primaryButtonBorderColor,
            errorMode ? variables.errorText.color : 'rgb(25, 166, 143)',
          ],
        }),
      }),
    },

    'shoutem.ginger.LoginScreen': {
      divider: {
        height: 1,
        alignSelf: 'center',
        backgroundColor: variables.lineColor,
        marginHorizontal: variables.mediumGutter,
      },
      headerTitle: {
        color: '#FFFFFF',
      },
      headerBackButton: {
        color: '#FFFFFF',
      },
      skipButton: {
        color: '#FFFFFF',
      },
      orLabel: {
        color: '#FFFFFF',
        fontSize: 10,
      },
      forgotPasswordButton: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: resolveFontWeight('400'),
        margin: 0,
      },
      button: {
        height: getSizeRelativeToReference(44, 812, window.height),
        borderRadius: 4,
        margin: getSizeRelativeToReference(
          variables.mediumGutter,
          375,
          window.width,
        ),
      },
      buttonText: {
        lineHeight: 14,
        fontSize: 12,
      },
    },

    'shoutem.ginger.AgeVerificationScreen': {
      container: {
        flex: 1,
        marginBottom: getSizeRelativeToReference(
          variables.largeGutter,
          812,
          window.height,
        ),
      },
      mainContent: {
        marginHorizontal: getSizeRelativeToReference(
          variables.largeGutter,
          375,
          window.width,
        ),
      },
      title: {
        color: '#FFFFFF',
        marginTop: getSizeRelativeToReference(
          variables.largeGutter,
          812,
          window.height,
        ),
      },
      buttonContainer: {
        marginHorizontal: getSizeRelativeToReference(
          variables.largeGutter,
          375,
          window.width,
        ),
        marginVertical: getSizeRelativeToReference(
          variables.smallGutter,
          812,
          window.height,
        ),
      },
      confirmButton: {
        height: getSizeRelativeToReference(44, 812, window.height),
        borderRadius: 4,
        backgroundColor: variables.primaryButtonBackgroundColor,
        borderColor: variables.primaryButtonBorderColor,
        borderWidth: 1,
        marginVertical: getSizeRelativeToReference(
          variables.smallGutter,
          812,
          window.height,
        ),
      },
      exitButton: {
        height: getSizeRelativeToReference(44, 812, window.height),
        borderRadius: 4,
        backgroundColor: variables.secondaryButtonBackgroundColor,
        borderColor: variables.secondaryButtonBorderColor,
        borderWidth: 1,
      },
    },

    'shoutem.ginger.PhoneVerificationScreen': {
      verifyButton: {
        width: '100%',
        margin: getSizeRelativeToReference(
          variables.mediumGutter,
          375,
          window.width,
        ),
      },
      headerBackButton: {
        color: '#FFFFFF',
      },
      text: {
        color: '#FFFFFF',
      },
      boldText: {
        color: '#FFFFFF',
        fontFamily: resolveFontFamily(variables.text.fontFamily, '600'),
        fontWeight: resolveFontWeight('600'),
      },
      phoneIcon: {
        width: getSizeRelativeToReference(110, 812, window.height),
        height: getSizeRelativeToReference(110, 812, window.height),
        marginVertical: variables.largeGutter,
      },
    },

    'shoutem.ginger.CodeInput': {
      cell: {
        height: getSizeRelativeToReference(54, 812, window.height),
        width: getSizeRelativeToReference(40, 375, window.width),
        backgroundColor: variables.paperColor,
        borderRadius: 10,
        marginHorizontal: variables.smallGutter,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      },
      filledCell: {
        backgroundColor: changeColorAlpha(
          variables.primaryButtonBackgroundColor,
          0.2,
        ),
        color: variables.primaryButtonText,
      },
      focusedCell: {
        borderWidth: 1,
        borderColor: variables.primaryButtonBackgroundColor,
      },
      code: {
        fontSize: 28,
      },
      textInput: {
        position: 'relative',
        top: -getSizeRelativeToReference(54, 812, window.height),
        width: getSizeRelativeToReference(190, 375, window.width),
        opacity: 0,
        fontSize: 1,
      },
    },

    'shoutem.ginger.DatePicker': {
      container: {
        paddingVertical: variables.smallGutter,
      },
      label: {
        color: '#FFFFFF',
        paddingLeft: variables.smallGutter,
        paddingBottom: 3,
      },
      datePickerButton: {
        textContainer: {
          borderTopLeftRadius: 6,
          borderBottomLeftRadius: 6,
          backgroundColor: variables.paperColor,
          marginLeft: variables.smallGutter,
        },
        buttonContainer: {
          borderTopRightRadius: 6,
          borderBottomRightRadius: 6,
          marginRight: variables.smallGutter,
        },
      },
    },

    'shoutem.ginger.ImageBackgroundContainer': {
      container: {
        flex: 1,
        paddingTop: NAVIGATION_BAR_HEIGHT,
      },
    },

    'shoutem.ginger.ChangePhoneNumberScreen': {
      phoneIcon: {
        width: getSizeRelativeToReference(110, 812, window.height),
        height: getSizeRelativeToReference(110, 812, window.height),
        marginVertical: variables.largeGutter,
      },
      input: {
        width: '100%',
      },
      title: {
        color: '#FFFFFF',
      },
      button: {
        marginHorizontal: getSizeRelativeToReference(
          variables.mediumGutter,
          375,
          window.width,
        ),
        marginBottom: getSizeRelativeToReference(
          variables.mediumGutter,
          375,
          window.width,
        ),
      },
    },

    'shoutem.ginger.FormInput': {
      container: {
        paddingVertical: variables.smallGutter,
      },
      labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 5,
      },
      label: {
        color: '#FFFFFF',
        paddingLeft: variables.smallGutter,
        paddingBottom: 3,
      },
      textInput: {
        borderRadius: 6,
        errorText: {
          color: '#161616',
        },
      },
      iconContainer: {
        position: 'absolute',
        right: 0,
        top: variables.mediumGutter,
        paddingHorizontal: variables.smallGutter,
      },
      icon: {
        color: variables.primaryButtonBackgroundColor,
      },
    },

    'shoutem.ginger.FormInputButton': {
      container: {
        paddingVertical: variables.smallGutter,
        marginVertical: variables.smallGutter,
      },
      label: {
        color: '#FFFFFF',
        paddingLeft: variables.smallGutter,
        paddingBottom: 3,
      },
      inputContainer: {
        height: 50,
        borderRadius: 6,
        backgroundColor: variables.paperColor,
        justifyContent: 'center',
        paddingHorizontal: variables.mediumGutter,
        marginLeft: variables.smallGutter,
        marginRight: variables.smallGutter,
      },
    },

    'shoutem.ginger.AdditionalInformation': {
      row: {
        marginTop: getSizeRelativeToReference(15, 812, window.height),
        flexDirection: 'row',
      },
      rowImage: {
        marginRight: getSizeRelativeToReference(10, 375, window.width),
        width: getSizeRelativeToReference(16, 375, window.width),
        height: getSizeRelativeToReference(16, 375, window.width),
        color: variables.text.color,
      },
      rowText: {
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.5,
        flexShrink: 1,
      },
      links: {
        color: variables.links.color,
        textDecorationLine: 'underline',
      },
    },

    'shoutem.ginger.ProductListScreen': {
      scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: getSizeRelativeToReference(15, 375, window.width),
        paddingTop: getSizeRelativeToReference(10, 812, window.height),
        backgroundColor: variables.paperColor,
      },
    },

    'shoutem.ginger.CartScreen': {
      scrollContainer: {
        paddingHorizontal: getSizeRelativeToReference(10, 375, window.width),
        paddingBottom: getSizeRelativeToReference(25, 812, window.height),
      },
      promoCodeContainer: {
        marginTop: getSizeRelativeToReference(15, 812, window.height),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: getSizeRelativeToReference(10, 375, window.width),
      },
      promoCodeIcon: {
        height: getSizeRelativeToReference(24, 375, window.width),
        width: getSizeRelativeToReference(15, 375, window.width),
      },
      promoCodeText: {
        fontSize: 15,
        lineHeight: 18,
      },
    },

    'shoutem.ginger.PlaceholderView': {
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      image: {
        width: getSizeRelativeToReference(285, 375, window.width),
        height: getSizeRelativeToReference(285, 375, window.width),
      },
      button: {
        height: getSizeRelativeToReference(44, 812, window.height),
        marginHorizontal: getSizeRelativeToReference(30, 375, window.width),
        marginBottom: getSizeRelativeToReference(44, 812, window.height),
        borderRadius: 4,
      },
      buttonText: {
        fontFamily: resolveFontFamily(variables.text.fontFamily, '500'),
        fontWeight: resolveFontWeight('500'),
        fontSize: 13,
        lineHeight: 24,
      },
    },

    'shoutem.ginger.ChangePasswordScreen': {
      headerTitle: {
        color: '#FFFFFF',
      },
      headerBackButton: {
        color: '#FFFFFF',
      },
      titleContainer: {
        marginVertical: getSizeRelativeToReference(
          variables.mediumGutter,
          812,
          window.height,
        ),
        marginHorizontal: getSizeRelativeToReference(
          variables.mediumGutter,
          375,
          window.width,
        ),
      },
      inputContainer: {
        marginVertical: getSizeRelativeToReference(
          variables.smallGutter,
          812,
          window.height,
        ),
        marginHorizontal: getSizeRelativeToReference(
          variables.smallGutter,
          375,
          window.width,
        ),
      },
      buttonContainer: {
        marginTop: getSizeRelativeToReference(
          variables.smallGutter,
          812,
          window.height,
        ),
        marginBottom: Device.select({
          iPhoneX: IPHONE_X_HOME_INDICATOR_PADDING,
          iPhoneXR: IPHONE_X_HOME_INDICATOR_PADDING,
          default: variables.largeGutter,
        }),
        marginHorizontal: getSizeRelativeToReference(
          variables.mediumGutter,
          375,
          window.width,
        ),
      },
      text: {
        color: '#FFFFFF',
      },
    },

    'shoutem.ginger.AgeVerificationSubtitle': {
      container: {
        color: variables.onboardingDescriptionTextColor,
        marginTop: getSizeRelativeToReference(15, 812, window.height),
      },
      text: {
        color: variables.onboardingDescriptionTextColor,
      },
      bold: {
        color: variables.onboardingDescriptionTextColor,
        fontFamily: resolveFontFamily(
          variables.text.fontFamily,
          '700',
          variables.text.fontStyle,
        ),
        fontWeight: resolveFontWeight('700'),
      },
    },

    'shoutem.ginger.EditProfileScreen': {
      container: {
        marginHorizontal: getSizeRelativeToReference(
          variables.smallGutter,
          375,
          window.width,
        ),
      },
      formInputLabelColor: variables.text.color,
      button: {
        marginHorizontal: getSizeRelativeToReference(
          variables.mediumGutter,
          375,
          window.width,
        ),
        marginBottom: getSizeRelativeToReference(
          variables.largeGutter,
          812,
          window.height,
        ),
      },
      actionSheet: {
        container: {
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          elevation: 10,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        },
      },
    },

    'shoutem.ginger.MyProfileScreen': {
      container: {
        marginHorizontal: getSizeRelativeToReference(
          variables.mediumGutter,
          375,
          window.width,
        ),
        marginBottom: getSizeRelativeToReference(
          variables.largeGutter,
          812,
          window.height,
        ),
      },
      mainContainer: {
        marginBottom: getSizeRelativeToReference(
          variables.mediumGutter,
          812,
          window.height,
        ),
      },
      headerButton: {
        color: variables.text.color,
      },
      logoutButton: {
        height: getSizeRelativeToReference(44, 812, window.height),
        borderRadius: 4,
        backgroundColor: variables.primaryButtonBackgroundColor,
        borderColor: variables.primaryButtonBorderColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
      },
    },

    'shoutem.ginger.ProfileTextItem': {
      name: {
        fontSize: 16,
        lineHeight: calculateLineHeight(16),
      },
      nick: {
        fontSize: 13,
        lineHeight: calculateLineHeight(13),
        opacity: 0.6,
      },
      labelContainer: {
        width: '30%',
      },
      label: {
        fontSize: variables.text.fontSize,
        paddingHorizontal: variables.smallGutter,
        paddingVertical: variables.smallGutter,
      },
      divider: {
        borderBottomWidth: 1,
      },
    },

    'shoutem.ginger.ProfileImage': {
      placeholder: {
        color: variables.paperColor,
      },
      image: {
        width: getSizeRelativeToReference(145, 812, window.height),
        height: getSizeRelativeToReference(145, 812, window.height),
        borderRadius: getSizeRelativeToReference(145 / 2, 812, window.height),
        borderWidth: 0,
        backgroundColor: inverseColorBrightnessForAmount(
          variables.paperColor,
          10,
        ),
      },
    },
  });
};
