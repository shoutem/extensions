import { createScopedResolver } from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.loyalty.PointsCardScreen': {
    qrBackground: {
      backgroundColor: '#ffffff',
      margin: 10,
    },
  },

  'shoutem.loyalty.VerificationScreen': {
    qrBackground: {
      backgroundColor: '#ffffff',
    },
  },

  'shoutem.loyalty.SmallPointCardView': {
    container: {
      borderRadius: 4,
      shadowColor: resolveVariable('shadowColor'),
      shadowOpacity: 1,
      shadowOffset: { width: 1, height: 1 },
    },
    innerContainer: {
      borderRadius: 4,
      overflow: 'hidden',
    },
    pointsTitle: {
      marginLeft: 28,
      textAlign: 'left',
    },
    points: {
      marginLeft: 28,
      textAlign: 'left',
      fontSize: 36,
      lineHeight: 40,
    },
    qrBackground: {
      backgroundColor: '#ffffff',
      overflow: 'hidden',
    },
  },

  'shoutem.loyalty.RewardProgressBar': {
    '.short': {
      container: {
        marginTop: -2,
        marginRight: 12,
        marginLeft: -12,
      },
    },

    container: {
      height: 5,
      borderRadius: 100,
      backgroundColor: resolveVariable('backgroundColor'),
    },

    earnedPoints: {
      borderRadius: 100,
      height: 5,
      backgroundColor: resolveVariable('featuredColor'),
    },
  },

  'shoutem.loyalty.RewardsGaugeProgressBar': {
    '.secondary': {
      pointsLabel: {
        position: 'absolute',
        top: '40%',

        'shoutem.ui.Text': {
          color: '#ffffff',
        },

        'shoutem.ui.Title': {
          color: '#ffffff',
        },
      },

      progressBar: {
        opacity: 0.5,
        stroke: '#ffffff',
      },

      progressBarCompleted: {
        stroke: '#ffffff',
      },
    },

    container: {
      height: 275,
      width: 275,
    },

    pointsLabel: {
      position: 'absolute',
      top: '40%',
    },

    progressContainer: {
      height: 260,
      width: 260,
    },

    progressRadius: 120,

    reward: {
      position: 'absolute',
      marginLeft: -9,
      marginTop: -9,
    },
  },

  'shoutem.loyalty.GaugeProgressBar': {
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
      stroke: resolveVariable('horseshoeColor'),
      strokeLinecap: 'round',
      strokeWidth: 10,
    },
  },

  'shoutem.loyalty.PlaceRewardIcon': {
    reward: {
      backgroundColor: '#ffffff',
      borderColor: resolveVariable('lineColor'),
      borderRadius: 36,
      borderWidth: 3,
      height: 36,
      padding: 2,
      width: 36,

      'shoutem.ui.Icon': {
        color: resolveVariable('lineColor'),
      },
    },

    rewardReached: {
      backgroundColor: resolveVariable('horseshoeColor'),
      borderColor: '#ffffff',

      'shoutem.ui.Icon': {
        color: '#ffffff',
      },
    },
  },
});
