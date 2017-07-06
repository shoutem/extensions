import { combineReducers } from 'redux';
import _ from 'lodash';

import { Alert } from 'react-native';

import {
  collection,
  create,
  getOne,
  find,
  invalidate,
  storage,
  one,
 } from '@shoutem/redux-io';

import { preventStateRehydration } from '@shoutem/core/preventStateRehydration';
import { navigateTo } from '@shoutem/core/navigation';

import {
  getAppId,
} from 'shoutem.application';

import { getUser } from 'shoutem.auth';

import {
  AUTHORIZATIONS_SCHEMA,
  CARD_SCHEMA,
  CARD_STATE_SCHEMA,
  ext,
  CMS_PUNCHCARDS_SCHEMA,
  CMS_REWARDS_SCHEMA,
  PUNCHCARDS_SCHEMA,
  REWARDS_SCHEMA,
  TRANSACTIONS_SCHEMA,
} from './const';

const requestConfig = {
  request: {
    headers: {
      'Content-Type': 'application/vnd.api+json',
    },
  },
};

/**
 * Returns true if the reward can be redeemed, false otherwise
 */
export const canRedeem = ({ points = 0, pointsRequired }) => points >= pointsRequired;

/**
 * Returns true if the reward is a punch card, false otherwise
 */
export const isPunchCard = reward => reward && !_.has(reward, 'numberOfRewards');

const showTransactionError = (message) => {
  Alert.alert(
  'Error',
    message,
  );
};

/**
 * Fetches the loyalty card for the logged in user. If it doesn't exist, creates a new one.
 */
export const refreshCard = () => {
  return (dispatch, getState) => {
    const user = getUser(getState());
    const { id } = user;

    dispatch(find(CARD_SCHEMA, undefined, { user: `/user:${id}` }))
    .catch(() => {
      const newCard = {
        type: CARD_SCHEMA,
        attributes: {
          user: { id: `${id}` },
        },
      };

      const config = {
        request: {
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        },
        schema: CARD_SCHEMA,
      };

      dispatch(create(config, newCard, { user: '' }));
    });
  };
};

/**
 * Creates a loyalty transaction. Navigates the user to a result screen on success.
 * A punch card reward can be stamped or redeemed. A regular eward can only be redeemed.
 *
 * If this is a redeeming transaction, points are negative. Their value is equal to points
 * required to redeem a reward.
 *
 * @param data - Transaction data, such as amount spent or whether this was a purchase or visit.
 * @param pin - Cashier pin
 * @param reward - An optional reward.
 *
 */
export const createTransaction = (data, pin, reward) => {
  return (dispatch, getState) => {
    const state = getState();
    const { card: cardState } = state[ext()];
    const { id: card } = getOne(cardState, state);

    const { points } = data;

    const item = {
      type: TRANSACTIONS_SCHEMA,
      attributes: {
        authorizations: [{
          authorizationType: 'pin',
          data: {
            pin,
          },
        }],
        card,
        [isPunchCard(reward) ? 'punchReward' : 'pointReward']: reward && reward.id,
        transactionData: {
          cms: {
            appId: getAppId(),
            schema: isPunchCard(reward) ? CMS_PUNCHCARDS_SCHEMA : CMS_REWARDS_SCHEMA,
            category: reward && reward.parentCategoryId,
          },
          ...data,
        },
      },
    };

    const config = { ...requestConfig, schema: TRANSACTIONS_SCHEMA };

    dispatch(create(config, item)).then(({ payload: { data: { attributes } } }) => {
      const { points: awardedPoints } = attributes.transactionData;

      dispatch(processTransactionResults(data, reward, points, awardedPoints, pin));
    })
    .catch(({ payload }) => {
      const { errors } = payload.response;

      showTransactionError(errors[0].detail);
    });
  };
};

/**
 * Processes transaction results and takes the user to a result screen.
 * If there was a reward in the transaction, this screen shows that it was redeemed
 * or that a punch card was stamped.
 *
 * If there was no reward, the user is taken to a screen where he can see how much
 * points he earned on his regular loyalty card.
 *
 * If the reward is a punch card, lets the user choose if he wants to redeem it
 * right away.
 *
 * The action invalidates the punch card or card state schema based on transaction type.
 *
 * @param data - Transaction data, such as amount spent
 * @param reward - An optional reward
 * @param points - Points included in the transaction, if any
 * @param awardedPoints - Points awarded after a transaction based on visit or amount spent
 * @param pin - The PIN number used in the transaction
 *
 */
export const processTransactionResults = (data, reward, points, awardedPoints, pin) => {
  return (dispatch) => {
    const schemaToInvalidate = isPunchCard(reward) ? PUNCHCARDS_SCHEMA : CARD_STATE_SCHEMA;

    dispatch(invalidate(schemaToInvalidate));

    // If the reward is a punch card and this transaction made it eligible for redemption,
    // ask the user if he wants to redeem it
    if (isPunchCard(reward)) {
      const { points: originalPoints = 0, pointsRequired } = reward;

      const canRedeem = (points + originalPoints) >= pointsRequired;

      if (canRedeem) {
        dispatch(navigateTo({
          screen: ext('RedeemOrContinueScreen'),
          props: {
            pin,
            reward,
            points,
          },
        }));

        return;
      }
    }

    dispatch(navigateTo({
      screen: ext(`${reward ? 'TransactionProcessedScreen' : 'PointsEarnedScreen'}`),
      props: {
        data,
        points: points || awardedPoints,
        redeemed: points < 0,
      },
    }));
  };
};

/**
 * Verifies cashier PIN.
 *
 * @param pin - Cashier PIN
 */
export const verifyPin = (pin) => {
  return (dispatch) => {
    const item = [{
      type: AUTHORIZATIONS_SCHEMA,
      attributes: {
        authorizationType: 'pin',
        data: {
          pin,
        },
      },
    }];

    return dispatch(create(AUTHORIZATIONS_SCHEMA, item));
  };
};

export default preventStateRehydration(
  combineReducers({
    card: one(CARD_SCHEMA, ''),
    cards: storage(CARD_SCHEMA),
    cardState: one(CARD_STATE_SCHEMA, ''),
    cardStates: storage(CARD_STATE_SCHEMA),
    punchCards: storage(PUNCHCARDS_SCHEMA),
    allPunchCards: collection(PUNCHCARDS_SCHEMA),
    rewards: storage(REWARDS_SCHEMA),
    allRewards: collection(REWARDS_SCHEMA),
    transactions: storage(TRANSACTIONS_SCHEMA),
    allTransactions: collection(TRANSACTIONS_SCHEMA),
  }));
