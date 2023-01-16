import _ from 'lodash';
import { formatPrice } from './currency';

const FINANCIAL_STATUS = {
  PAID: 'PAID',
};

const ORDERS_PRICE_FIELDS = {
  SUBTOTAL: 'currentSubtotalPrice',
  SHIPPING: 'totalShippingPriceV2',
  TOTAL: 'totalPriceV2',
};

export function isOrderPaid(financialStatus) {
  return financialStatus === FINANCIAL_STATUS.PAID;
}

export function getOrderCoverImage(order) {
  return _.get(order, 'lineItems[0].variant.image.url');
}

export function formatOrderStatus(status) {
  return _.capitalize(status);
}

/**
 * @param {array} Orders
 * @returns Orders object with shape { [orderNumber]: order }
 */
export function mapOrdersToState(orders, existingOrders) {
  return _.reduce(
    orders,
    (result, currentOrder) => {
      if (result[currentOrder.orderNumber]) {
        return {
          ...result,
          [currentOrder.orderNumber]: {
            ...result[currentOrder.orderNumber],
            ...currentOrder,
          },
        };
      }

      return { ...result, [currentOrder.orderNumber]: currentOrder };
    },
    existingOrders,
  );
}

/**
 * @param {array} Orders
 * @returns Orders with currency amounts mapped to their proper display text
 *          using money format value from current shop
 */
export function normalizeOrderPrices(orders, currencyFormatting) {
  return _.reduce(
    orders,
    (result, order) => {
      const updatedOrder = order;

      _.map(ORDERS_PRICE_FIELDS, priceField => {
        const initialValue = updatedOrder[priceField];

        updatedOrder[priceField] = {
          ...initialValue,
          displayValue: formatPrice(
            initialValue.amount,
            initialValue.currencyCode,
            currencyFormatting,
          ),
        };
      });

      _.map(order.lineItems, lineItem => {
        lineItem.discountedTotalPrice = {
          ...lineItem.discountedTotalPrice,
          displayValue: formatPrice(
            lineItem.discountedTotalPrice.amount,
            lineItem.discountedTotalPrice.currencyCode,
            currencyFormatting,
          ),
        };

        lineItem.originalTotalPrice = {
          ...lineItem.originalTotalPrice,
          displayValue: formatPrice(
            lineItem.originalTotalPrice.amount,
            lineItem.originalTotalPrice.currencyCode,
            currencyFormatting,
          ),
        };
      });

      result.push(updatedOrder);

      return result;
    },
    [],
  );
}
