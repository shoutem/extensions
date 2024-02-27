import { INCLUDE } from '@shoutem/theme';
import {
  createScopedResolver,
  dimensionRelativeToIphone,
  responsiveHeight,
  responsiveWidth,
} from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.cms.SearchInput': {
    container: {
      backgroundColor: resolveVariable(
        'shoutem.navigation',
        'navBarBackground',
      ),
      height: responsiveHeight(44),
      justifyContent: 'center',
    },
    searchBackground: {
      backgroundColor:
        resolveVariable('searchInputBackgroundColor') || '#F0F0F0',
      borderRadius: 4,
      marginHorizontal: resolveVariable('smallGutter'),
      height: responsiveHeight(30),
    },
    searchIcon: {
      color: resolveVariable('searchTextColor') || '#666666',
      marginHorizontal: responsiveWidth(10),
      marginVertical: responsiveHeight(5),
    },
    searchTextInput: {
      backgroundColor:
        resolveVariable('searchInputBackgroundColor') || '#F0F0F0',
      color: resolveVariable('searchTextColor') || '#666666',
      height: responsiveHeight(30),
      marginLeft: 0,
      paddingVertical: 0,
      paddingLeft: 0,
      placeholderTextColor: resolveVariable('searchTextColor') || '#666666',
      selectionColor: resolveVariable('searchTextColor') || '#666666',
      width:
        resolveVariable('sizes.window.width') - dimensionRelativeToIphone(110),
    },
    clearSearchContainer: {
      height: responsiveHeight(30),
      width: responsiveWidth(44),
    },
    clearSearchIcon: {
      color: resolveVariable('searchTextColor') || '#666666',
    },
  },

  'shoutem.cms.FullGridRowItemView': {
    container: {
      borderColor: 'rgba(68,79,108,0.2)',
      borderRadius: 4,
      borderWidth: 1,
      marginBottom: responsiveHeight(8),
    },
    imageContainer: { height: dimensionRelativeToIphone(224) },
    textContainer: {
      backgroundColor: resolveVariable('paperColor'),
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
      paddingBottom: responsiveHeight(16),
      paddingTop: responsiveHeight(4),
    },
  },

  'shoutem.cms.HalfGridRowItemView': {
    [INCLUDE]: ['shoutem.cms.FullGridRowItemView'],
    container: {
      ...['shoutem.cms.FullGridRowItemView'],
      marginHorizontal: responsiveWidth(4),
    },
    imageContainer: { height: dimensionRelativeToIphone(110) },
    textContainer: {
      ...['shoutem.cms.FullGridRowItemView'],
      height: dimensionRelativeToIphone(108),
    },
  },
});
