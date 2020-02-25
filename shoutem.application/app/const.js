// This file is auto-generated.
import pack from './package.json';

export const ACTIVE_APP_STATE = 'active';
export const APP_SUBSCRIPTION_SCHEMA = 'shoutem.billing.subscription-statuses';
export const APP_SUBSCRIPTION_TAG = 'subscription';
export const APPLICATION_SCHEMA = 'shoutem.core.application';
export const CONFIGURATION_SCHEMA = 'shoutem.core.configuration';
export const CONFIGURATION_TAG = 'configuration';
export const EXTENSIONS_SCHEMA = 'shoutem.core.extensions';
export const SCREENS_SCHEMA = 'shoutem.core.screens';
export const SHORTCUTS_SCHEMA = 'shoutem.core.shortcuts';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
