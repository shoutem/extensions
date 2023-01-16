export function getDiscount(oldPrice, newPrice) {
  return Math.round((100 * (oldPrice - newPrice)) / oldPrice);
}
