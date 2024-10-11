import MBBridge from './MBBridge.js';

export default {
  ...MBBridge,
  associateCheckout: () => new Promise((_, reject) => reject()),
  login: () => new Promise((_, reject) => reject()),
  logout: () => new Promise((_, reject) => reject()),
  isLoggedIn: () => new Promise(resolve => resolve(false)),
  refreshToken: () => new Promise((_, reject) => reject()),
  getAccessToken: () => new Promise((_, reject) => reject()),
  createCustomer: () => new Promise((_, reject) => reject()),
  updateCustomer: () => new Promise((_, reject) => reject()),
  getCustomer: () => new Promise((_, reject) => reject()),
  createCustomerAddress: () => new Promise((_, reject) => reject()),
  updateCustomerDefaultAddress: () => new Promise((_, reject) => reject()),
  updateCustomerAddress: () => new Promise((_, reject) => reject()),
  deleteCustomerAddress: () => new Promise((_, reject) => reject()),
  getOrders: () => new Promise((_, reject) => reject()),
  getOrderByOrderName: () => new Promise((_, reject) => reject()),
};
