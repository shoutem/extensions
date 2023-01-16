import { Platform, StyleSheet } from 'react-native';
import { changeColorAlpha } from '@shoutem/theme';
import {
  createScopedResolver,
  resolveFontFamily,
  resolveFontWeight,
  responsiveHeight,
  responsiveWidth,
} from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

const dropShadowStyle = {
  shadowColor: resolveVariable('shadowColor'),
  shadowOffset: {
    width: 2,
    height: 4,
  },
  shadowOpacity: 0.8,
  shadowRadius: 10,
  elevation: 4,
};

export default () => ({
  [`${ext('FeaturedItem')}`]: {
    container: {
      borderRadius: 4,
      resizeMode: 'cover',
      overflow: 'hidden',
      justifyContent: 'flex-end',
      marginHorizontal: responsiveWidth(8),
      marginVertical: responsiveHeight(resolveVariable('smallGutter')),
      width: responsiveWidth(360),
      height: responsiveHeight(240),
      ...dropShadowStyle,
    },
    contentContainer: {
      flexDirection: 'row',
      paddingHorizontal: responsiveWidth(resolveVariable('mediumGutter')),
      paddingBottom: responsiveHeight(resolveVariable('mediumGutter')),
    },
    priceContainer: {
      flex: 1,
    },
    gradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundGradient: {
        colors: [
          'rgba(0, 0, 0, 0)',
          'rgba(0, 0, 0, 0.4)',
          'rgba(0, 0, 0, 0.75)',
        ],
        locations: [0.5, 0.85, 1],
      },
    },
    buyButton: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderRadius: 0,
      paddingLeft: 0,
      paddingRight: 0,
      alignItems: 'center',
    },
    buyIcon: {
      color: 'white',
      size: 20,
      marginRight: 0,
    },
    buyIconSize: responsiveWidth(25),
  },
  [`${ext('ProductPrice')}`]: {
    container: {
      flexDirection: 'row',
      overflow: 'hidden',
      alignItems: 'center',
      width: responsiveWidth(160),
      marginRight: responsiveWidth(resolveVariable('smallGutter')),
      paddingTop: responsiveHeight(resolveVariable('smallGutter')),
    },
    wideContainer: { flex: 1 },
    price: {
      color: resolveVariable('text.color'),
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '600'),
      fontWeight: resolveFontWeight('600'),
      fontSize: 16,
      marginRight: responsiveWidth(resolveVariable('smallGutter')),
    },
    featuredPrice: { color: '#FFFFFF' },
    discountedPrice: {
      color: '#9ea4b5',
      fontSize: 13,
      alignSelf: 'center',
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
    },
    secondaryPrice: {
      color: '#FFFFFF',
      opacity: 0.6,
      fontSize: 12,
      alignSelf: 'center',
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
      marginBottom: responsiveHeight(resolveVariable('smallGutter')),
    },
  },
  [`${ext('GridItem')}`]: {
    container: {
      borderRadius: 4,
      backgroundColor: resolveVariable('paperColor'),
      width: responsiveWidth(175),
      marginLeft: responsiveWidth(8),
      marginVertical: responsiveHeight(5),
      ...dropShadowStyle,
    },
    imageContainer: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      overflow: 'hidden',
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
    },
    image: {
      width: responsiveWidth(175),
      height: responsiveHeight(150),
    },
    tallImage: {
      width: responsiveWidth(175),
      height: responsiveHeight(205),
    },
    fixedImage: {
      width: responsiveWidth(175),
      height: responsiveHeight(85),
    },
    fixedContainer: {
      height: responsiveHeight(90),
    },
    textContainer: {
      paddingHorizontal: responsiveWidth(10),
      paddingVertical: responsiveHeight(8),
    },
    priceContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
  },
  [`${ext('ProductTitle')}`]: {
    title: {
      fontSize: 16,
      color: resolveVariable('text.color'),
      paddingBottom: responsiveHeight(resolveVariable('smallGutter')),
    },
    featuredTitle: {
      fontSize: 17,
      color: '#FFFFFF',
    },
  },
  [`${ext('ListItem')}`]: {
    container: {
      flexDirection: 'row',
      borderRadius: 4,
      marginHorizontal: responsiveWidth(8),
      marginVertical: responsiveHeight(resolveVariable('smallGutter')),
      ...dropShadowStyle,
    },
    contentContainer: {
      height: responsiveHeight(65),
      justifyContent: 'space-between',
    },
    image: {
      width: responsiveWidth(65),
      height: responsiveHeight(65),
    },
  },
  [`${ext('AddToCartButton')}`]: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderRadius: 0,
      paddingLeft: 0,
      paddingRight: 0,
      padding: 10,
      alignItems: 'center',
    },
    icon: {
      size: 20,
      color: resolveVariable('text.color'),
      marginRight: 0,
    },
    featuredIcon: {
      color: 'white',
    },
    iconSize: responsiveWidth(25),
    title: {
      marginLeft: responsiveWidth(12),
      color: resolveVariable('text.color'),
    },
  },
  [`${ext('CartItem')}`]: {
    mainContainer: {
      backgroundColor: resolveVariable('paperColor'),
      borderRadius: 4,
      marginHorizontal: responsiveWidth(resolveVariable('mediumGutter')),
      marginTop: responsiveHeight(10),
      padding: 0,
      ...dropShadowStyle,
    },
    image: {
      borderBottomLeftRadius: 4,
      borderTopLeftRadius: 4,
      marginRight: 0,
      height: 95,
      width: 95,
    },
    infoContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: resolveVariable('mediumGutter'),
    },
    nameContainer: {
      flex: 2,
    },
    priceContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
    oldPrice: {
      textDecorationLine: 'line-through',
    },
    price: {
      fontWeight: resolveFontWeight('500'),
    },
  },
  [`${ext('MediumListItem')}`]: {
    container: {
      flexDirection: 'row',
      borderRadius: 4,
      height: responsiveHeight(140),
      paddingLeft: 0,
      marginHorizontal: responsiveWidth(8),
      marginVertical: responsiveHeight(resolveVariable('smallGutter')),
    },
    contentContainer: {
      flexDirection: 'row',
      borderRadius: 4,
      backgroundColor: resolveVariable('paperColor'),
      position: 'absolute',
      left: responsiveWidth(130),
      paddingHorizontal: responsiveWidth(resolveVariable('mediumGutter')),
      paddingVertical: responsiveHeight(resolveVariable('mediumGutter')),
      height: responsiveHeight(110),
      width: responsiveWidth(220),
      ...dropShadowStyle,
    },
    image: {
      borderRadius: 4,
      marginRight: 0,
      width: responsiveWidth(220),
      height: responsiveHeight(140),
    },
    productContainer: {
      flex: 1,
      justifyContent: 'space-around',
    },
    cartIcon: {
      alignSelf: 'center',
    },
  },
  [`${ext('LargeListItem')}`]: {
    container: {
      borderRadius: 4,
      resizeMode: 'cover',
      overflow: 'hidden',
      justifyContent: 'flex-end',
      marginHorizontal: responsiveWidth(8),
      marginVertical: responsiveHeight(resolveVariable('smallGutter')),
      width: responsiveWidth(360),
    },
    image: {
      width: responsiveWidth(360),
      height: responsiveHeight(240),
    },
    contentContainer: {
      flexDirection: 'row',
      backgroundColor: resolveVariable('paperColor'),
      paddingHorizontal: responsiveWidth(16),
    },
    priceContainer: {
      flex: 1,
      paddingVertical: responsiveHeight(16),
    },
  },
  [`${ext('TileItem')}`]: {
    container: {
      resizeMode: 'cover',
      justifyContent: 'center',
      width: responsiveWidth(375),
      height: responsiveHeight(200),
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    contentContainer: {
      marginTop: responsiveHeight(resolveVariable('mediumGutter')),
    },
    title: {
      title: { textAlign: 'center' },
    },
    priceContainer: {
      container: {
        alignSelf: 'center',
        marginRight: 0,
        flexDirection: 'column',
      },
    },
    buyButton: {
      container: {
        marginTop: responsiveHeight(20),
        backgroundColor: 'white',
        width: responsiveWidth(155),
        height: responsiveHeight(40),
        alignSelf: 'center',
        borderRadius: 2,
      },
    },
  },
  [`${ext('SelectAddressScreen')}`]: {
    closeIconContainer: {
      position: 'absolute',
      right: responsiveWidth(16),
      top: responsiveHeight(12),
      justifyContent: 'center',
      zIndex: 2,
      elevation: 2,
    },
    closeIcon: {
      color: resolveVariable('text.color'),
      width: responsiveWidth(15),
      height: responsiveHeight(15),
    },
    autocompleteStyles: {
      textInput: {
        fontSize: 13,
        lineHeight: 16,
        justifyContent: 'center',
        paddingLeft: responsiveWidth(16),
        // Take clear button into account
        paddingRight: responsiveWidth(32),
        color: resolveVariable('text.color'),
      },
      description: {
        color: resolveVariable('text.color'),
      },
    },
    placeholderText: {
      placeholderTextColor: changeColorAlpha(
        resolveVariable('text.color'),
        0.6,
      ),
    },
  },
  [`${ext('UpdateItemScreen')}`]: {
    itemDetailsContainer: {
      flexDirection: 'row',
      backgroundColor: resolveVariable('paperColor'),
      alignItems: 'flex-start',
      padding: resolveVariable('mediumGutter'),
    },
    image: {
      height: responsiveHeight(95),
      width: responsiveWidth(95),
      borderRadius: 2,
    },
    descriptionContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: resolveVariable('mediumGutter'),
    },
    oldPrice: {
      textDecorationLine: 'line-through',
    },
    price: {
      boldTextStyle: {
        fontWeight: resolveFontWeight('500'),
      },
    },
    footer: {
      backgroundColor: resolveVariable('paperColor'),
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: -3,
      },
      shadowColor: resolveVariable('shadowColor'),
      shadowOpacity: 0.8,
      elevation: 4,
    },
    screen: {
      backgroundColor: resolveVariable('paperColor'),
    },
    optionsContainer: {
      backgroundColor: resolveVariable('paperColor'),
      marginTop: resolveVariable('mediumGutter'),
    },
    optionRow: {
      alignItems: 'center',
      backgroundColor: resolveVariable('paperColor'),
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: resolveVariable('mediumGutter'),
      paddingHorizontal: resolveVariable('mediumGutter'),
    },
    dropDownMenu: {
      horizontalContainer: {
        alignItems: 'flex-end',
        borderColor: resolveVariable('shadowColor'),
        borderWidth: 0,
        height: responsiveHeight(40),
        width: responsiveWidth(184),
      },
      selectedOption: {
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4,
        borderColor: 'rgba(136, 143, 161, 0.1)',
        height: responsiveHeight(38),
      },
      icon: {
        borderBottomRightRadius: 4,
        borderTopRightRadius: 4,
        borderWidth: 0,
        elevation: 4,
        shadowColor: resolveVariable('shadowColor'),
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        height: responsiveHeight(40),
        width: responsiveWidth(40),
      },
    },
    quantityContainer: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: resolveVariable('mediumGutter'),
      paddingHorizontal: resolveVariable('mediumGutter'),
    },
    numberInput: {
      button: {
        elevation: 4,
        shadowColor: resolveVariable('shadowColor'),
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        height: responsiveHeight(40),
        width: responsiveWidth(40),
        padding: 8,
      },
      buttonLeft: {
        borderBottomLeftRadius: 4,
        bordertopLeftRadius: 4,
      },
      buttonRight: {
        borderBottomRightRadius: 4,
        borderTopRightRadius: 4,
      },
      container: {
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      icon: {
        marginRight: 0,
      },
      input: {
        height: responsiveHeight(38),
        paddingVertical: responsiveHeight(10),
        textAlign: 'center',
        width: responsiveWidth(94),
      },
      inputContainer: {
        borderColor: 'rgba(136, 143, 161, 0.1)',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
      },
    },
  },
  [`${ext('CartScreen')}`]: {
    screen: {
      backgroundColor: resolveVariable('paperColor'),
    },
    contentContainer: {
      flex: 1,
    },
    list: {
      listContent: {
        backgroundColor: resolveVariable('paperColor'),
        paddingBottom: responsiveHeight(resolveVariable('mediumGutter')),
      },
    },
  },
  [`${ext('CartFooter')}`]: {
    mainContainer: {
      backgroundColor: resolveVariable('paperColor'),
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: -3,
      },
      shadowColor: resolveVariable('shadowColor'),
      shadowOpacity: 0.8,
      width: resolveVariable('sizes.window.width'),
      paddingHorizontal: responsiveWidth(resolveVariable('mediumGutter')),
    },
    priceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: responsiveHeight(resolveVariable('mediumGutter')),
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingTop: responsiveHeight(resolveVariable('mediumGutter')),
      paddingBottom: responsiveHeight(resolveVariable('largeGutter')),
    },
    buttonText: {
      fontWeight: resolveFontWeight('500'),
    },
  },
  [`${ext('OrderListItem')}`]: {
    container: {
      borderRadius: 4,
      height: responsiveHeight(95),
      paddingLeft: 0,
      marginVertical: responsiveHeight(resolveVariable('smallGutter')),
      ...dropShadowStyle,
      ...(Platform.OS === 'android' && {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: resolveVariable('shadowColor'),
      }),
    },
    image: {
      width: responsiveWidth(90),
      height: responsiveWidth(90),
    },
    mainContainer: { justifyContent: 'space-between', flexDirection: 'row' },
    orderContainer: {
      flex: 1,
    },
    price: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: resolveFontWeight('600'),
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '600'),
    },
    orderStatus: {
      fontSize: 14,
      lineHeight: 20,
      color: '#888FA1',
    },
    paidStatus: {
      color: '#88C242',
    },
    iconSize: 20,
    icon: {
      width: responsiveWidth(20),
      alignSelf: 'center',
    },
  },
  [`${ext('OrderHistoryScreen')}`]: {
    screen: {
      backgroundColor: resolveVariable('paperColor'),
    },
    container: {
      paddingHorizontal: responsiveWidth(resolveVariable('mediumGutter')),
    },
    spinner: {
      zIndex: 10,
      ...StyleSheet.absoluteFill,
      color: resolveVariable('primaryButtonText.color'),
    },
  },
  [`${ext('OrderDetailsScreen')}`]: {
    screen: {
      paddingTop: responsiveHeight(resolveVariable('mediumGutter')),
      backgroundColor: resolveVariable('paperColor'),
    },
    paddedContainer: {
      paddingHorizontal: responsiveWidth(resolveVariable('mediumGutter')),
    },
  },
  [`${ext('OrderHeader')}`]: {
    orderDetails: {
      fontSize: 15,
      fontWeight: resolveFontWeight('500'),
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '500'),
      color: resolveVariable('text.color'),
      opacity: 0.8,
      marginLeft: resolveVariable('smallGutter'),
    },
    value: {
      color: resolveVariable('text.color'),
      fontSize: 15,
      fontWeight: resolveFontWeight('500'),
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '500'),
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: responsiveWidth(resolveVariable('smallGutter')),
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconSize: 24,
    icon: {
      color: 'transparent',
    },
    secondaryText: {
      color: '#88C242',
    },
  },
  [`${ext('OrderItems')}`]: {
    container: {
      marginVertical: responsiveHeight(resolveVariable('mediumGutter')),
    },
    title: {
      fontSize: 16,
      fontWeight: resolveFontWeight('600'),
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '600'),
      marginTop: responsiveHeight(resolveVariable('largeGutter')),
    },
  },
  [`${ext('OrderItem')}`]: {
    itemContainer: {
      borderRadius: 4,
      height: responsiveHeight(65),
      marginVertical: resolveVariable('mediumGutter'),
      paddingLeft: 0,
    },
    image: {
      width: responsiveWidth(65),
      height: responsiveWidth(65),
    },
    mainContainer: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    orderContainer: {
      flex: 1,
      height: responsiveHeight(60),
    },
    orderTitle: {
      fontSize: 16,
      lineHeight: 22,
    },
    variantTitle: {
      fontSize: 12,
      lineHeight: 15,
    },
    price: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: resolveFontWeight('600'),
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '600'),
    },
  },
  [`${ext('OrderTotal')}`]: {
    container: {
      borderWidth: 1,
      borderColor: 'rgba(136, 143, 161, 0.1)',
      borderRadius: 4,
      paddingVertical: resolveVariable('smallGutter'),
      paddingHorizontal: resolveVariable('mediumGutter'),
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: resolveVariable('smallGutter'),
    },
    bold: {
      fontWeight: resolveFontWeight('600'),
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '600'),
    },
    divider: {
      height: 1,
      backgroundColor: 'rgba(189, 192, 203, 0.5)',
      marginVertical: resolveVariable('smallGutter'),
    },
  },
  [`${ext('DeliveryAddress')}`]: {
    container: {
      marginTop: responsiveHeight(resolveVariable('largeGutter')),
    },
    title: {
      fontWeight: resolveFontWeight('600'),
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '600'),
      paddingHorizontal: responsiveWidth(resolveVariable('mediumGutter')),
    },
    map: {
      width: resolveVariable('sizes.window.width'),
      height: responsiveHeight(160),
      marginTop: responsiveHeight(resolveVariable('mediumGutter')),
    },
    mapTextContainer: {
      backgroundColor: resolveVariable('imageOverlayColor'),
      justifyContent: 'flex-end',
      alignItems: 'center',
      flex: 1,
    },
    mapText: {
      textAlign: 'center',
      flexShrink: 1,
      color: resolveVariable('paperColor'),
      marginBottom: responsiveHeight(24),
      fontSize: 12,
      lineHeight: 14,
    },
  },
  [`${ext('CheckoutScreen')}`]: {
    container: {
      flex: 1,
    },
  },
  [`${ext('QuickAddModal')}`]: {
    container: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      right: 0,
      top: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    contentContainer: {
      position: 'absolute',
      left: 0,
      top: '100%',
      right: 0,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      backgroundColor: resolveVariable('quickBuyBackgroundColor'),
      paddingHorizontal: responsiveWidth(15),
      paddingTop: responsiveWidth(15),
      paddingBottom: responsiveWidth(30),
    },
    confirmButton: {
      marginTop: responsiveHeight(18),
      height: responsiveHeight(44),
      borderRadius: 4,
      backgroundColor: resolveVariable(
        'quickBuyAddToCartButtonBackgroundColor',
      ),
      borderColor: resolveVariable('quickBuyAddToCartButtonBackgroundColor'),
    },
    confirmButtonText: {
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '500'),
      fontWeight: resolveFontWeight('500'),
      fontSize: 13,
      lineHeight: 24,
      color: resolveVariable('quickBuyAddToCartButtonTextColor'),
    },
  },
  [`${ext('QuickAddTitle')}`]: {
    container: {
      flexDirection: 'row',
      padding: responsiveWidth(8),
    },
    icon: {
      width: responsiveWidth(24),
      height: responsiveWidth(24),
      color: resolveVariable('quickBuyTitleColor'),
    },
    title: {
      position: 'absolute',
      left: responsiveWidth(8 + 24 + 8),
      bottom: responsiveWidth(8),
      right: responsiveWidth(8 + 24 + 8),
      top: responsiveWidth(8),
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '500'),
      fontWeight: resolveFontWeight('500'),
      fontSize: 20,
      lineHeight: 24,
      textAlign: 'center',
      color: resolveVariable('quickBuyTitleColor'),
    },
  },
  [`${ext('QuickAddItemDetails')}`]: {
    container: {
      flex: 1,
      flexDirection: 'row',
      marginTop: responsiveWidth(5),
    },
    image: {
      width: responsiveWidth(95),
      height: responsiveWidth(95),
      borderRadius: 4,
      marginRight: responsiveWidth(8),
    },
    contentContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    // dirty hack to have text wrap properly
    innerContentContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    textContainer: {
      flex: 1,
      flexDirection: 'row',
    },
    detailsText: {
      flex: 1,
      flexWrap: 'wrap',
      fontSize: 12,
      lineHeight: 18,
      paddingBottom: responsiveWidth(8),
      fontWeight: resolveFontWeight('400'),
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '400'),
      color: resolveVariable('quickBuyDescriptionColor'),
    },
    priceContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    price: {
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '500'),
      fontWeight: resolveFontWeight('500'),
      fontSize: 20,
      lineHeight: 24,
      color: resolveVariable('quickBuyTitleColor'),
    },
    oldPrice: {
      color: changeColorAlpha(resolveVariable('text.color'), 0.6),
      marginRight: responsiveWidth(8),
      textDecorationLine: 'line-through',
    },
  },
  [`${ext('QuantitySelector')}`]: {
    mainContainer: {
      marginTop: responsiveHeight(18),
    },
    caption: {
      color: resolveVariable('quickBuyOptionCaptionColor'),
      fontSize: 15,
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '400'),
      fontWeight: resolveFontWeight('400'),
      lineHeight: 18,
      letterSpacing: 0.361,
    },
    container: {
      marginTop: responsiveHeight(8),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: responsiveHeight(10),
      paddingHorizontal: responsiveWidth(10),
      width: responsiveWidth(160),
      borderRadius: 4,
      backgroundColor: resolveVariable('quickBuyOptionBackgroundColor'),
    },
    control: {
      width: responsiveWidth(24),
      height: responsiveWidth(24),
    },
    count: {
      color: resolveVariable('quickBuyTitleColor'),
      fontSize: 15,
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '500'),
      fontWeight: resolveFontWeight('500'),
      lineHeight: 24,
    },
  },
  [`${ext('QuickAddOptionItem')}`]: {
    container: {
      height: responsiveHeight(44),
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: resolveVariable('quickBuyOptionBackgroundColor'),
      paddingHorizontal: responsiveWidth(16),
      marginRight: responsiveWidth(8),
      marginTop: responsiveWidth(8),
    },
    selectedContainer: {
      borderWidth: 1,
      borderColor: resolveVariable('quickBuyTitleColor'),
    },
    title: {
      color: resolveVariable('quickBuyOptionNameColor'),
      fontSize: 15,
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '400'),
      fontWeight: resolveFontWeight('400'),
      lineHeight: 24,
    },
    selectedTitle: {
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '500'),
      fontWeight: resolveFontWeight('500'),
    },
  },
  [`${ext('QuickAddOption')}`]: {
    container: {
      marginTop: responsiveHeight(8),
    },
    caption: {
      color: resolveVariable('quickBuyOptionCaptionColor'),
      fontSize: 15,
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '400'),
      fontWeight: resolveFontWeight('400'),
      lineHeight: 18,
      letterSpacing: 0.361,
    },
    valuesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  },
  [`${ext('CheckoutScreen')}`]: {
    container: {
      flex: 1,
    },
  },
  [`${ext('CustomerAddressScreen')}`]: {
    screen: {
      flex: 1,
      backgroundColor: resolveVariable('paperColor'),
    },
    container: {
      flex: 1,
      paddingHorizontal: responsiveWidth(resolveVariable('mediumGutter')),
    },
    spinner: {
      zIndex: 10,
      ...StyleSheet.absoluteFill,
      color: resolveVariable('primaryButtonText.color'),
    },
    sectionHeader: {
      marginVertical: responsiveHeight(resolveVariable('mediumGutter')),
      fontSize: 15,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: resolveVariable('lineColor'),
    },
    itemRow: {
      flexDirection: 'row',
      paddingVertical: responsiveHeight(resolveVariable('mediumGutter')),
    },
    itemContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    item: {
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '500'),
      fontWeight: resolveFontWeight('500'),
      fontSize: 14,
      paddingLeft: responsiveWidth(resolveVariable('smallGutter')),
    },
    iconFill: resolveVariable('text.color'),
  },
  [`${ext('EditAddressScreen')}`]: {
    container: {
      flex: 1,
      backgroundColor: resolveVariable('paperColor'),
    },
    spinner: {
      zIndex: 10,
      ...StyleSheet.absoluteFill,
      color: resolveVariable('primaryButtonText.color'),
    },
    deleteIcon: {
      color: resolveVariable('errorText.color'),
    },
    setDefaultAddressButton: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginVertical: responsiveHeight(resolveVariable('mediumGutter')),
    },
    footer: {
      backgroundColor: resolveVariable('paperColor'),
      ...dropShadowStyle,
    },
    confirmButton: {
      height: responsiveHeight(44),
      marginHorizontal: responsiveWidth(resolveVariable('mediumGutter')),
      marginVertical: responsiveHeight(resolveVariable('mediumGutter')),
      borderRadius: 4,
      backgroundColor: resolveVariable('secondaryButtonBackgroundColor'),
    },
    confirmButtonText: {
      color: resolveVariable('secondaryButtonTextColor'),
    },
    dropDownContainer: {
      paddingVertical: responsiveHeight(resolveVariable('smallGutter')),
      paddingHorizontal: responsiveWidth(resolveVariable('mediumGutter')),
      backgroundColor: resolveVariable('paperColor'),
    },
    dropDownMenu: {
      horizontalContainer: {
        border: resolveVariable('lineColor'),
        borderRadius: 6,
        borderWidth: StyleSheet.hairlineWidth,
        backgroundColor: resolveVariable('paperColor'),
        marginVertical: responsiveHeight(resolveVariable('smallGutter')),
        paddingVertical: responsiveHeight(resolveVariable('mediumGutter')),
        height: responsiveHeight(50),
      },
    },
  },
  [`${ext('FormInput')}`]: {
    container: {
      paddingVertical: responsiveHeight(resolveVariable('smallGutter')),
      paddingHorizontal: responsiveWidth(resolveVariable('mediumGutter')),
      backgroundColor: resolveVariable('paperColor'),
    },
    label: {
      paddingVertical: responsiveHeight(resolveVariable('smallGutter')),
    },
    textInput: {
      border: resolveVariable('lineColor'),
      borderRadius: 6,
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: resolveVariable('paperColor'),
    },
    error: {
      fontSize: 12,
      color: resolveVariable('errorText.color'),
      paddingTop: responsiveHeight(resolveVariable('smallGutter')),
    },
  },
});
