import { Alert } from 'react-native';
import _ from 'lodash';

import {
  invalidate,
 } from '@shoutem/redux-io';

import {
  EMPTY_ROUTE,
  navigateTo,
  openInModal,
 } from '@shoutem/core/navigation';

import {
  getAppId,
} from 'shoutem.application';

import { getUser } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';

import {
  createCardForUser,
  fetchCard,
  fetchCardState,
  fetchCashierInfo,
  fetchTransactions,
  getCashierInfo,
  getCardId,
  isPunchCard,
  createTransaction,
} from './redux';

import {
  ext,
  CMS_PUNCHCARDS_SCHEMA,
  REWARDS_SCHEMA,
  PLACE_REWARDS_SCHEMA,
  PUNCH_REWARDS_SCHEMA,
} from './const';

import { getErrorMessage } from './translations';

const showTransactionError = (error) => {
  const errorMessage = getErrorMessage(error.code);

  Alert.alert(
    I18n.t('shoutem.application.errorTitle'),
    errorMessage,
  );
};

/**
 * Refreshes the loyalty card for the logged in user. If it doesn't exist, creates a new one.
 * @returns cardId New card ID
 */
export const refreshCard = () => {
  return (dispatch, getState) => {
    const { legacyId: userId } = getUser(getState());

    return dispatch(fetchCard(userId))
      .catch(() => {
        return dispatch(createCardForUser(userId));
      },
    )
    .then(({ payload: { data } }) => {
      dispatch(fetchCashierInfo(userId));
      return data.id;
    });
  };
};

/**
 * Refreshes point card state
 */
export const refreshCardState = () => {
  return (dispatch, getState) => {
    const cardId = getCardId(getState());

    if (!cardId) {
      return dispatch(refreshCard())
        .then((cardId) => {
          dispatch(fetchCardState(cardId));
        });
    }

    return dispatch(fetchCardState(cardId));
  };
};

/**
 * Refreshes point card transactions
 */
export const refreshTransactions = () => {
  return (dispatch, getState) => {
    const cardId = getCardId(getState());

    if (!cardId) {
      dispatch(refreshCard()).then((cardId) => {
        dispatch(fetchTransactions(cardId));
      });
      return;
    }

    dispatch(fetchTransactions(cardId));
  };
};

/**
 * Helper function to collect points.
 *
 * @param data Activity details such as amount spent
 * @param pin Authorization PIN for transaction
 */
export const collectPoints = (data, authorization, reward) =>
  makeTransaction(data, authorization, reward);

/**
 * Helper function to redeem a reward.
 *
 * @param data Activity details such as amount spent
 * @param pin Authorization PIN for transaction
 * @param reward Reward to redeem
 */
export const redeemReward = (data, authorization, reward) =>
  makeTransaction(data, authorization, reward);

/**
 * Parses a reward from values encoded in QR code.
 * Reward values are encoded in an array to save space.
 */
const getRewardFromEncodedValues = (rewardData) => {
  const [
    id,
    location,
    isPunchCard,
    parentCategoryId,
    points,
    pointsRequired,
    title,
    numberOfRewards,
  ] = rewardData;

  return {
    id,
    location,
    isPunchCard,
    parentCategoryId,
    points,
    pointsRequired,
    title,
    numberOfRewards,
  };
};

/**
 * Authorizes a transaction when a cashier scans a QR code.
 * This can be collecting points or redeeming a reward.
 */
export const authorizeTransactionByQRCode = (dataString) => {
  return (dispatch, getState) => {
    const data = JSON.parse(dataString);

    const [cardId, placeId, rewardData, redeem] = data;

    const reward = rewardData && getRewardFromEncodedValues(rewardData);

    const authorization = { authorizationType: 'userId', placeId, cardId };

    if (redeem) {
      dispatch(openInModal(EMPTY_ROUTE));
      dispatch(redeemReward({ points: -reward.pointsRequired }, authorization, reward));
      return;
    }

    const cashierInfo = getCashierInfo(getState());

    const place = { id: cashierInfo.location };

    dispatch(openInModal(getPostAuthorizationRoute(authorization, place, reward)));
  };
};

/**
 * Authorizes a transaction when a user scans a Barcode to collect points.
 */
export const authorizeTransactionByBarCode = (expression) => dispatch => {
  const authorization = { authorizationType: 'regex', data: { expression } };

  dispatch(createTransaction({ transactionData: {} }, authorization))
  .then(({ points }) => {
    dispatch(openInModal({
      screen: ext('PointsEarnedScreen'),
      props: {
        data: {},
        points,
      },
    }));
  }).catch(({ payload }) => {
    const { errors } = payload.response;
    showTransactionError(errors[0]);
  });
};

/**
 * Helper function that gets schema for reward.
 * We use it to create a transaction on the server.
 *
 * @param reward The reward
 */
const getSchemaForReward = (reward) => {
  if (isPunchCard(reward)) {
    return CMS_PUNCHCARDS_SCHEMA;
  }

  return reward.location ? PLACE_REWARDS_SCHEMA : REWARDS_SCHEMA;
};

/**
 * Makes a loyalty transaction. Navigates the user to a result screen on success.
 * A punch card reward can be stamped or redeemed. A regular reward can only be redeemed.
 *
 * If this is a redeeming transaction, points are negative. Their value is equal to points
 * required to redeem a reward.
 *
 * @param data - Transaction data, such as amount spent or whether this was a purchase or visit.
 * @param pin - Cashier pin
 * @param reward - An optional reward.
 *
 */
export const makeTransaction = (data, authorization, reward) => {
  return (dispatch) => {
    const { points } = data;

    const defaultTransactionData = {
      cms: {
        appId: getAppId(),
        schema: reward && getSchemaForReward(reward),
        category: reward && reward.parentCategoryId,
      },
      rewardName: reward && reward.title,
      ...data,
    };

    const location = _.get(authorization, 'placeId');
    const transactionData = !!location ?
      { ...defaultTransactionData, location } :
      { ...defaultTransactionData };
    const rewardId = _.get(reward, 'id');

    const attributes = isPunchCard(reward) ?
      { punchReward: rewardId, transactionData } :
      { pointReward: rewardId, transactionData };

    dispatch(createTransaction(attributes, authorization))
      .then(({ points: awardedPoints }) => {
        dispatch(processTransactionResults(data, reward, points, awardedPoints, authorization));
      })
      .catch(({ payload }) => {
        const { errors } = payload.response;
        showTransactionError(errors[0]);
      });
  };
};

/**
 * Processes transaction results.
 *
 * The action refreshes the punch cards or single card state based on transaction type.
 *
 * @param data - Transaction data, such as amount spent
 * @param reward - An optional reward
 * @param points - Points included in the transaction, if any
 * @param awardedPoints - Points awarded after a transaction based on visit or amount spent
 * @param pin - The PIN number used in the transaction
 *
 */
export const processTransactionResults = (data, reward, points, awardedPoints, authorization) => {
  return (dispatch) => {
    if (isPunchCard(reward)) {
      dispatch(handlePunchCardTransaction(reward, points, authorization));
      return;
    }

    dispatch(refreshCardState());
    dispatch(refreshTransactions());

    dispatch(navigateToTransactionSummaryScreen(reward, awardedPoints, data));
  };
};

/**
 * Handles punch card transaction. If it has enough points, lets the user choose
 * if he wants to redeem it right away.
 *
 * @param reward - The punch card reward
 * @param points - Punches assigned in the transaction
 * @param pin - The PIN number used in the transaction
 *
 */
const handlePunchCardTransaction = (reward, points, authorization) => {
  return (dispatch) => {
    dispatch(invalidate(PUNCH_REWARDS_SCHEMA));

    const { points: originalPoints = 0, pointsRequired } = reward;

    const canRedeem = (points + originalPoints) >= pointsRequired;

    if (canRedeem) {
      dispatch(navigateToRedeemOrContinueScreen(reward, points, authorization));
      return;
    }
    dispatch(navigateToTransactionSummaryScreen(reward, points));
  };
};

/**
 * Takes the user to screen where he can choose to redeem the reward now or later
 */
const navigateToRedeemOrContinueScreen = (reward, points, authorization) =>
  navigateTo({
    screen: ext('RedeemOrContinueScreen'),
    props: {
      reward,
      points,
      authorization,
    },
  });

const getPostAuthorizationRoute = (authorization, place, reward) => ({
  screen: ext(`${reward ? 'StampCardScreen' : 'AssignPointsScreen'}`),
  props: {
    authorization,
    place,
    reward,
  },
});

export const authorizePointsByPin = (authorization, place, reward) =>
  navigateTo(getPostAuthorizationRoute(authorization, place, reward));

/**
 * Takes the user to a transaction summary screen.
 *
 * If there was a reward in the transaction, this screen shows that it was redeemed
 * or that a punch card was stamped.
 *
 * If there was no reward, the user is taken to a screen where he can see how much
 * points he earned on his regular loyalty card.
 *
 */
const navigateToTransactionSummaryScreen = (reward, points, data) =>
  navigateTo({
    screen: ext(`${reward ? 'TransactionProcessedScreen' : 'PointsEarnedScreen'}`),
    props: {
      data,
      points,
      redeemed: points < 0,
    },
  });
