import LoyaltyApi from './loyaltyApi';

import ShoutemUrls from './shoutemUrls';
const loyaltyApi = new LoyaltyApi();
const getLoyaltyUrl = loyaltyApi.getUrl;
const shoutemUrls = new ShoutemUrls();

export { getErrorCode } from './errors';

export { loyaltyApi, getLoyaltyUrl, shoutemUrls };

export { getProgramId, initializeApiEndpoints } from './settings';

export { createSelectOptions } from './selectOptions';
