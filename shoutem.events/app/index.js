import * as extension from './extension.js';
import reducer from './redux';
import enTranslations from './translations/en.json';

const {
  GridEventsScreen,
  EventsScreen,
  MediumEventDetailsScreen,
  LargeEventDetailsScreen,
  SingleEventMapScreen,
} = extension.screens;

export const screens = {
  ...extension.screens,
  EventsScreen: GridEventsScreen,
  FixedGridEventsScreen: GridEventsScreen,
  CompactListEventsScreen: EventsScreen,
  FeaturedCompactListEventsScreen: EventsScreen,
  LargeListEventsScreen: EventsScreen,
  MediumListEventsScreen: EventsScreen,
  FeaturedMediumListEventsScreen: EventsScreen,
  TileListEventsScreen: EventsScreen,
  EventDetailsScreen: LargeEventDetailsScreen,
  SolidNavbarMediumEventDetailsScreen: MediumEventDetailsScreen,
  SolidNavbarLargeEventDetailsScreen: LargeEventDetailsScreen,
  ClearNavbarMediumEventDetailsScreen: MediumEventDetailsScreen,
  SingleEventMapScreen,
};

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};
export { reducer };
