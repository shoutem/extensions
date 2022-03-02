import { useMemo } from 'react';
import _ from 'lodash';
import { centsToDollars } from './product';

export function useCartPriceBreakdown(cart) {
  const productsWithoutTaxes = useMemo(
    () =>
      centsToDollars(
        _.reduce(
          cart.skus,
          (result, product) => {
            return result + product.originPrice * product.quantity;
          },
          0,
        ),
      ),
    [cart],
  );

  const taxesTotal = useMemo(
    () =>
      centsToDollars(
        _.reduce(
          cart.taxes,
          (result, tax) => {
            return result + tax.amount;
          },
          0,
        ),
      ),
    [cart],
  );

  const feesTotal = useMemo(
    () =>
      _.reduce(
        cart.fee,
        (result, fee) => {
          return result + fee.amount;
        },
        0,
      ),
    [cart],
  );

  const isBelowMinimumOrder = useMemo(
    () => cart.originSubtotalPrice < cart.originSubtotalMinimum,
    [cart],
  );

  const totalPrice = useMemo(() => centsToDollars(cart.totalPrice), [cart]);

  const discount = useMemo(
    () => (cart.discount ? centsToDollars(cart.discount) : centsToDollars(0)),
    [cart],
  );

  const totalPriceWithoutDiscount = useMemo(
    () => centsToDollars(cart.subtotalPrice),
    [cart],
  );

  return {
    productsWithoutTaxes,
    feesTotal,
    totalPrice,
    totalPriceWithoutDiscount,
    taxesTotal,
    isBelowMinimumOrder,
    discount,
  };
}
