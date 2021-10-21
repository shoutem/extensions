import _ from 'lodash';
import Uri from 'urijs';

const BASE_URL = 'reverse.geocoder.ls.hereapi.com';

function buildReverseGeocodingUrl(apiKey, long, lat) {
  const params = {
    prox: `${lat},${long}`,
    mode: 'retrieveAddresses',
    maxresults: 1,
    gen: 9,
    apiKey,
  };

  return new Uri('6.2/reversegeocode.json')
    .protocol('https')
    .host(BASE_URL)
    .query(params)
    .toString();
}

export function fetchUserAddress(apiKey, long, lat) {
  const reverseGeocodingUrl = buildReverseGeocodingUrl(apiKey, long, lat);

  return new Promise((resolve, reject) => {
    fetch(reverseGeocodingUrl)
      .then(response => response.json())
      .then(json => resolve(_.get(json, 'Response.View[0].Result[0].Location.Address')))
      .catch(error => reject());
  })
}
