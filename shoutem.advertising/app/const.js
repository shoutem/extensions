import { MAIN_NAVIGATION_SCREEN_TYPES } from 'shoutem.navigation';
import pack from './package.json';

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const EXCLUDED_SCREENS = [
  ...MAIN_NAVIGATION_SCREEN_TYPES,
  'root_layout',
  'shoutem.about.ClearNavbarMediumAboutScreen',
  'shoutem.about.AboutScreen',
  'shoutem.rss-news.ArticleDetailsScreen',
  'shoutem.rss-news.ArticleMediumDetailsScreen',
  'shoutem.sendbird.ChatWindowScreen',
  'shoutem.social.CreateStatusScreen',
  'shoutem.social.StatusDetailsScreen',
  'shoutem.books.BooksDetailsScreen',
  'shoutem.people.PeopleDetailsScreen',
  'shoutem.news.ArticleDetailsScreen',
  'shoutem.news.ClearNavbarMediumArticleDetailsScreen',
  'shoutem.deals.LargeDealDetailsScreen',
  'shoutem.deals.MediumDealDetailsScreen',
  'shoutem.wordpress.ArticleDetailsScreen',
  'shoutem.wordpress.ArticleMediumDetailsScreen',
  'shoutem.page.ClearNavbarLargePageScreen',
  'shoutem.page.ClearNavbarMediumPageScreen',
  'shoutem.events.EventDetailsScreen',
  'shoutem.events.ClearNavbarMediumEventDetailsScreen',
  'shoutem.places.MediumPlaceDetails',
  'shoutem.places.PlaceDetails',
  'shoutem.agora.VideoCallScreen',
  'shoutem.radio-player.Radio',
  'shoutem.photos.PhotoDetailsScreen',
  'shoutem.rss-photos.PhotoDetails',
];
