import { Platform } from 'react-native';
import {
  calculateLineHeight,
  dimensionRelativeToIphone,
  resolveFontFamily,
  resolveFontStyle,
  resolveFontWeight,
  resolveVariable,
} from '@shoutem/ui';

export default () => ({
  // Html
  'shoutem.ui.Html': {
    a: {
      text: {
        fontWeight: resolveFontWeight('700'),
        color: resolveVariable('title.color'),
      },
    },
    'se-attachment': {
      gallery: {
        container: {
          height: dimensionRelativeToIphone(130),
        },
      },
      video: {
        container: {
          width: 300,
        },
      },
    },
  },

  // SimpleHtml
  'shoutem.ui.SimpleHtml': {
    container: {
      padding: resolveVariable('mediumGutter'),
    },
    prefix: {
      color: resolveVariable('text.color'),
      fontFamily: 'Rubik-Regular',
      fontSize: 15,
    },
    baseFont: {
      ...resolveVariable('text'),
      fontFamily: resolveFontFamily(
        resolveVariable('text.fontFamily'),
        resolveVariable('text.fontWeight'),
        resolveVariable('text.fontStyle'),
      ),
      fontWeight: resolveFontWeight(resolveVariable('text.fontWeight')),
      fontStyle: resolveFontStyle(resolveVariable('text.fontStyle')),
    },
    table: {
      fitContainerWidth: true,
      fitContainerHeight: true,
      cellPaddingEm: 0.25,
      borderWidthPx: 0.25,
      linkColor: resolveVariable('links.color'),
      thBorderColor: '#E1E1E1',
      tdBorderColor: '#E1E1E1',
      thOddBackground: '#F3F3F3',
      thOddColor: resolveVariable('title.color'),
      thEvenBackground: '#F3F3F3',
      thEvenColor: resolveVariable('title.color'),
      trOddBackground: resolveVariable('paperColor'),
      trOddColor: resolveVariable('text.color'),
      trEvenBackground: resolveVariable('paperColor'),
      trEvenColor: resolveVariable('text.color'),
    },
    tableCss: `th, td {
    text-align: left;
  }
  th {
    border-bottom: 2px solid #343434 !important;
  }`,
    tags: {
      h1: {
        fontFamily: resolveFontFamily(
          resolveVariable('heading.fontFamily'),
          '700',
          resolveVariable('heading.fontStyle'),
        ),
        fontWeight: resolveFontWeight('700'),
        fontStyle: resolveFontStyle(resolveVariable('heading.fontStyle')),
        marginBottom: resolveVariable('mediumGutter'),
        marginTop: resolveVariable('mediumGutter'),
        color: resolveVariable('heading.color'),
      },
      h2: {
        fontFamily: resolveFontFamily(
          resolveVariable('heading.fontFamily'),
          '700',
          resolveVariable('heading.fontStyle'),
        ),
        fontWeight: resolveFontWeight('700'),
        fontStyle: resolveFontStyle(resolveVariable('heading.fontStyle')),
        marginBottom: resolveVariable('mediumGutter'),
        marginTop: resolveVariable('mediumGutter'),
        color: resolveVariable('heading.color'),
      },
      h3: {
        fontFamily: resolveFontFamily(
          resolveVariable('heading.fontFamily'),
          '700',
          resolveVariable('heading.fontStyle'),
        ),
        fontWeight: resolveFontWeight('700'),
        fontStyle: resolveFontStyle(resolveVariable('heading.fontStyle')),
        marginTop: resolveVariable('mediumGutter'),
        marginBottom: resolveVariable('mediumGutter'),
        color: resolveVariable('heading.color'),
      },
      h4: {
        fontFamily: resolveFontFamily(
          resolveVariable('heading.fontFamily'),
          '700',
          resolveVariable('heading.fontStyle'),
        ),
        fontWeight: resolveFontWeight('700'),
        fontStyle: resolveFontStyle(resolveVariable('heading.fontStyle')),
        marginTop: resolveVariable('mediumGutter'),
        marginBottom: resolveVariable('mediumGutter'),
        color: resolveVariable('heading.color'),
      },
      h5: {
        fontFamily: resolveFontFamily(
          resolveVariable('heading.fontFamily'),
          '700',
          resolveVariable('heading.fontStyle'),
        ),
        fontWeight: resolveFontWeight('700'),
        fontStyle: resolveFontStyle(resolveVariable('heading.fontStyle')),
        marginTop: resolveVariable('mediumGutter'),
        marginBottom: resolveVariable('mediumGutter'),
        color: resolveVariable('heading.color'),
      },
      a: {
        fontFamily: resolveFontFamily(
          resolveVariable('title.fontFamily'),
          '700',
          resolveVariable('title.fontStyle'),
        ),
        fontWeight: resolveFontWeight('700'),
        fontStyle: resolveFontStyle(resolveVariable('title.fontStyle')),
        fontSize: 15,
        textDecorationLine: 'none',
        color: resolveVariable('title.color'),
      },
      p: {
        fontFamily: resolveFontFamily(
          resolveVariable('text.fontFamily'),
          resolveVariable('text.fontWeight'),
          resolveVariable('text.fontStyle'),
        ),
        fontWeight: resolveFontWeight(resolveVariable('text.fontWeight')),
        fontStyle: resolveFontStyle(resolveVariable('text.fontStyle')),
        fontSize: 15,
        lineHeight: calculateLineHeight(15),
        marginTop: resolveVariable('mediumGutter'),
        marginBottom: resolveVariable('mediumGutter'),
        color: resolveVariable('text.color'),
      },
      li: {
        fontFamily: resolveFontFamily(
          resolveVariable('text.fontFamily'),
          resolveVariable('text.fontWeight'),
          resolveVariable('text.fontStyle'),
        ),
        fontWeight: resolveFontWeight(resolveVariable('text.fontWeight')),
        fontStyle: resolveFontStyle(resolveVariable('text.fontStyle')),
        fontSize: 15,
        color: resolveVariable('text.color'),
      },
      img: {
        marginTop: resolveVariable('mediumGutter'),
        marginBottom: resolveVariable('mediumGutter'),
      },
      strong: Platform.select({
        android: {
          fontFamily: 'System',
        },
      }),
      em: Platform.select({
        android: {
          fontFamily: 'System',
        },
      }),
    },
  },

  // Lightbox
  'shoutem.ui.Lightbox': {
    'shoutem.ui.Image': {
      '.preview': {
        flex: 1,
        resizeMode: 'contain',
      },
    },
  },

  //
  // Empty State (error page)
  //
  'shoutem.ui.EmptyStateView': {
    'shoutem.ui.View': {
      'shoutem.ui.Subtitle': {
        marginTop: resolveVariable('mediumGutter'),
        width: 120,
      },

      'shoutem.ui.View': {
        '.anchor-bottom': {
          position: 'absolute',
          bottom: 0,
        },

        '.icon-placeholder': {
          height: 62,
          width: 62,
          backgroundColor: 'rgba(3, 3, 3, 0.1)',
          borderRadius: 31,
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
    },

    '.wide-subtitle': {
      'shoutem.ui.View': {
        'shoutem.ui.Subtitle': {
          marginTop: resolveVariable('mediumGutter'),
          width: 180,
        },

        'shoutem.ui.View': {
          '.anchor-bottom': {
            position: 'absolute',
            bottom: 0,
          },

          '.icon-placeholder': {
            height: 62,
            width: 62,
            backgroundColor: 'rgba(3, 3, 3, 0.1)',
            borderRadius: 31,
            justifyContent: 'center',
          },
        },
      },
    },
  },
});
