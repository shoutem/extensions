import { composeNavigationStyles } from 'shoutem.navigation';
import { VimeoDetails } from './VimeoDetails';

class VimeoDetailsWithoutShare extends VimeoDetails {
  getNavBarProps(video) {
    return {
      ...composeNavigationStyles(['boxing']),
      title: video.title,
    };
  }
}

export default VimeoDetailsWithoutShare;
