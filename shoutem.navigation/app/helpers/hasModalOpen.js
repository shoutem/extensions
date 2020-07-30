import { getActiveNavigationStack } from '../redux/core/selectors';
import { MODAL_SCREEN } from '../redux/modal';

export default function hasModalOpen(state) {
  return getActiveNavigationStack(state).name === MODAL_SCREEN;
}
