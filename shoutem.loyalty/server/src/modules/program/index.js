import ProgramSettings from './fragments/program-settings';
import { reducer } from './redux';

export {
  AUTHORIZATIONS,
  CARDS,
  moduleName,
  PLACES,
  PROGRAMS,
  USERS,
} from './const';
export {
  createCard,
  enableLoyalty,
  getCards,
  getCardsByUserId,
  getLoyaltyPlaces,
  getUsers,
  loadCards,
  loadLoyaltyPlaces,
  loadUsers,
} from './redux';
export { ProgramSettings };
export default reducer;
