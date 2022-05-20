import { INCLUDE } from '@shoutem/theme';
import { createScopedResolver, dimensionRelativeToIphone } from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.besttime.OpenHours': {
    openText: {
      color: '#EF1095',
    },
  },

  'shoutem.besttime.ForecastScreen': {
    buttonText: {
      color: resolveVariable('secondaryButtonTextColor'),
    },
  },

  'shoutem.besttime.ForecastGraph': {
    'shoutem.ui.View': {
      'shoutem.ui.View': {
        '.overlaid': {
          paddingTop: 80,
          position: 'absolute',
        },
      },
    },
    axisColor: resolveVariable('text.color'),
    yAxisSvg: {
      fill: resolveVariable('text.color'),
      fontSize: 10,
    },
    xAxisSvg: {
      fill: resolveVariable('text.color'),
      fontSize: 10,
      textAnchor: 'end',
    },
    chartContentInsets: {
      bottom: 5,
      top: 20,
    },
    forecastColor: resolveVariable('featuredColor'),
    liveBarChart: {
      position: 'absolute',
      marginLeft: 6,
      height: 160,
      paddingRight: 15,
      width: resolveVariable('sizes.window.width') - 40,
    },
    liveColor: '#EF1095DD',
    rawBarChart: {
      height: 160,
      paddingRight: 15,
      width: resolveVariable('sizes.window.width') - 40,
    },
    xAxis: {
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 5,
      width: resolveVariable('sizes.window.width') - 40,
    },
    yAxis: {
      height: 180,
      paddingLeft: 15,
    },
    yAxisContentInsets: {
      top: 20,
      bottom: 25,
    },
  },

  'shoutem.besttime.SearchScreen': {
    backgroundImage: {
      [INCLUDE]: ['fillParent'],
      width: resolveVariable('sizes.window.width'),
      height: resolveVariable('sizes.window.height'),
    },
  },

  'shoutem.besttime.SearchInput': {
    'shoutem.ui.View': {
      'shoutem.ui.View': {
        'shoutem.ui.Icon': {
          backgroundColor: resolveVariable('paperColor'),
          marginHorizontal: 10,
          marginVertical: 5,
          color: resolveVariable('shoutem.navigation', 'navBarIconsColor'),
        },

        'shoutem.ui.TextInput': {
          backgroundColor: resolveVariable('paperColor'),
          height: 30,
          paddingVertical: 0,
          paddingLeft: 0,
          marginLeft: 0,
          width:
            resolveVariable('sizes.window.width') -
            dimensionRelativeToIphone(130),
        },

        'shoutem.ui.Button': {
          'shoutem.ui.Icon': {
            color: resolveVariable('shoutem.navigation', 'navBarIconsColor'),
            marginRight: 0,
            paddingLeft: 10,
          },
        },

        backgroundColor: resolveVariable('paperColor'),
        borderRadius: 6,
        marginHorizontal: resolveVariable('mediumGutter'),
      },

      backgroundColor: resolveVariable(
        'shoutem.navigation',
        'navBarBackground',
      ),
      height: 40,
    },
  },

  'shoutem.besttime.SearchInstructions': {
    'shoutem.ui.View': {
      flex: 1,
    },
  },

  'shoutem.besttime.GooglePlacesError': {
    'shoutem.ui.View': {
      flex: 1,
    },
  },
});
