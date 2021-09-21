import { ModalScreens } from 'shoutem.navigation';
import PhotoFullScreen from './screens/PhotoFullScreen';
import { ext } from './const';

ModalScreens.registerModalScreens([
  {
    name: ext('PhotoFullScreen'),
    component: PhotoFullScreen,
  },
]);
