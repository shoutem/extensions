import './navigation';
import AssignPointsScreen from './screens/AssignPointsScreen';
import FavoritesListScreen from './screens/FavoritesListScreen';
import NoProgramScreen from './screens/NoProgramScreen';
import PinVerificationScreen from './screens/PinVerificationScreen';
import { PlacesListScreen } from './screens/places';
import GaugeRewardsPlaceDetails from './screens/places/GaugeRewardsPlaceDetails';
import LargeImageGaugeRewardsPlaceDetails from './screens/places/LargeImageGaugeRewardsPlaceDetails';
import NoImageGaugeRewardsPlaceDetails from './screens/places/NoImageGaugeRewardsPlaceDetails';
import PlaceDetails from './screens/places/PlaceDetails';
import SinglePlaceMap from './screens/places/SinglePlaceMap';
import PointsCardScreen from './screens/PointsCardScreen';
import PointsEarnedScreen from './screens/PointsEarnedScreen';
import PointsHistoryScreen from './screens/PointsHistoryScreen';
import PointsSmallCardScreen from './screens/PointsSmallCardScreen';
import PunchCardListScreen from './screens/PunchCardListScreen';
import RedeemOrContinueScreen from './screens/RedeemOrContinueScreen';
import RewardDetailsScreen from './screens/RewardDetailsScreen';
import RewardsListScreen from './screens/RewardsListScreen';
import RewardsProgressScreen from './screens/RewardsProgressScreen';
import StampCardScreen from './screens/StampCardScreen';
import TransactionProcessedScreen from './screens/TransactionProcessedScreen';
import VerificationScreen from './screens/VerificationScreen';
import enTranslations from './translations/en.json';
import reducer from './redux';

export { reducer };

export const screens = {
  PointsCardScreen,
  PointsSmallCardScreen,
  PunchCardListScreen,
  StampCardScreen,
  PinVerificationScreen,
  AssignPointsScreen,
  PointsEarnedScreen,
  RedeemOrContinueScreen,
  RewardsListScreen,
  RewardsProgressScreen,
  RewardDetailsScreen,
  TransactionProcessedScreen,
  PointsHistoryScreen,
  PlacesListScreen,
  PlaceDetails,
  GaugeRewardsPlaceDetails,
  LargeImageGaugeRewardsPlaceDetails,
  NoImageGaugeRewardsPlaceDetails,
  SinglePlaceMap,
  NoProgramScreen,
  FavoritesListScreen,
  VerificationScreen,
};

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { appDidMount } from './app';
export { CARD_SCHEMA } from './const';
export { refreshCard, refreshCardState } from './services';
