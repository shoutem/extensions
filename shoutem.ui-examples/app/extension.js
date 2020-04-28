// This file is managed by Shoutem CLI
// You should not change it
import pack from './package.json';
import ButtonsScreen from './screens/ButtonsScreen';
import CardsScreen from './screens/CardsScreen';
import DividersScreen from './screens/DividersScreen';
import DropDownMenusScreen from './screens/DropDownMenusScreen';
import FormsScreen from './screens/FormsScreen';
import HeadersScreen from './screens/HeadersScreen';
import ImageGalleriesScreen from './screens/ImageGalleriesScreen';
import ImagesScreen from './screens/ImagesScreen';
import InlineGalleriesScreen from './screens/InlineGalleriesScreen';
import PagersScreen from './screens/PagersScreen';
import RowsScreen from './screens/RowsScreen';
import SpinnersScreen from './screens/SpinnersScreen';
import TilesScreen from './screens/TilesScreen';
import TypographyScreen from './screens/TypographyScreen';
import VideosScreen from './screens/VideosScreen';

export const screens = {
  ButtonsScreen,
  CardsScreen,
  DividersScreen,
  DropDownMenusScreen,
  FormsScreen,
  HeadersScreen,
  ImageGalleriesScreen,
  ImagesScreen,
  InlineGalleriesScreen,
  PagersScreen,
  RowsScreen,
  SpinnersScreen,
  TilesScreen,
  TypographyScreen,
  VideosScreen
};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
