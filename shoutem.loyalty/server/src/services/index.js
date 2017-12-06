import LoyaltyApi from './loyaltyApi';
const loyaltyApi = new LoyaltyApi();
const getLoyaltyUrl = loyaltyApi.getUrl;

import ShoutemUrls from './shoutemUrls';
const shoutemUrls = new ShoutemUrls();

export {
  getErrorCode,
} from './errors';

export {
  loyaltyApi,
  getLoyaltyUrl,
  shoutemUrls,
};

export {
  getProgramId,
  initializeApiEndpoints,
} from './settings';

export {
  createSelectOptions,
} from './selectOptions';
