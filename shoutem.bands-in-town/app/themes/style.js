import { StyleSheet } from 'react-native';
import { ext } from '../const';

export default () => ({
  [`${ext('BandsInTownScreen')}`]: {
    container: {
      flex: 1,
    },
  },
  [`${ext('NavigationToolbar')}`]: {
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 40,
      backgroundColor: '#eeeeee',
      borderTopColor: 'rgba(20, 20, 20, 0.2)',
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    disabledIcon: {
      color: '#a6a6a6',
    },
    navigationButton: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderRadius: 0,
      color: '#5f5f5f',
    },
    navigationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 140,
    },
    refreshButton: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderRadius: 0,
    },
    refreshButtonContainer: {
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  },
});
