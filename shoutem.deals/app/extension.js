// This file is managed by Shoutem CLI
// It exports screens and themes from extension.json
// You should not change it manually

// screens imports
import DealsScreen from './screens/DealsScreen';
import DealDetailsScreen from './screens/DealDetailsScreen';
import DealsGridScreen from './screens/DealsGridScreen';
import DealsListScreen from './screens/DealsListScreen';
import LargeDealDetailsScreen from './screens/LargeDealDetailsScreen';
import MediumDealDetailsScreen from './screens/MediumDealDetailsScreen';
import MyDealsScreen from './screens/MyDealsScreen';

export const screens = {
  DealsScreen,
  DealDetailsScreen,
  DealsGridScreen,
  DealsListScreen,
  FeaturedDealsGridScreen: DealsGridScreen,
  FeaturedDealsListScreen: DealsListScreen,
  LargeDealDetailsScreen,
  MediumDealDetailsScreen,
  MyDealsScreen,
};
