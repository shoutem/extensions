import _ from 'lodash';
import { images } from '../assets';

export function getCurrentItem(item) {
  // TODO: featured item is received as array, bug with @shoutem/ui
  return Array.isArray(item) ? item[0] : item;
}

export function getProductPrices(product) {
  const { price, compareAtPrice: oldPrice } = product.variants[0];

  return { price, oldPrice };
}

export function getProductImage(productImages) {
  if (!_.isEmpty(productImages) && productImages[0].url) {
    return { uri: productImages[0].url };
  }

  return images.fallback;
}
