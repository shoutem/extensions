import { StyleSheet } from 'react-native';

export default () => ({
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
});
