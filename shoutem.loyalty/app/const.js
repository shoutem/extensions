// This file is auto-generated.
import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const AUTHORIZATIONS_SCHEMA = 'shoutem.loyalty.authorizations';
export const CARD_SCHEMA = 'shoutem.loyalty.cards';
export const CARD_STATE_SCHEMA = 'shoutem.loyalty.card-states';
export const CASHIERS_SCHEMA = 'shoutem.loyalty.cashiers';
export const POINT_REWARDS_SCHEMA = 'shoutem.loyalty.point-rewards';
export const PUNCH_REWARDS_SCHEMA = 'shoutem.loyalty.punch-rewards';
export const RULES_SCHEMA = 'shoutem.loyalty.rules';
export const TRANSACTIONS_SCHEMA = 'shoutem.loyalty.transactions';

export const CMS_PUNCHCARDS_SCHEMA = ext('punch-cards');
export const REWARDS_SCHEMA = ext('rewards');
export const PLACE_REWARDS_SCHEMA = ext('place-rewards');
export const PLACES_SCHEMA = ext('places');
