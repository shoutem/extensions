import PointsCardScreen from './screens/PointsCardScreen';
import PunchCardListScreen from './screens/PunchCardListScreen';
import StampCardScreen from './screens/StampCardScreen';
import VerificationScreen from './screens/VerificationScreen';
import AssignPointsScreen from './screens/AssignPointsScreen';
import PointsEarnedScreen from './screens/PointsEarnedScreen';
import RedeemOrContinueScreen from './screens/RedeemOrContinueScreen';
import TransactionProcessedScreen from './screens/TransactionProcessedScreen';
import RewardsListScreen from './screens/RewardsListScreen';
import RewardDetailsScreen from './screens/RewardDetailsScreen';
import PointsHistoryScreen from './screens/PointsHistoryScreen';

import reducer from './redux';

export {
  reducer,
};

export const screens = {
  PointsCardScreen,
  PunchCardListScreen,
  StampCardScreen,
  VerificationScreen,
  AssignPointsScreen,
  PointsEarnedScreen,
  RedeemOrContinueScreen,
  RewardsListScreen,
  RewardDetailsScreen,
  TransactionProcessedScreen,
  PointsHistoryScreen,
};

export { appDidMount } from './app';
