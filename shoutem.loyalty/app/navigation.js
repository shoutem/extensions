import { ModalScreens } from 'shoutem.navigation';
import { ext } from './const';

ModalScreens.registerModalScreens([
  ext('PointsEarnedScreen'),
  ext('StampCardScreen'),
  ext('AssignPointsScreen'),
  ext('VerificationScreen'),
  ext('PinVerificationScreen'),
  ext('TransactionProcessedScreen'),
]);
