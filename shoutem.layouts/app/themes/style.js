import { getSizeRelativeToReference, INCLUDE } from '@shoutem/theme';
import {
  createScopedResolver,
  dimensionRelativeToIphone,
  resolveFontWeight,
} from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.layouts.Grid122Layout': {
    list: {
      paddingHorizontal: getSizeRelativeToReference(
        8,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
  },

  'shoutem.layouts.FullGridRowItemView': {
    container: {
      borderWidth: 0,
      overflow: 'visible',
      shadowColor: 'rgba(0, 0, 0, 0.12)',
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 2,
      marginBottom: getSizeRelativeToReference(
        8,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    imageContainer: {
      width:
        resolveVariable('sizes.window.width') -
        getSizeRelativeToReference(
          16,
          375,
          resolveVariable('sizes.window.width'),
        ),
      height:
        (resolveVariable('sizes.window.width') -
          getSizeRelativeToReference(
            16,
            375,
            resolveVariable('sizes.window.width'),
          )) *
        (2 / 3),
    },
    textContainer: {
      height: dimensionRelativeToIphone(92),
      paddingHorizontal: getSizeRelativeToReference(
        16,
        375,
        resolveVariable('sizes.window.width'),
      ),
      paddingBottom: getSizeRelativeToReference(
        4,
        812,
        resolveVariable('sizes.window.height'),
      ),
      paddingTop: getSizeRelativeToReference(
        16,
        812,
        resolveVariable('sizes.window.height'),
      ),
      backgroundColor: resolveVariable('grid122ItemBackgroundColor'),
      borderTopColor: 'rgba(68,79,108,0.2)',
      borderTopWidth: 1,
    },
    title: {
      fontWeight: resolveFontWeight('bold'),
    },
  },

  'shoutem.layouts.FeaturedGridRowItemView': {
    [INCLUDE]: ['shoutem.layouts.FullGridRowItemView'],
    imageContainer: {
      // Image has to be a square, 1:1 ratio. Using (-16) because
      // shoutem.layouts.Grid122FullRowView.container.marginHorizontal = 8
      height:
        resolveVariable('sizes.window.width') -
        getSizeRelativeToReference(
          16,
          375,
          resolveVariable('sizes.window.width'),
        ),
    },
    textContainer: {
      height: getSizeRelativeToReference(
        110,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
  },

  'shoutem.layouts.HalfGridRowItemView': {
    [INCLUDE]: ['shoutem.layouts.FullGridRowItemView'],
    container: {
      borderColor: 'rgba(68,79,108,0.2)',
      borderWidth: 1,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      marginBottom: getSizeRelativeToReference(
        8,
        375,
        resolveVariable('sizes.window.width'),
      ),
    },
    imageContainer: {
      height: getSizeRelativeToReference(
        110,
        812,
        resolveVariable('sizes.window.height'),
      ),
      width:
        resolveVariable('sizes.window.width') / 2 -
        getSizeRelativeToReference(
          14,
          375,
          resolveVariable('sizes.window.width'),
        ),
    },
    image: { borderTopLeftRadius: 4, borderTopRightRadius: 4 },
    textContainer: {
      ...['shoutem.layouts.FullGridRowItemView'],
      height: getSizeRelativeToReference(
        110,
        812,
        resolveVariable('sizes.window.height'),
      ),
      width:
        resolveVariable('sizes.window.width') / 2 -
        getSizeRelativeToReference(
          14,
          375,
          resolveVariable('sizes.window.width'),
        ),
    },
  },

  'shoutem.layouts.CompactListSkeletonPlaceholder': {
    featuredItem: {
      width: dimensionRelativeToIphone(365),
      height: dimensionRelativeToIphone(345),
      alignSelf: 'center',
      paddingVertical: resolveVariable('smallGutter'),
    },
    image: {
      height: 67,
      width: 67,
      borderRadius: 2,
      marginRight: resolveVariable('mediumGutter'),
    },
    shortLine: {
      marginBottom: resolveVariable('smallGutter'),
      height: 15,
      width: resolveVariable('sizes.window.width') / 2,
    },
    longLine: {
      marginBottom: resolveVariable('mediumGutter'),
      height: 15,
      width: resolveVariable('sizes.window.width') / 2 + 30,
    },
    dateStampLine: {
      marginVertical: resolveVariable('smallGutter'),
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
      marginTop: resolveVariable('largeGutter'),
      marginBottom: resolveVariable('mediumGutter'),
    },
    shortLine: {
      marginTop: resolveVariable('smallGutter'),
      height: 15,
      width:
        resolveVariable('sizes.window.width') -
        resolveVariable('extraLargeGutter'),
    },
    longLine: {
      marginTop: resolveVariable('smallGutter'),
      height: 15,
      width:
        resolveVariable('sizes.window.width') - resolveVariable('largeGutter'),
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
    shortLine: { width: 80, marginBottom: resolveVariable('smallGutter') },
    longLine: { width: 100, marginBottom: resolveVariable('smallGutter') },
    dateStampLine: {
      height: 10,
      width: 70,
      marginTop: resolveVariable('mediumGutter'),
    },
  },

  'shoutem.layouts.LargeListSkeletonPlaceholder': {
    image: {
      width: resolveVariable('sizes.window.width'),
      height: dimensionRelativeToIphone(238),
    },
    shortLine: {
      marginBottom: resolveVariable('smallGutter'),
      height: 15,
      width: resolveVariable('sizes.window.width') / 2,
    },
    longLine: {
      marginBottom: resolveVariable('mediumGutter'),
      height: 15,
      width:
        resolveVariable('sizes.window.width') / 2 +
        resolveVariable('largeGutter'),
    },
    dateStampLine: {
      marginVertical: resolveVariable('smallGutter'),
      height: 10,
      width: 100,
    },
  },

  'shoutem.layouts.TileListSkeletonPlaceholder': {
    itemContainer: { flex: 1, width: '100%', marginBottom: 1 },
  },
});
