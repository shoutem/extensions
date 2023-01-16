import { StyleSheet } from 'react-native';
import { createScopedResolver } from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  [`${ext('NavigationToolbar')}`]: {
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

  [`${ext('WebViewScreen')}`]: {
    container: {
      flex: 1,
    },
    pdfStyle: {
      flex: 1,
      width: resolveVariable('sizes.window.width'),
    },
  },

  [`${ext('WebViewWithShareScreen')}`]: {
    container: {
      flex: 1,
    },
    pdfStyle: {
      flex: 1,
      width: resolveVariable('sizes.window.width'),
    },
  },
});
