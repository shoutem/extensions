import currencyFormatter from 'currency-formatter';
import _ from 'lodash';
import appConfiguration from '../../../../config/appConfig.json';

const includedResources = _.get(appConfiguration, 'included');

export const dealsExtensionInstalled = () =>
  _.some(includedResources, {
    type: 'shoutem.core.extensions',
    id: 'shoutem.deals',
  });

export const formatPrice = (price, currency) => {
  const roundedPrice = Number.parseFloat(price).toFixed(2);
  return currencyFormatter.format(roundedPrice, { code: currency });
};
