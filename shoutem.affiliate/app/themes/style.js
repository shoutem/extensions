import { createScopedResolver } from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.affiliate.Banner': {
    divider: { height: 5, padding: 0 },
  },

  'shoutem.affiliate.LevelsListScreen': {
    gaugeContainer: {
      width: '100%',
      marginBottom: resolveVariable('mediumGutter'),
      alignItems: 'center',
    },
    spinner: {
      marginTop: 50,
    },
  },

  'shoutem.affiliate.LevelItem': {
    divider: { height: 5, padding: 0 },
    icon: { height: 35, width: 35, opacity: 0.75 },
    pointsReached: { opacity: 1 },
  },

  'shoutem.affiliate.ProgressBar': {
    container: {
      height: 275,
      width: 275,
    },

    pointsLabel: {
      position: 'absolute',
      top: '35%',
    },

    progressContainer: {
      height: 260,
      width: 260,
    },

    progressRadius: 120,

    level: {
      position: 'absolute',
      marginLeft: -9,
      marginTop: -9,
    },

    shareCodeButton: {},
  },

  'shoutem.affiliate.GaugeProgressBar': {
    progressContainer: {
      transform: [{ rotate: '135deg' }],
    },

    progressBar: {
      fill: 'none',
      stroke: resolveVariable('lineColor'),
      strokeLinecap: 'round',
      strokeWidth: 10,
    },

    progressBarCompleted: {
      fill: 'none',
      stroke: resolveVariable('secondaryButtonBackgroundColor'),
      strokeLinecap: 'round',
      strokeWidth: 10,
    },

    refreshIcon: {
      width: 18,
    },
  },

  'shoutem.affiliate.LevelIcon': {
    level: {
      backgroundColor: resolveVariable('primaryButtonBackgroundColor'),
      borderColor: resolveVariable('secondaryButtonBackgroundColor'),
      borderWidth: 1,
      borderRadius: 50,
      height: 30,
      opacity: 0.75,
      padding: 5,
      paddingBottom: 6,
      width: 30,
    },

    levelReached: {
      backgroundColor: resolveVariable('secondaryButtonBackgroundColor'),
      borderRadius: 50,
      height: 30,
      opacity: 1,
      padding: 5,
      paddingBottom: 6,
      width: 30,
    },

    icon: {
      color: resolveVariable('secondaryButtonBackgroundColor'),
      height: 17,
      width: 17,
    },

    iconLevelReached: {
      color: resolveVariable('primaryButtonBackgroundColor'),
    },
  },
});
