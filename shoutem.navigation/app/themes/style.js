import { Platform, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { changeColorAlpha, INCLUDE } from '@shoutem/theme';
import {
  calculateLineHeight,
  createScopedResolver,
  Device,
  dimensionRelativeToIphone,
  resolveFontFamily,
  resolveFontStyle,
  resolveFontWeight,
} from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  mainNavigation: {
    '.selected': {
      // TouchableOpacity component
      // "Item" represent generic name for navigation action components
      // TabBarItem -> Button; Drawer -> Row; IconGrid -> Cell
      item: {
        backgroundColor: resolveVariable('mainNavSelectedItemBackground'),
      },
      icon: {
        tintColor:
          resolveVariable('mainNavSelectedItemIconColor') ||
          resolveVariable('mainNavSelectedItemColor'),
      },
      text: {
        color:
          resolveVariable('mainNavSelectedItemTextColor') ||
          resolveVariable('mainNavSelectedItemColor'),
      },
    },

    item: {
      backgroundColor: resolveVariable('mainNavItemBackground'),
    },
    icon: {
      tintColor:
        resolveVariable('mainNavItemIconColor') ||
        resolveVariable('mainNavItemColor'),
    },
    text: {
      color:
        resolveVariable('mainNavItemTextColor') ||
        resolveVariable('mainNavItemColor'),
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
      backgroundColor: resolveVariable('subNavItemBackground'),
    },

    icon: {
      tintColor: resolveVariable('subNavItemColor'),
    },

    text: {
      color: resolveVariable('subNavItemColor'),
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

  'shoutem.navigation.NavigationBar': {
    title: {
      color: resolveVariable('navBarText.color'),
      lineHeight: calculateLineHeight(resolveVariable('navBarText.fontSize')),
      ...resolveVariable('navBarText'),
      fontFamily: resolveFontFamily(
        resolveVariable('navBarText.fontFamily'),
        resolveVariable('navBarText.fontWeight'),
        resolveVariable('navBarText.fontStyle'),
      ),
      fontWeight: resolveFontWeight(resolveVariable('navBarText.fontWeight')),
      fontStyle: resolveFontStyle(resolveVariable('navBarText.fontStyle')),
    },
    icon: {
      color: resolveVariable('navBarIconsColor'),
    },
    statusBar: {
      backgroundColor: resolveVariable('statusBarColor'),
      statusBarStyle: resolveVariable('statusBarStyle'),
    },
    container: {
      backgroundColor: resolveVariable('navBarBackground'),
      borderBottomColor: resolveVariable('navBarBorderColor'),
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    leftContainer: {
      paddingLeft: resolveVariable('mediumGutter'),
    },
    rightContainer: {
      paddingRight: resolveVariable('mediumGutter'),
    },

    '.clear': {
      container: {
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
      },
    },

    '.featured': {
      title: {
        color: resolveVariable('featuredNavBarTitleColor'),
      },
      icon: {
        color: resolveVariable('featuredNavBarIconsColor'),
      },

      container: {
        backgroundColor: resolveVariable('featuredColor'),
        borderBottomWidth: 0,
        shadowOpacity: 0,
      },
    },

    '.no-border': {
      container: {
        borderBottomWidth: 0,
        shadowOpacity: 0,
      },
    },

    boxingAnimation(driver) {
      return {
        container: {
          borderBottomColor: driver.interpolate({
            // Animate to approx title top offset
            inputRange: [0, 45],
            outputRange: ['transparent', resolveVariable('navBarBorderColor')],
            extrapolate: 'clamp',
          }),
          borderBottomWidth: 1,
        },
        title: {
          opacity: driver.interpolate({
            inputRange: [250, 300],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        },
      };
    },

    solidifyAnimation(driver) {
      return {
        icon: {
          opacity: driver.interpolate({
            inputRange: [250, 300],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        },
        title: {
          color: driver.interpolate({
            inputRange: [250, 300],
            outputRange: ['transparent', resolveVariable('navBarText.color')],
            extrapolate: 'clamp',
          }),
        },
        container: {
          backgroundColor: driver.interpolate({
            inputRange: [250, 300],
            outputRange: ['transparent', resolveVariable('navBarBackground')],
            extrapolate: 'clamp',
          }),
          borderBottomColor: driver.interpolate({
            inputRange: [250, 300],
            outputRange: ['transparent', resolveVariable('navBarBorderColor')],
            extrapolate: 'clamp',
          }),
          opacity: driver.interpolate({
            inputRange: [250, 300],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        },
      };
    },

    fadeAnimation(driver) {
      return {
        container: {
          gradient: {
            colors: ['transparent', 'rgba(0, 0, 0, 0.5)', 'transparent'],
            locations: [0.0, 0.25, 1.0],
            opacity: driver.interpolate({
              inputRange: [250, 300],
              outputRange: [1, 0],
            }),
          },
        },
      };
    },
  },

  'shoutem.navigation.TabBar': {
    activeTintColor:
      resolveVariable('mainNavSelectedItemIconColor') ||
      resolveVariable('mainNavSelectedItemColor'),
    inactiveTintColor:
      resolveVariable('mainNavItemIconColor') ||
      resolveVariable('mainNavItemColor'),
    activeBackgroundColor: resolveVariable('mainNavSelectedItemBackground'),
    inactiveBackgroundColor: resolveVariable('mainNavItemBackground'),
    container: {
      borderTopWidth: 1,
      borderTopColor: resolveVariable('mainNavBorderColor'),
      backgroundColor: resolveVariable('mainNavBackground'),
      minHeight: resolveVariable('sizes.tabBarItemHeight'),
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
        fontSize: resolveVariable('tabbarItemText.fontSize'),
      },
    },
    '.icon-only': {
      item: {
        justifyContent: 'center',
      },
    },
    '.text-only': {
      text: {
        fontSize: resolveVariable('tabbarItemText.fontSize'),
      },
      item: {
        justifyContent: 'center',
      },
    },
    '.selected': {
      item: Device.select({
        iPhoneX: {
          borderTopWidth: 2,
          borderColor: resolveVariable('mainNavSelectedItemBorderColor'),
        },
        iPhoneXR: {
          borderTopWidth: 2,
          borderColor: resolveVariable('mainNavSelectedItemBorderColor'),
        },
        default: {
          borderBottomWidth: 2,
          borderColor: resolveVariable('mainNavSelectedItemBorderColor'),
        },
      }),
    },
    item: {
      height: resolveVariable('sizes.tabBarItemHeight'),
      marginBottom: Device.select({
        iPhoneX: resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        iPhoneXR: resolveVariable('sizes.iphone.X.homeIndicatorPadding'),
        default: 0,
      }),
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 0,
      borderRadius: 0,
      paddingHorizontal: resolveVariable('smallGutter'),
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
                  resolveVariable('mainNavItemIconColor') ||
                    resolveVariable('mainNavItemColor'),
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
      flex: -1,
      margin: 0,
      fontFamily: resolveFontFamily(
        resolveVariable('tabbarItemText.fontFamily'),
        resolveVariable('tabbarItemText.fontWeight'),
        resolveVariable('tabbarItemText.fontStyle'),
      ),
      color: resolveVariable('tabbarItemText.color'),
      fontStyle: resolveFontStyle(resolveVariable('tabbarItemText.fontStyle')),
      fontWeight: resolveFontWeight(
        resolveVariable('tabbarItemText.fontWeight'),
      ),
    },
  },
  'shoutem.navigation.Drawer': {
    menu: {
      backgroundColor: resolveVariable('mainNavBackground'),
      width: resolveVariable('sizes.window.width') * 0.8,
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
      marginBottom: resolveVariable('mediumGutter'),
      padding: 0,
      borderWidth: 0,
      borderRadius: 0,
      alignItems: 'center',
      justifyContent: 'flex-start',
      alignSelf: 'stretch',
      flexDirection: 'row',
      paddingLeft: resolveVariable('largeGutter'),
      paddingRight: resolveVariable('smallGutter') * 2,
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
                  resolveVariable('mainNavItemIconColor') ||
                    resolveVariable('mainNavItemColor'),
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
      marginRight: resolveVariable('largeGutter'),
    },
    text: {
      justifyContent: 'flex-start',
      margin: 0,
      fontFamily: resolveFontFamily(
        resolveVariable('drawerItemText.fontFamily'),
        resolveVariable('drawerItemText.fontWeight'),
        resolveVariable('drawerItemText.fontStyle'),
      ),
      color: resolveVariable('drawerItemText.color'),
      fontStyle: resolveFontStyle(resolveVariable('drawerItemText.fontStyle')),
      fontWeight: resolveFontWeight(
        resolveVariable('drawerItemText.fontWeight'),
      ),
      fontSize: resolveVariable('drawerItemText.fontSize'),
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
          paddingTop: resolveVariable('gridItemVerticalGutter'),
        },
        row: {
          paddingRight: resolveVariable('gridItemHorizontalGutter'),
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
          paddingTop: resolveVariable('gridItemVerticalGutter'),
        },
        row: {
          paddingRight: resolveVariable('gridItemHorizontalGutter'),
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
      paddingTop: resolveVariable('gridItemVerticalGutter'),
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
      paddingRight: resolveVariable('gridItemHorizontalGutter'), // Used to calculate row width
      flexDirection: 'row',
    },
    item: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      width: 72, // Used to calculate row width
      marginLeft: resolveVariable('gridItemHorizontalGutter'), // Used to calculate row width
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
        borderColor: resolveVariable('mainNavBorderColor'),
      },
      chevron: {
        color: changeColorAlpha(
          resolveVariable('mainNavItemIconColor') ||
            resolveVariable('mainNavItemColor'),
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
        paddingRight: resolveVariable('mediumGutter'),
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
      borderColor: resolveVariable('subNavListBorderColor'),
      height: 65,
    },
    iconAndTextContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
      paddingLeft: resolveVariable('mediumGutter'),
    },
    icon: {
      flex: 0,
    },
    text: {
      marginLeft: resolveVariable('mediumGutter'),
    },
    chevronContainer: {
      marginRight: 7,
      height: 24,
      width: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chevron: {
      color: changeColorAlpha(resolveVariable('subNavItemColor'), 0.5),
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
      backgroundColor: resolveVariable('subNavItemBackground'),
    },
    text: {
      flex: 0,
      width: null,
      marginLeft: resolveVariable('smallGutter'),
      color: resolveVariable('subNavItemColor'),
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
      backgroundColor: resolveVariable('subNavItemBackground'),
    },
    text: {
      flex: 0,
      width: null,
      marginLeft: resolveVariable('mediumGutter'),
      color: resolveVariable('subNavItemColor'),
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
});
