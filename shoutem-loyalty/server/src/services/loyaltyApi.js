import Uri from 'urijs';

const LoyaltyApi = {};

export function initLoyaltyApi(apiEndpoint) {
  LoyaltyApi.apiEndpoint = apiEndpoint;
}

export function loyaltyApi(path = '', query = {}) {
  if (!LoyaltyApi.apiEndpoint) {
    throw new Error('Cannot connect to loyalty: apiEndpoint missing from extension settings.');
  }

  return new Uri()
    .protocol(location.protocol)
    .host(LoyaltyApi.apiEndpoint)
    .path(path)
    .query(query)
    .toString();
}
