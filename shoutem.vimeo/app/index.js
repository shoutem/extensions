import reducer from './redux';
import { appDidMount } from './app';

import VimeoList from './screens/VimeoList';
import SmallVimeoList from './screens/SmallVimeoList';
import VimeoDetails from './screens/VimeoDetails';

const screens = {
  VimeoList,
  SmallVimeoList,
  VimeoDetails,
};

export { reducer };

export {
  appDidMount,
  screens,
};
