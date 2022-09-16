import { getSizeRelativeToReference } from '@shoutem/theme';
import {
  createScopedResolver,
  dimensionRelativeToIphone,
  resolveFontFamily,
  resolveFontWeight,
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
  'shoutem.shopify.FeaturedItem': {
    container: {
      borderRadius: 4,
      resizeMode: 'cover',
      overflow: 'hidden',
      justifyContent: 'flex-end',
      marginHorizontal: dimensionRelativeToIphone(8),
      marginVertical: getSizeRelativeToReference(
        resolveVariable('smallGutter'),
        812,
        resolveVariable('sizes.window.height'),
      ),
      width: dimensionRelativeToIphone(360),
      height: getSizeRelativeToReference(
        240,
        812,
        resolveVariable('sizes.window.height'),
      ),
      ...dropShadowStyle,
    },
    contentContainer: {
      flexDirection: 'row',
      paddingHorizontal: dimensionRelativeToIphone(
        resolveVariable('mediumGutter'),
      ),
      paddingBottom: getSizeRelativeToReference(
        resolveVariable('mediumGutter'),
        812,
        resolveVariable('sizes.window.height'),
      ),
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
    buyIconSize: dimensionRelativeToIphone(25),
  },
  'shoutem.shopify.ProductPrice': {
    container: {
      flexDirection: 'row',
      overflow: 'hidden',
      alignItems: 'center',
      width: dimensionRelativeToIphone(160),
      marginRight: dimensionRelativeToIphone(resolveVariable('smallGutter')),
      paddingTop: getSizeRelativeToReference(
        resolveVariable('smallGutter'),
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    wideContainer: { flex: 1 },
    price: {
      color: resolveVariable('text.color'),
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '600'),
      fontWeight: resolveFontWeight('600'),
      fontSize: 16,
      marginRight: dimensionRelativeToIphone(resolveVariable('smallGutter')),
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
      marginBottom: dimensionRelativeToIphone(resolveVariable('smallGutter')),
    },
  },
  'shoutem.shopify.GridItem': {
    container: {
      borderRadius: 4,
      backgroundColor: resolveVariable('paperColor'),
      width: dimensionRelativeToIphone(175),
      marginLeft: getSizeRelativeToReference(
        8,
        812,
        resolveVariable('sizes.window.height'),
      ),
      marginVertical: getSizeRelativeToReference(
        5,
        812,
        resolveVariable('sizes.window.height'),
      ),
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
      width: dimensionRelativeToIphone(175),
      height: getSizeRelativeToReference(
        150,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    tallImage: {
      width: dimensionRelativeToIphone(175),
      height: getSizeRelativeToReference(
        205,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    fixedImage: {
      width: dimensionRelativeToIphone(175),
      height: getSizeRelativeToReference(
        85,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    fixedContainer: {
      height: getSizeRelativeToReference(
        90,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    textContainer: {
      paddingHorizontal: dimensionRelativeToIphone(10),
      paddingVertical: getSizeRelativeToReference(
        8,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    priceContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
  },
  'shoutem.shopify.ProductTitle': {
    title: {
      fontSize: 16,
      color: resolveVariable('text.color'),
      paddingBottom: getSizeRelativeToReference(
        resolveVariable('smallGutter'),
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    featuredTitle: {
      fontSize: 17,
      color: '#FFFFFF',
    },
  },
  'shoutem.shopify.ListItem': {
    container: {
      flexDirection: 'row',
      borderRadius: 4,
      marginHorizontal: dimensionRelativeToIphone(8),
      marginVertical: getSizeRelativeToReference(
        resolveVariable('smallGutter'),
        812,
        resolveVariable('sizes.window.height'),
      ),
      ...dropShadowStyle,
    },
    contentContainer: {
      height: dimensionRelativeToIphone(65),
      justifyContent: 'space-between',
    },
    image: {
      width: dimensionRelativeToIphone(65),
      height: dimensionRelativeToIphone(65),
    },
  },
  'shoutem.shopify.AddToCartButton': {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderRadius: 0,
      paddingLeft: 0,
      paddingRight: 0,
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
    iconSize: dimensionRelativeToIphone(25),
    title: {
      marginLeft: dimensionRelativeToIphone(12),
      color: resolveVariable('text.color'),
    },
  },
  'shoutem.shopify.CartItem': {
    titleContainer: {
      flex: 1,
      justifyContent: 'space-between',
    },
    priceContainer: {
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginLeft: dimensionRelativeToIphone(resolveVariable('smallGutter')),
    },
  },
  'shoutem.shopify.MediumListItem': {
    container: {
      flexDirection: 'row',
      borderRadius: 4,
      height: getSizeRelativeToReference(
        140,
        812,
        resolveVariable('sizes.window.height'),
      ),
      paddingLeft: 0,
      marginHorizontal: dimensionRelativeToIphone(8),
      marginVertical: getSizeRelativeToReference(
        resolveVariable('smallGutter'),
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    contentContainer: {
      flexDirection: 'row',
      borderRadius: 4,
      backgroundColor: resolveVariable('paperColor'),
      position: 'absolute',
      left: dimensionRelativeToIphone(130),
      paddingHorizontal: dimensionRelativeToIphone(
        resolveVariable('mediumGutter'),
      ),
      paddingVertical: getSizeRelativeToReference(
        resolveVariable('mediumGutter'),
        812,
        resolveVariable('sizes.window.height'),
      ),
      height: getSizeRelativeToReference(
        110,
        812,
        resolveVariable('sizes.window.height'),
      ),
      width: dimensionRelativeToIphone(220),
      ...dropShadowStyle,
    },
    image: {
      borderRadius: 4,
      marginRight: 0,
      width: dimensionRelativeToIphone(220),
      height: getSizeRelativeToReference(
        140,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    productContainer: {
      flex: 1,
      justifyContent: 'space-around',
    },
    cartIcon: {
      alignSelf: 'center',
    },
  },
  'shoutem.shopify.LargeListItem': {
    container: {
      borderRadius: 4,
      resizeMode: 'cover',
      overflow: 'hidden',
      justifyContent: 'flex-end',
      marginHorizontal: dimensionRelativeToIphone(8),
      marginVertical: getSizeRelativeToReference(
        resolveVariable('smallGutter'),
        812,
        resolveVariable('sizes.window.height'),
      ),
      width: dimensionRelativeToIphone(360),
    },
    image: {
      width: dimensionRelativeToIphone(360),
      height: getSizeRelativeToReference(
        240,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    contentContainer: {
      flexDirection: 'row',
      backgroundColor: resolveVariable('paperColor'),
      paddingHorizontal: dimensionRelativeToIphone(16),
    },
    priceContainer: {
      flex: 1,
      paddingVertical: getSizeRelativeToReference(
        16,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
  },
  'shoutem.shopify.TileItem': {
    container: {
      resizeMode: 'cover',
      justifyContent: 'center',
      width: dimensionRelativeToIphone(375),
      height: getSizeRelativeToReference(
        200,
        812,
        resolveVariable('sizes.window.height'),
      ),
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
      marginTop: getSizeRelativeToReference(
        resolveVariable('mediumGutter'),
        812,
        resolveVariable('sizes.window.height'),
      ),
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
        marginTop: 20,
        backgroundColor: 'white',
        width: 155,
        height: 40,
        alignSelf: 'center',
        borderRadius: 2,
      },
    },
  },
});
