import { Dimensions } from 'react-native';
import {
  createScopedResolver,
  dimensionRelativeToIphone,
  resolveFontWeight,
  responsiveWidth,
} from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

const DEALS_LIST_ITEM_WIDTH = Dimensions.get('window').width / 2.5;
const DEALS_LIST_ITEM_HEIGHT = DEALS_LIST_ITEM_WIDTH * (16 / 9);

export default () => ({
  [`${ext()}.PlacesGridScreen`]: {
    list: { marginHorizontal: 8, marginTop: 8 },
  },

  [`${ext()}.PlaceFullGridRowView`]: {
    container: {
      borderColor: 'rgba(68,79,108,0.2)',
      borderRadius: 4,
      borderWidth: 1,
      marginBottom: 8,
    },
    imageContainer: { height: dimensionRelativeToIphone(224) },
    textContainer: {
      backgroundColor: resolveVariable('gridItemBackgroundColor'),
      borderTopColor: 'rgba(68,79,108,0.2)',
      borderTopWidth: 1,
      height: dimensionRelativeToIphone(92),
      padding: 10,
    },
    title: { fontSize: 20, fontWeight: 'bold', lineHeight: 24 },
    description: {
      fontSize: 14,
      lineHeight: 16,
    },
  },

  [`${ext()}.PlaceHalfGridRowView`]: {
    container: {
      borderColor: 'rgba(68,79,108,0.2)',
      borderRadius: 4,
      borderWidth: 1,
      marginBottom: 8,
      marginHorizontal: 4,
    },
    imageContainer: { height: dimensionRelativeToIphone(110) },
    textContainer: {
      backgroundColor: resolveVariable('gridItemBackgroundColor'),
      borderTopColor: 'rgba(68,79,108,0.2)',
      borderTopWidth: 1,
      padding: 10,
      height: dimensionRelativeToIphone(108),
    },
    title: { fontSize: 20, fontWeight: 'bold', lineHeight: 24 },
    description: {
      fontSize: 14,
      lineHeight: 16,
    },
  },

  [`${ext()}.PlaceDealsList`]: {
    list: {
      listContent: {
        paddingLeft: resolveVariable('mediumGutter'),
        backgroundColor: resolveVariable('paperColor'),
      },
      loadMoreSpinner: {
        width: DEALS_LIST_ITEM_WIDTH / 2,
        height: DEALS_LIST_ITEM_HEIGHT,
        justifyContent: 'center',
      },
    },
  },

  [`${ext()}.DealListItem`]: {
    itemSize: {
      width: DEALS_LIST_ITEM_WIDTH,
      height: DEALS_LIST_ITEM_HEIGHT,
    },
    overlayContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      borderRadius: 6,
      backgroundColor: 'rgba(0,0,0, 0.4)',
    },
    endsCaption: { color: '#FFF', textAlign: 'center' },
    title: {
      color: '#FFF',
      textAlign: 'center',
      fontWeight: resolveFontWeight('500'),
    },
    regularPriceCaption: { color: '#FFF' },
    discountPriceCaption: {
      color: '#FFF',
      fontWeight: resolveFontWeight('500'),
      marginRight: responsiveWidth(-4), // Text has some weird space on the right when rendering currency
    },
  },
});
