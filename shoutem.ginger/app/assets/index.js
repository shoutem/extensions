/* eslint-disable global-require */
import ButtonError from './buttonError.svg';
import ButtonSuccess from './buttonSuccess.svg';
import Cart from './cart.svg';
import Clock from './clock.svg';
import Phone from './phone.svg';
import Pins from './pins.svg';
import Stop from './stop.svg';
import Warning from './warning.svg';

export const images = {
  cart: Cart,
  phone: Phone,
  add: require('./add.png'),
  addCompact: require('./addCompact.png'),
  age: require('./age.png'),
  remove: require('./remove.png'),
  removeCompact: require('./removeCompact.png'),
  close: require('./close.png'),
  present: require('./present.png'),
  arrowRight: require('./arrowRight.png'),
  arrowLeft: require('./arrowLeft.png'),
  note: require('./note.png'),
  infoSecondary: require('./infoSecondary.png'),
  house: require('./house.png'),
  location: require('./location.png'),
  emptyCart: require('./emptyCart.png'),
  emptyOrders: require('./emptyOrders.png'),
  backgroundImage: require('./backgroundImage.png'),
  buttonError: ButtonError,
  buttonSuccess: ButtonSuccess,
  stop: Stop,
  warning: Warning,
  pins: Pins,
  clock: Clock,
};

export const animations = {
  storeLoading: require('./storeLoading.json'),
  buttonLoading: require('./buttonLoading.json'),
};
