import _ from 'lodash';
import { getExtensionSettings } from 'shoutem.application/redux';
import { ext } from '../const';

function getRootScreen(state) {
  const {
    configuration: { value: configurationId },
    configurations,
    shortcuts,
  } = state['shoutem.application'];

  const configuration = configurations[configurationId];
  const rootShortcutId = configuration.relationships.navigation.data[0].id;

  return shortcuts[rootShortcutId].attributes.screens[0];
}

export function getNavInitialized(state) {
  return _.get(state[ext()], 'navigationInitialized', false);
}

export function isTabBarNavigation(state) {
  return getRootScreen(state).canonicalName === ext('TabBar');
}

export function mapExtensionSettingsToProps(state) {
  const settings = getExtensionSettings(state, ext());

  return {
    navigationBarImage: settings.backgroundImage,
    backgroundImageEnabledFirstScreen:
      settings.backgroundImageEnabledFirstScreen,
    showTitle: settings.showTitle,
    fitContainer: settings.fitContainer,
  };
}
