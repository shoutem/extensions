import {
  authenticateMiddleware,
  restoreUserMiddleware,
  showAgeVerificationMiddleware,
} from './middleware';

export {
  addToCart,
  applyPromoCode,
  cancelOrder,
  completeCheckout,
  completeUserVerification,
  createCustomer,
  createOrder,
  loadCart,
  loadDeliveryTimes,
  loadInventory,
  loadOrders,
  loginUser,
  registerUser,
  removeFromCart,
  resetCart,
  sendVerificationCode,
  setCustomerProfile,
  setVerificationCompleted,
  updateCustomerInfo,
  verifyCode,
} from './actions';
export { INVENTORY_ACTION_TYPES } from './const';
export { default as reducer } from './reducer';
export {
  areOrdersLoading,
  getActiveDiscount,
  getAgeVerificationCompleted,
  getCart,
  getCartItemQuantity,
  getCartListItems,
  getCartProducts,
  getCategories,
  getCategoryItems,
  getCompactCartProducts,
  getCustomerAddress,
  getCustomerPlaceId,
  getCustomerProfile,
  getDeliveryOptions,
  getDeliveryTimes,
  getGingerCustomer,
  getGingerGooglePlacesApiKey,
  getGingerProfile,
  getInitialLoginScreenShown,
  getInventory,
  getOrder,
  getOrderImages,
  getOrdersMonthlySections,
  getRetailersList,
  isCartLoading,
  isInventoryLoading,
} from './selectors';

export const middleware = [
  authenticateMiddleware,
  restoreUserMiddleware,
  showAgeVerificationMiddleware,
];
