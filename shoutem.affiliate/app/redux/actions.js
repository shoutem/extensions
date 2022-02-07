import { create, find } from '@shoutem/redux-io';
import { getExtensionSettings } from 'shoutem.application';
import { getUser } from 'shoutem.auth';
import { ext } from '../const';
import { shoutemApi } from '../services';
import { showError } from '../services/errors';
import { getCardId } from './selectors';

export const CARD_SCHEMA = 'shoutem.loyalty.cards';
export const CARD_STATE_SCHEMA = 'shoutem.loyalty.card-states';

export const SET_CARD_ID = 'SET_CARD_ID';
export const SET_CARD_POINTS = 'SET_CARD_POINTS';
export const SET_LOADING = 'SET_LOADING';

function setCardId(payload) {
  return {
    type: SET_CARD_ID,
    payload,
  };
}

function setCardPoints(payload) {
  return {
    type: SET_CARD_POINTS,
    payload,
  };
}

function setLoading(payload) {
  return {
    type: SET_LOADING,
    payload,
  };
}

function resolveRequestHeaders(isPostRequest = false) {
  return {
    headers: {
      Accept: 'application/vnd.api+json',
      ...(isPostRequest && { 'Content-Type': 'application/vnd.api+json' }),
    },
  };
}

function createProgramEndpoint(programId) {
  return shoutemApi.buildLoyaltyUrl(`/v1/programs/${programId}`);
}

function createCardEndpoint(programId, params = '') {
  const programEndpoint = createProgramEndpoint(programId);

  return `${programEndpoint}/cards/${params}`;
}

function createCardStateEndpoint(programId, cardId) {
  const programEndpoint = createProgramEndpoint(programId);

  return `${programEndpoint}/cards/${cardId}/state?filter[cardType]=point`;
}

export const createCardForUser = (userId, endpoint) => {
  return dispatch => {
    const newCard = {
      type: CARD_SCHEMA,
      attributes: {
        user: { id: `${userId}` },
      },
    };

    const config = {
      request: {
        endpoint,
        ...resolveRequestHeaders(true),
      },
      schema: CARD_SCHEMA,
    };

    return dispatch(create(config, newCard));
  };
};

export const fetchCard = endpoint => {
  const config = {
    request: {
      endpoint,
      ...resolveRequestHeaders(),
    },
    schema: CARD_SCHEMA,
  };

  return find(config);
};

export const fetchCardState = endpoint => async dispatch => {
  const config = {
    request: {
      endpoint,
      ...resolveRequestHeaders(),
    },
    schema: CARD_STATE_SCHEMA,
  };

  try {
    const response = await dispatch(find(config));
    const points = response.payload.data[0]?.attributes.points ?? 0;

    return dispatch(setCardPoints(points));
  } catch (e) {
    return showError();
  }
};

/**
 * Refreshes the loyalty card for the logged in user.
 * If it doesn't exist, creates a new one.
 */
export const refreshCard = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { legacyId: userId } = getUser(state);

    const settings = getExtensionSettings(state, ext());
    const {
      program: { id: programId },
    } = settings;

    const params = `user:${userId}`;
    const fetchEndpoint = createCardEndpoint(programId, params);
    const createEndpoint = createCardEndpoint(programId);

    return dispatch(fetchCard(fetchEndpoint))
      .then(({ payload: { data } }) => dispatch(setCardId(data.id)))
      .catch(() =>
        dispatch(
          createCardForUser(userId, createEndpoint),
        ).then(({ payload: { data } }) => dispatch(setCardId(data.id))),
      );
  };
};

export const refreshCardState = () => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));

    const state = getState();
    const settings = getExtensionSettings(state, ext());
    const {
      program: { id: programId },
    } = settings;

    try {
      await dispatch(refreshCard());

      const cardId = getCardId(getState());
      const stateEndpoint = createCardStateEndpoint(programId, cardId);

      return dispatch(fetchCardState(stateEndpoint));
    } catch (e) {
      showError();
      return dispatch(setLoading(false));
    }
  };
};

export function loadLevels(channelId, parentCategoryId) {
  return dispatch =>
    dispatch(
      find(ext('levels'), undefined, {
        query: {
          'filter[categories]': parentCategoryId,
          'filter[channels]': channelId,
        },
      }),
    );
}
