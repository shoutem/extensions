import _ from 'lodash';
import { variableResolver } from '@shoutem/ui';
import { commonThemeVariables } from '../const';

/**
 * Resolves given theme style.
 * @param theme Denormalized theme object from state
 * @param app Application instance
 * @returns {*} Resolved theme style
 */
export function resolveThemeStyle(theme, themeResolvers) {
  const initTheme = themeResolvers[theme.canonicalName];

  if (!initTheme) {
    throw Error(
      `Resolving "${theme.canonicalName}" but couldn't be found in application.` +
        'This usually happen when theme extension is not installed.',
    );
  } else if (!_.isFunction(initTheme)) {
    throw Error(`Theme "${theme.canonicalName}" is not exporting a function.`);
  }

  const themeVariables = _.get(theme, 'settings.variables');
  variableResolver.setVariables({ ...commonThemeVariables, ...themeVariables });

  return initTheme();
}
