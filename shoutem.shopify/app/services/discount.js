/**
 * Determines if the discount for the Shopify item should be shown
 *
 * On iOS based builds the Shopify SDK returns incorrect values for discounts,
 * it should return an undefined value when there is no discount, but it returns
 * the same price or higher
 *
 * @param item Shopify item
 * @returns {boolean} true if discount is correct and should be show, otherwise false
 */
export function shopItemHasDiscount(item) {
  const { minimum_price, minimum_compare_at_price } = item;

  return parseInt(minimum_price, 10) < parseInt(minimum_compare_at_price, 10);
}

/**
 * Determines if the discount for the Shopify item variant should be shown
 *
 * On iOS based builds the Shopify SDK returns incorrect values for discounts,
 * it should return an undefined value when there is no discount, but it returns
 * the same price or higher
 *
 * @param variant Shopify item variant
 * @returns {boolean} true if discount is correct and should be show, otherwise false
 */
export function shopItemVariantHasDisount(variant) {
  const { price, compare_at_price } = variant;

  return parseInt(price, 10) < parseInt(compare_at_price, 10);
}
