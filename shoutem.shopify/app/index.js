// Constants `screens` and `reducer` are exported via named export
// It is important to use those exact names

import './navigation';
import CartScreen from './screens/CartScreen.js';
import CheckoutScreen from './screens/checkout/CheckoutScreen';
import WebCheckoutScreen from './screens/checkout/WebCheckoutScreen';
import ProductDetailsScreen from './screens/ProductDetailsScreen.js';
import ProductsGridScreen from './screens/ProductsGridScreen.js';
import ProductsListScreen from './screens/ProductsListScreen.js';
import ProductsScreen from './screens/ProductsScreen';
import SearchProductsScreen from './screens/SearchProductsScreen.js';
import UpdateItemScreen from './screens/UpdateItemScreen.js';
import enTranslations from './translations/en.json';
import { actions, reducer, middleware } from './redux';

export const screens = {
  CartScreen,
  ProductsScreen,
  Grid122ProductsScreen: ProductsScreen,
  FixedGridProductsScreen: ProductsScreen,
  FeaturedFixedGridProductsScreen: ProductsScreen,
  MediumListProductsScreen: ProductsScreen,
  FeaturedMediumListProductsScreen: ProductsScreen,
  TileListProductsScreen: ProductsScreen,
  LargeListProductsScreen: ProductsScreen,
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

export { actions, reducer, middleware };
