import { changeColorAlpha } from '@shoutem/theme';
import {
  createScopedResolver,
  resolveFontFamily,
  resolveFontStyle,
  resolveFontWeight,
} from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.in-app-purchases.SuccessModal': {
    container: {
      flex: 1,
      paddingBottom: 56,
      paddingHorizontal: 40,
      paddingTop: 80,
      justifyContent: 'space-between',
      backgroundColor: resolveVariable('paperColor'),
    },

    modal: {
      margin: 0,
    },

    button: {
      height: 48,
      borderRadius: 0,
      borderColor: resolveVariable('primaryButtonBorderColor'),
      backgroundColor: resolveVariable('primaryButtonBackgroundColor'),
    },

    buttonText: {
      fontSize: 17,
      lineHeight: 24,
      color: resolveVariable('primaryButtonText.color'),
      fontWeight: '400',
    },

    description: {
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      marginVertical: 16,
    },

    title: {
      color: resolveVariable('title.color'),
      fontWeight: '500',
      fontSize: 24,
      lineHeight: 32,
      textAlign: 'center',
      letterSpacing: -0.408,
      marginVertical: 16,
    },
  },

  'shoutem.in-app-purchases.SubscriptionsScreen': {
    scrollContainer: {
      paddingBottom: 16,
    },

    scrollGradient: {
      locations: [0, 0.8, 1],
      colors: [
        changeColorAlpha(resolveVariable('paperColor'), 0),
        changeColorAlpha(resolveVariable('paperColor'), 0),
        changeColorAlpha(resolveVariable('paperColor'), 0.5),
      ],
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    buttonContainer: {
      paddingHorizontal: 16,
      marginBottom: 16,
      marginTop: 16,
    },

    button: {
      height: 48,
      borderRadius: 6,
      borderColor: resolveVariable('primaryButtonBorderColor'),
      backgroundColor: resolveVariable('primaryButtonBackgroundColor'),
    },

    buttonSecondary: {
      marginTop: 16,
      backgroundColor: resolveVariable('secondaryButtonBackgroundColor'),
      borderColor: resolveVariable('secondaryButtonBackgroundColor'),
    },

    buttonText: {
      fontSize: 17,
      lineHeight: 24,
      color: resolveVariable('primaryButtonTextColor'),
      fontWeight: '400',
    },

    buttonTextSecondary: {
      color: resolveVariable('secondaryButtonTextColor'),
    },

    trialText: {
      fontSize: 14,
      lineHeight: 24,
      marginTop: 8,
      textAlign: 'center',
    },

    leadingText: {
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      padding: 16,
    },

    image: {
      marginTop: 16,
      width: resolveVariable('sizes.window.width'),
      height: resolveVariable('sizes.window.width') * 0.5,
    },

    spinner: {
      color: resolveVariable('primaryButtonText.color'),
      size: 20,
    },

    spinnerSecondary: {
      color: resolveVariable('secondaryButtonTextColor'),
    },
  },

  'shoutem.in-app-purchases.TermsAndPolicy': {
    mainText: {
      textAlign: 'center',
      marginBottom: 16,
    },

    linkText: {
      ...resolveVariable('links'),
      fontFamily: resolveFontFamily(
        resolveVariable('links.fontFamily'),
        resolveVariable('links.fontWeight'),
        resolveVariable('links.fontStyle'),
      ),
      fontWeight: resolveFontWeight(resolveVariable('links.fontWeight')),
      fontStyle: resolveFontStyle(resolveVariable('links.fontStyle')),
    },
  },
});
