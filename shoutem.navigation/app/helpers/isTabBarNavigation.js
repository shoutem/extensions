import getRootScreen from './getRootScreen';

export default function isTabBarNavigation(state) {
  return getRootScreen(state).canonicalName === 'shoutem.navigation.TabBar';
}
