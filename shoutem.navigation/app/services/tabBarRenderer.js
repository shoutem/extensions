import { BottomTabBar } from '@react-navigation/bottom-tabs';

let Renderer;

const getRenderer = () => Renderer;

const registerRenderer = renderer => {
  Renderer = renderer;
};

export default {
  ReactNavigationBottomTabBar: BottomTabBar,
  getRenderer,
  registerRenderer,
};
