import {
  createScopedResolver,
  resolveFontFamily,
  resolveFontWeight,
  responsiveHeight,
  responsiveWidth,
} from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.age-restriction.AgeRestrictionScreen': {
    container: {
      flex: 1,
      marginBottom: responsiveHeight(resolveVariable('largeGutter')),
    },
    mainContent: {
      flex: 1,
      alignItems: 'center',
      marginHorizontal: responsiveWidth(resolveVariable('largeGutter')),
    },
    title: {
      color: resolveVariable('ageRestrictionTitleTextColor'),
      marginTop: responsiveHeight(resolveVariable('largeGutter')),
    },
    buttonContainer: {
      marginHorizontal: responsiveWidth(resolveVariable('largeGutter')),
      marginVertical: responsiveHeight(resolveVariable('smallGutter')),
    },
    confirmButton: {
      height: responsiveHeight(44),
      borderRadius: 4,
      backgroundColor: resolveVariable('ageRestrictionConfirmButtonColor'),
      borderColor: resolveVariable('ageRestrictionConfirmButtonColor'),
      borderWidth: 1,
      marginVertical: responsiveHeight(resolveVariable('smallGutter')),
    },
    exitButton: {
      height: responsiveHeight(44),
      borderRadius: 4,
      backgroundColor: resolveVariable('ageRestrictionExitButtonColor'),
      borderColor: resolveVariable('ageRestrictionExitButtonColor'),
      borderWidth: 1,
    },
    confirmButtonText: {
      marginTop: 0,
      marginBottom: 0,
      marginRight: 0,
      color: resolveVariable('ageRestrictionConfirmButtonTextColor'),
    },
    exitButtonText: {
      marginTop: 0,
      marginBottom: 0,
      marginRight: 0,
      color: resolveVariable('ageRestrictionExitButtonTextColor'),
    },
  },

  'shoutem.age-restriction.ImageBackgroundContainer': {
    container: {
      flex: 1,
      paddingTop: resolveVariable('sizes.navBarHeight'),
    },
  },

  'shoutem.age-restriction.AgeRestrictionSubtitle': {
    container: {
      color: resolveVariable('ageRestrictionDescriptionTextColor'),
      marginTop: responsiveHeight(resolveVariable('mediumGutter')),
    },
    text: {
      color: resolveVariable('ageRestrictionDescriptionTextColor'),
    },
    bold: {
      color: resolveVariable('ageRestrictionDescriptionTextColor'),
      fontFamily: resolveFontFamily(
        resolveVariable('text.fontFamily'),
        '700',
        resolveVariable('text.fontStyle'),
      ),
      fontWeight: resolveFontWeight('700'),
    },
  },

  'shoutem.age-restriction.AgeBadge': {
    container: {
      width: responsiveWidth(155),
      height: responsiveWidth(155),
      borderRadius: responsiveWidth(155 / 2),
      borderWidth: 7,
      borderColor: resolveVariable('ageRestrictionAgeBadgeColor'),
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: resolveVariable('ageRestrictionAgeBadgeColor'),
      fontSize: 50,
      fontFamily: resolveFontFamily(
        resolveVariable('text.fontFamily'),
        '700',
        resolveVariable('text.fontStyle'),
      ),
      fontWeight: resolveFontWeight('700'),
    },
  },
});
