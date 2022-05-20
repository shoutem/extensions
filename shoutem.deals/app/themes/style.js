import { Platform } from 'react-native';

export default () => ({
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
});
