export function getDiscount(price, originalPrice) {
  return Math.round((100 * (price - originalPrice)) / originalPrice);
}
