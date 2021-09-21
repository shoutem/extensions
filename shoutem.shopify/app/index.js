// Constants `screens` and `reducer` are exported via named export
// It is important to use those exact names

import CartScreen from './screens/CartScreen.js';
import ProductsGridScreen from './screens/ProductsGridScreen.js';
import ProductsListScreen from './screens/ProductsListScreen.js';
import SearchProductsScreen from './screens/SearchProductsScreen.js';
import ProductDetailsScreen from './screens/ProductDetailsScreen.js';
import UpdateItemScreen from './screens/UpdateItemScreen.js';

import CheckoutScreen from './screens/checkout/CheckoutScreen';
import WebCheckoutScreen from './screens/checkout/WebCheckoutScreen';

import enTranslations from './translations/en.json';

import './navigation';
import { actions, reducer } from './redux';

export const screens = {
  CartScreen,
  ProductsFeaturedGridScreen: ProductsGridScreen,
  ProductsGridScreen,
  ProductsFeaturedTallGridScreen: ProductsGridScreen,
  ProductsTallGridScreen: ProductsGridScreen,
  ProductsFeaturedListScreen: ProductsListScreen,
  ProductsListScreen,
  SearchProductsScreen,
  ProductDetailsScreen,
  UpdateItemScreen,
  CheckoutScreen,
  WebCheckoutScreen,
};

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { appDidMount } from './app';

export { actions, reducer };
