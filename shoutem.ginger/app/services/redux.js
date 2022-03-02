export const API_STATUSES = {
  LOADING: 'LOADING',
  ERROR: 'ERROR',
  IDLE: 'IDLE',
  SUCCESS: 'SUCCESS',
};

const initialStatusReducerState = {
  data: [],
  status: API_STATUSES.IDLE,
  error: null,
};

export function createRSAAStatusTypes(baseAction) {
  if (!baseAction) {
    return ['REQUEST', 'SUCCESS', 'FAILURE'];
  }

  return [
    `${baseAction}_REQUEST`,
    `${baseAction}_SUCCESS`,
    `${baseAction}_ERROR`,
  ];
}

export function createStatusReducer(statusTypes) {
  return (state = initialStatusReducerState, action) => {
    if (action.type === statusTypes[0]) {
      return {
        ...state,
        status: API_STATUSES.LOADING,
      };
    }

    if (action.type === statusTypes[1]) {
      return {
        ...state,
        data: action.payload,
        status: API_STATUSES.SUCCESS,
        error: null,
      };
    }

    if (action.type === statusTypes[2]) {
      return {
        ...state,
        status: API_STATUSES.ERROR,
        error: action.payload,
      };
    }

    return state;
  };
}

export function getCollectionStatus(collection) {
  return collection.status;
}

export function getCollectionError(collection) {
  return collection.error;
}

export function getCollectionData(collection) {
  return collection.data;
}

export function isLoading(collection) {
  const collectionStatus = getCollectionStatus(collection);

  return collectionStatus === API_STATUSES.LOADING;
}

export function isError(collection) {
  const collectionStatus = getCollectionStatus(collection);

  return collectionStatus === API_STATUSES.ERROR;
}

export function asPromise(action) {
  return new Promise((resolve, reject) => {
    action().then(result => {
      if (result.error) {
        return reject(result.payload);
      }

      return resolve(result);
    });
  });
}
