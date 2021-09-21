import { navigateTo } from 'shoutem.navigation';
import { ext } from '../const';

// Define your actions here

// Shoutem specified actions

export function openPlacesList() {
  return navigateTo(ext('IconPlacesList'));
}
