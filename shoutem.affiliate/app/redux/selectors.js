import _ from 'lodash';
import { createSelector } from 'reselect';
import { getExtensionSettings } from 'shoutem.application';
import { getUser } from 'shoutem.auth';
import { ext } from '../const';
import { formatShareMessage } from '../services';

export const getAffiliateState = state => state[ext()];

export const getCardState = state => getAffiliateState(state).card;

export const getCardId = state => getCardState(state).cardId;

export const getCardPoints = state => getCardState(state).points;

export const getLoading = state => getCardState(state).loading;

export const getAllCardStates = state => getAffiliateState(state).allCardStates;

export function getLevelsData(state) {
  return state[ext()].levels || [];
}

export const getLevels = createSelector([getLevelsData], levels =>
  _.map(levels, level => ({
    id: level.attributes?.uuid,
    pointsRequired: level.attributes?.numberOfPoints,
  })),
);

export function getShareMessage(state) {
  const settings = getExtensionSettings(state, ext());
  const { shareMessage } = settings;

  const user = getUser(state);
  const username = user?.profile?.nick;

  return formatShareMessage(shareMessage, username);
}

export function getCollectMessage(state) {
  const settings = getExtensionSettings(state, ext());
  const collectPhoneNumber = settings?.collectPhoneNumber;
  const { collectMessage } = settings;

  const user = getUser(state);
  const username = user?.profile?.nick;

  return {
    collectPhoneNumber,
    collectMessage: formatShareMessage(collectMessage, username),
  };
}
