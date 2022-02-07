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
      footer: {
        backgroundColor: variables.paperColor,
      },
      textInput: {
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
    },

    'shoutem.social.SearchScreen': {
      contentContainerStyle: {
        flexGrow: 1,
      },
    },
    'shoutem.social.StatusDetailsScreen': {
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
        margin: 15,
        maxHeight: 100,
      },
    },
    'shoutem.social.StatusView': {
      menuButton: {
        width: 24,
        height: 24,
        color: '#C4C4C4',
        paddingVertical: 10,
        paddingLeft: 10,
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
      textContainerTop: {
        justifyContent: 'flex-start',
        paddingTop: NAVIGATION_BAR_HEIGHT,
      },
      textContainerMiddle: {
        justifyContent: 'center',
      },
      textContainerBottom: {
        justifyContent: 'flex-end',
        paddingBottom: TAB_BAR_HEIGHT,
      },
      pageIndicators: {
        container: {
          paddingVertical: Device.select({
            iPhoneX: 10 + IPHONE_X_HOME_INDICATOR_PADDING,
            iPhoneXR: 10 + IPHONE_X_HOME_INDICATOR_PADDING,
            default: 20,
          }),
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

    'shoutem.news.FeaturedGrid122FullRowView': {
      container: {
        borderColor: 'rgba(68,79,108,0.2)',
        borderRadius: 4,
        borderWidth: 1,
        marginTop: 8,
        marginHorizontal: 8,
        overflow: 'hidden',
      },
      imageContainer: {
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        height: dimensionRelativeToIphone(224),
        overflow: 'hidden',
      },
      textContainer: {
        backgroundColor: variables.newsGrid122ItemBackgroundColor,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
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

    'shoutem.news.FeaturedGrid122FeaturedRowView': {
      [INCLUDE]: ['shoutem.news.FeaturedGrid122FullRowView'],
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
        // shoutem.news.FeaturedGrid122FullRowView.container.marginHorizontal = 8
        height: window.width - 16,
      },
      textContainer: {
        height: dimensionRelativeToIphone(110),
      },
    },

    'shoutem.news.FeaturedGrid122HalfRowView': {
      [INCLUDE]: ['shoutem.news.FeaturedGrid122FullRowView'],
      container: {
        marginHorizontal: 4,
      },
      imageContainer: { height: dimensionRelativeToIphone(110) },
      textContainer: {
        height: dimensionRelativeToIphone(108),
      },
    },

    'shoutem.news.ArticleDetailsScreen': {
      outerPadding: 10,
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
  });
};
