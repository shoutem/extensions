import pack from '../package.json';

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const SHOUTEM_MODULES = 'shoutem.core.modules';
export const SHOUTEM_SUBSCRIPTIONS = 'shoutem.billing.subscriptions';
export const SHOUTEM_PLANS = 'shoutem.billing.plans';
export const THEMES_SCHEMA = 'shoutem.core.themes';
