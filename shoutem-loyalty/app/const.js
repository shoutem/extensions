// This file is auto-generated.
import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const CARD_SCHEMA = ext('cards');
export const CARD_STATE_SCHEMA = ext('point-card-states');
export const AUTHORIZATIONS_SCHEMA = ext('authorizations');
export const CMS_REWARDS_SCHEMA = ext('cmsRewards');
export const CMS_PUNCHCARDS_SCHEMA = ext('punchCards');
export const PUNCHCARDS_SCHEMA = ext('punch-rewards');
export const REWARDS_SCHEMA = ext('point-rewards');
export const TRANSACTIONS_SCHEMA = ext('transactions');
