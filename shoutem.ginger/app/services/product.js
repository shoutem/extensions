import pluralize from 'pluralize';
import { I18n } from 'shoutem.i18n';
import { ext, THC_CBD_SHARE_UNITS } from '../const';

export function getProductSubtitle(product) {
  const thcShare = I18n.t(ext('thcShare'), {
    prefixAndShare: `${Number(product.THC)}${
      THC_CBD_SHARE_UNITS[product.thcCbdUnit]
    }`,
  });
  const cbdShare = I18n.t(ext('cbdShare'), {
    prefixAndShare: ` • ${Number(product.CBD)}${
      THC_CBD_SHARE_UNITS[product.thcCbdUnit]
    }`,
  });
  const strain = product.strainType ? ` • ${product.strainType}` : '';

  return `${thcShare}${cbdShare}${strain}`;
}

export function centsToDollars(cents) {
  return (cents / 100).toFixed(2);
}

export function getProductPrice(product, count = 1) {
  return `$${centsToDollars(count * product.price)}`;
}

export function getCartProductPrice(product) {
  return `$${centsToDollars(product.price * product.quantity)}`;
}

export function getCartProductOriginPrice(product) {
  return `$${centsToDollars(product.originPrice * product.quantity)}`;
}

export function getProductTotalUnits(product, quantity) {
  const totalCount = quantity * product.unitSize;

  return pluralize(product.unit, totalCount.toFixed(2), true);
}

export function isBonusCartItem(item) {
  return item.isBonus;
}
