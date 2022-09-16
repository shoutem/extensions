import _ from 'lodash';

/**
 * Method used for properly formatting product price with currency symbol.
 * @param {string} price - Product's price
 * @param {string} currency - Currency symbol
 * @param {string} currencyFormat - String used to format currency value.
 *                                  Consists of `{{amount}}` and currency symbol.
 * @returns Formatted price
 */
export function formatPrice(price, currency, currencyFormat = null) {
  const floatPrice = parseFloat(price);

  if (_.isNumber(floatPrice) && !_.isNaN(floatPrice)) {
    const roundedPrice = floatPrice.toFixed(2);

    if (currencyFormat) {
      return currencyFormat.replace(/{{.*amount.*}}/g, roundedPrice);
    }

    return `${roundedPrice}${currency}`;
  }

  return null;
}
