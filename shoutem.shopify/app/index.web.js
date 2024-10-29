// Constants `screens` and `reducer` are exported via named export
// It is important to use those exact names

import UnavailableInWebScreen from 'shoutem.application/screens/UnavailableInWebScreen';
import './navigation';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/checkout/CheckoutScreen';
import WebCheckoutScreen from './screens/checkout/WebCheckoutScreen';
import EditAddressScreen from './screens/EditAddressScreen';
import OrderDetailsScreen from './screens/OrderDetailsScreen';
import ProductDetailsScreen from './screens/ProductDetailsScreen';
import ProductsGridScreen from './screens/ProductsGridScreen';
import ProductsListScreen from './screens/ProductsListScreen';
import ProductsScreen from './screens/ProductsScreen';
import SearchProductsScreen from './screens/SearchProductsScreen';
import SelectAddressScreen from './screens/SelectAddressScreen';
import UpdateItemScreen from './screens/UpdateItemScreen';
import enTranslations from './translations/en.json';
import { actions, middleware, reducer } from './redux';

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
  CustomerAddressScreen: UnavailableInWebScreen,
  SearchProductsScreen,
  ProductDetailsScreen,
  UpdateItemScreen,
  CheckoutScreen,
  WebCheckoutScreen,
  SelectAddressScreen,
  EditAddressScreen,
  OrderDetailsScreen,
  OrderHistoryScreen: UnavailableInWebScreen,
};

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { appDidMount, appWillUnmount } from './app';

export { actions, middleware, reducer };
