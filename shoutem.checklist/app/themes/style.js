import { changeColorAlpha } from '@shoutem/theme';
import {
  calculateLineHeight,
  createScopedResolver,
  dimensionRelativeToIphone,
  resolveFontFamily,
} from '@shoutem/ui';
import { ext } from '../const';

const resolveVariable = createScopedResolver(ext());

export default () => ({
  'shoutem.checklist.ChecklistScreen': {
    disabledSaveButtonText: {
      color: resolveVariable('backgroundColor'),
      opacity: 0.5,
    },
    endFillColor: {
      color: resolveVariable('backgroundColor'),
    },
    saveButton: {
      bottom: resolveVariable('mediumGutter'),
      height: dimensionRelativeToIphone(44),
      left: resolveVariable('mediumGutter'),
      position: 'absolute',
      width:
        resolveVariable('sizes.window.width') -
        resolveVariable('mediumGutter') * 2,
    },
    saveButtonText: {
      color: resolveVariable('backgroundColor'),
    },
    scrollViewContainer: {
      paddingBottom:
        resolveVariable('largeGutter') + dimensionRelativeToIphone(44),
    },
  },

  'shoutem.checklist.Checklist': {
    mainContainer: {
      backgroundColor: resolveVariable('paperColor'),
      padding: resolveVariable('mediumGutter'),
      marginTop: resolveVariable('mediumGutter'),
      width: resolveVariable('sizes.window.width'),
    },
    simpleHtml: {
      container: {
        paddingHorizontal: 0,
      },
    },
    imagesMaxWidth:
      resolveVariable('sizes.window.width') -
      resolveVariable('mediumGutter') * 2,
  },

  'shoutem.checklist.ChecklistItem': {
    disabledIconFill: changeColorAlpha(resolveVariable('featuredColor'), 0.5),
    iconFill: resolveVariable('featuredColor'),
    mainContainer: {
      marginBottom: resolveVariable('mediumGutter'),
    },
    simpleHtml: {
      container: {
        paddingVertical: 0,
        paddingLeft: resolveVariable('smallGutter'),
        flex: 1,
      },
    },
    imagesMaxWidth:
      resolveVariable('sizes.window.width') -
      resolveVariable('smallGutter') -
      resolveVariable('mediumGutter') * 2 -
      24,
  },

  'shoutem.checklist.ChecklistNavBarButton': {
    buttonText: {
      ...resolveVariable('shoutem.navigation', 'navBarText'),
      color: resolveVariable('shoutem.navigation', 'navBarIconsColor'),
    },
  },

  'shoutem.checklist.SubmitMessageScreen': {
    contactButton: {
      backgroundColor: resolveVariable('primaryButtonBackgroundColor'),
      borderWidth: 0,
      bottom:
        resolveVariable('mediumGutter') * 2 + dimensionRelativeToIphone(44),
      height: dimensionRelativeToIphone(44),
      left: resolveVariable('mediumGutter'),
      position: 'absolute',
      width:
        resolveVariable('sizes.window.width') -
        resolveVariable('mediumGutter') * 2,
    },
    contactButtonIcon: {
      bottom: dimensionRelativeToIphone(9),
      right: 0,
      position: 'absolute',
    },
    contactButtonIconFill: resolveVariable('backgroundColor'),
    contactButtonText: {
      ...resolveVariable('primaryButtonText'),
      color: resolveVariable('backgroundColor'),
    },
    endFillColor: {
      color: resolveVariable('backgroundColor'),
    },
    goBackButton: {
      backgroundColor: changeColorAlpha(resolveVariable('featuredColor'), 0.1),
      borderWidth: 0,
      bottom: resolveVariable('mediumGutter'),
      height: dimensionRelativeToIphone(44),
      left: resolveVariable('mediumGutter'),
      position: 'absolute',
      width:
        resolveVariable('sizes.window.width') -
        resolveVariable('mediumGutter') * 2,
    },
    goBackButtonText: {
      color: resolveVariable('featuredColor'),
    },
    overlayText: {
      fontFamily: resolveFontFamily(resolveVariable('title.fontFamily'), '600'),
      fontSize: 35,
      lineHeight: calculateLineHeight(35),
    },
    scrollViewContainerOneButton: {
      paddingBottom:
        resolveVariable('mediumGutter') + dimensionRelativeToIphone(44),
    },
    scrollViewContainerTwoButtons: {
      paddingBottom:
        resolveVariable('mediumGutter') * 2 + dimensionRelativeToIphone(44) * 2,
    },
  },
});
