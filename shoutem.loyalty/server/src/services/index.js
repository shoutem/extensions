import LoyaltyApi from './loyaltyApi';
import ShoutemUrls from './shoutemUrls';
const loyaltyApi = new LoyaltyApi();
const getLoyaltyUrl = loyaltyApi.getUrl;
const shoutemUrls = new ShoutemUrls();

export { getErrorCode } from './errors';

export { getLoyaltyUrl, loyaltyApi, shoutemUrls };

export { createSelectOptions } from './selectOptions';
export { getProgramId, initializeApiEndpoints } from './settings';
