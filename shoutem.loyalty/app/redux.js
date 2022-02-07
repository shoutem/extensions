import _ from 'lodash';
import { combineReducers } from 'redux';
import {
  collection,
  create,
  find,
  getCollection,
  resource,
  storage,
} from '@shoutem/redux-io';
import { getAppId } from 'shoutem.application';
import { getUser } from 'shoutem.auth';
import { cmsCollection } from 'shoutem.cms';
import { preventStateRehydration } from 'shoutem.redux';
import {
  AUTHORIZATIONS_SCHEMA,
  CARD_SCHEMA,
  CARD_STATE_SCHEMA,
  CASHIERS_SCHEMA,
  ext,
  PLACE_REWARDS_SCHEMA,
  PLACES_SCHEMA,
  POINT_REWARDS_SCHEMA,
  PUNCH_REWARDS_SCHEMA,
  REWARDS_SCHEMA,
  RULES_SCHEMA,
  TRANSACTIONS_SCHEMA,
} from './const';

const requestConfig = {
  request: {
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
  },
};

/**
 * Returns card ID for active loyalty card from state.
 *
 * @returns Card ID
 */
export const getCardId = state => {
  const { data } = state[ext()].card || {};

  return data && data.id;
};

/**
 * Checks if the user can redeem the reward.
 *
 * @returns true if the reward can be redeemed, false otherwise
 */
export const canRedeem = ({ points = 0, pointsRequired }) =>
  points >= pointsRequired;

/**
 * Checks if the reward is a punch card.
 * There are two criteria to distinguish them from point rewards:
 *
 * 1. Punch cards don't have a number of rewards defined.
 * 2. A reward can have a punch card flag. This happens when encoding it for QR scanning.
 *
 * @returns true if the reward is a punch card, false otherwise
 */
export const isPunchCard = reward =>
  reward && (reward.isPunchCard || !_.has(reward, 'numberOfRewards'));

/**
 * Gets cashier attributes from state
 */
export const getCashierInfo = state =>
  _.get(state[ext()].cashierInfo, 'data.attributes');

/**
 * Returns point card state for a place.
 *
 * @returns Card state for place with given ID, or single card state if null is passed as ID
 */
export const getCardStateForPlace = (state, placeId) => {
  const { allCardStates } = state[ext()];
  const cardStates = getCollection(allCardStates, state);

  return _.find(cardStates, { location: placeId });
};

/**
 * Returns state for single card, not tied to a specific place.
 *
 * @return Card state for single card loyalty
 */
export const getSingleCardState = state => getCardStateForPlace(state, null);

/**
 * Creates a loyalty card for the user with given ID
 *
 * @param userId User ID
 * @returns Server response with new card ID
 */
export const createCardForUser = userId => {
  return dispatch => {
    const newCard = {
      type: CARD_SCHEMA,
      attributes: {
        user: { id: `${userId}` },
      },
    };

    const config = {
      ...requestConfig,
      schema: CARD_SCHEMA,
    };

    return dispatch(create(config, newCard, { user: '' }));
  };
};

/**
 * Fetches card from server for user.
 *
 * @param userId User ID
 * @returns Server response with new card ID
 */
export const fetchCard = userId =>
  find(CARD_SCHEMA, undefined, { user: `user:${userId}` });

/**
 * Fetches point card state from server to refresh local state.
 *
 * @param cardId Loyalty card ID
 */
export const fetchCardState = cardId =>
  find(CARD_STATE_SCHEMA, undefined, { cardId });

/**
 * Fetches cashier info for user.
 *
 * @param userId User ID
 * @returns Server response with cashier info
 */
export const fetchCashierInfo = userId =>
  find(CASHIERS_SCHEMA, undefined, { userId });

/**
 * Fetches point rewards from server
 */
export const fetchPointRewards = (cardId, parentCategoryId) =>
  find(POINT_REWARDS_SCHEMA, undefined, {
    query: {
      'filter[app]': getAppId(),
      'filter[schema]': REWARDS_SCHEMA,
      'filter[categories]': parentCategoryId,
      'filter[card]': cardId,
    },
  });

export const fetchPlaceRewards = placeId =>
  find(PLACE_REWARDS_SCHEMA, undefined, {
    query: {
      'filter[place.id]': placeId,
    },
  });

/**
 * Fetches transactions from server to refresh local state.
 *
 * @param cardId Loyalty card ID
 */
export const fetchRules = () => find(RULES_SCHEMA, undefined, {});

/**
 * Fetches transactions from server to refresh local state.
 *
 * @param cardId Loyalty card ID
 */
export const fetchTransactions = cardId =>
  find(TRANSACTIONS_SCHEMA, undefined, {
    query: {
      'filter[card]': cardId,
    },
  });

/**
 * Creates a transaction.
 *
 * @param attributes - Transaction attributes, such as as card, reward type or transaction data.
 * @param pin - Cashier pin
 *
 */
export const createTransaction = (attributes, authorization) => {
  return (dispatch, getState) => {
    const { authorizationType, cardId } = authorization;

    const { legacyId: userId } = getUser(getState());

    const data =
      authorization.data || (authorizationType === 'userId' && { userId });

    const item = {
      type: TRANSACTIONS_SCHEMA,
      attributes: {
        authorizations: [
          {
            authorizationType,
            data,
          },
        ],
        ...attributes,
        card: cardId || getCardId(getState()),
      },
    };

    const config = { ...requestConfig, schema: TRANSACTIONS_SCHEMA };

    return dispatch(create(config, item)).then(response =>
      _.get(response, 'payload.data.attributes.transactionData'),
    );
  };
};

/**
 * Verifies cashier PIN on specified location.
 *
 * @param pin - Cashier PIN
 * @param placeId - Place Id
 */
export const verifyPin = (pin, placeId) => {
  const item = [
    {
      type: AUTHORIZATIONS_SCHEMA,
      attributes: {
        authorizationType: 'pin',
        data: {
          pin,
          location: placeId,
        },
      },
    },
  ];

  const config = { ...requestConfig, schema: AUTHORIZATIONS_SCHEMA };

  return create(config, item);
};

export default preventStateRehydration(
  combineReducers({
    card: resource(CARD_SCHEMA),
    cashierInfo: resource(CASHIERS_SCHEMA),
    allCardStates: collection(CARD_STATE_SCHEMA),
    cardStates: storage(CARD_STATE_SCHEMA),
    punchCards: storage(PUNCH_REWARDS_SCHEMA),
    allPunchCards: cmsCollection(PUNCH_REWARDS_SCHEMA),
    allLocations: cmsCollection(PLACES_SCHEMA),
    locations: storage(PLACES_SCHEMA),
    allPlaceRewards: collection(PLACE_REWARDS_SCHEMA),
    placeRewards: storage(PLACE_REWARDS_SCHEMA),
    pointRewards: storage(POINT_REWARDS_SCHEMA),
    allPointRewards: cmsCollection(POINT_REWARDS_SCHEMA),
    rules: storage(RULES_SCHEMA),
    allRules: collection(RULES_SCHEMA),
    transactions: storage(TRANSACTIONS_SCHEMA),
    allTransactions: collection(TRANSACTIONS_SCHEMA),
  }),
);
