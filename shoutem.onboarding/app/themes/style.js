import { changeColorAlpha, getSizeRelativeToReference } from '@shoutem/theme';
import {
  calculateLineHeight,
  createScopedResolver,
  resolveFontFamily,
  resolveFontWeight,
} from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.onboarding.OnboardingScreen': {
    imageBackground: {
      width: '100%',
      height: '100%',
    },
    image: {
      resizeMode: 'stretch',
    },
    container: {
      flex: 1,
      marginHorizontal: getSizeRelativeToReference(
        resolveVariable('largeGutter'),
        375,
        resolveVariable('sizes.window.width'),
      ),
      marginTop: getSizeRelativeToReference(
        80,
        812,
        resolveVariable('sizes.window.height'),
      ),
      marginBottom:
        resolveVariable('largeGutter') +
        getSizeRelativeToReference(
          48,
          812,
          resolveVariable('sizes.window.height'),
        ),
    },
    footerContainer: {
      position: 'absolute',
      bottom: getSizeRelativeToReference(
        40,
        812,
        resolveVariable('sizes.window.height'),
      ),
      left: resolveVariable('largeGutter'),
      right: resolveVariable('largeGutter'),
    },
    button: {
      height: getSizeRelativeToReference(
        48,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    pageIndicators: {
      container: {
        // Manually offset bottom for button height
        marginBottom:
          resolveVariable('mediumGutter') +
          getSizeRelativeToReference(
            48,
            812,
            resolveVariable('sizes.window.height'),
          ),
      },
      indicatorContainer: {
        'shoutem.ui.View': {
          backgroundColor: resolveVariable('onboardingTitleTextColor'),

          '.selected': {
            backgroundColor: changeColorAlpha(
              resolveVariable('onboardingTitleTextColor'),
              0.7,
            ),
          },
        },
      },
    },
  },

  'shoutem.onboarding.ImageContent': {
    container: {
      flex: 1,
      // Manually offset bottom for footer height
      marginBottom:
        resolveVariable('largeGutter') +
        getSizeRelativeToReference(
          48,
          812,
          resolveVariable('sizes.window.height'),
        ),
    },
    featuredImage: {
      flex: 1,
      alignSelf: 'center',
      width: getSizeRelativeToReference(
        285,
        375,
        resolveVariable('sizes.window.width'),
      ),
      height: getSizeRelativeToReference(
        285,
        812,
        resolveVariable('sizes.window.height'),
      ),
      marginVertical: getSizeRelativeToReference(
        40,
        812,
        resolveVariable('sizes.window.height'),
      ),
      resizeMode: 'contain',
    },
    topTextContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    bottomTextContainer: {
      flex: 1,
    },
    title: {
      color: resolveVariable('onboardingTitleTextColor'),
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: 32,
      lineHeight: calculateLineHeight(32),
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '700'),
      fontWeight: resolveFontWeight('700'),
      marginBottom: getSizeRelativeToReference(
        10,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    description: {
      color: resolveVariable('onboardingDescriptionTextColor'),
      textAlign: 'center',
      fontSize: 15,
      lineHeight: calculateLineHeight(15),
    },
  },

  'shoutem.onboarding.TextContent': {
    textContainerTop: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    textContainerMiddle: {
      flex: 1,
      justifyContent: 'center',
    },
    textContainerBottom: {
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: resolveVariable('sizes.tabBarHeight'),
    },
    title: {
      color: resolveVariable('onboardingTitleTextColor'),
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: 32,
      lineHeight: calculateLineHeight(32),
      fontFamily: resolveFontFamily(resolveVariable('text.fontFamily'), '700'),
      fontWeight: resolveFontWeight('700'),
      marginBottom: getSizeRelativeToReference(
        10,
        812,
        resolveVariable('sizes.window.height'),
      ),
    },
    description: {
      color: resolveVariable('onboardingDescriptionTextColor'),
      textAlign: 'center',
      fontSize: 15,
      lineHeight: calculateLineHeight(15),
    },
  },
});
