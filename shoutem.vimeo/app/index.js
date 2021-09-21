import { appDidMount } from './app';
import reducer from './redux';

import SmallVimeoList from './screens/SmallVimeoList';
import VimeoDetails from './screens/VimeoDetails';
import VimeoDetailsWithoutShare from './screens/VimeoDetailsWithoutShare';
import VimeoList from './screens/VimeoList';

const screens = {
  SmallVimeoList,
  VimeoDetails,
  VimeoDetailsWithoutShare,
  VimeoList,
};

export { reducer };

export { appDidMount, screens };
