import { INCLUDE } from '@shoutem/theme';
import { createScopedResolver, dimensionRelativeToIphone } from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
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
      backgroundColor: resolveVariable('gridItemBackgroundColor'),
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
});
