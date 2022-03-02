import { registerIcons } from '@shoutem/ui';
import { images } from './assets';

export function appDidMount() {
  const iconConfig = [
    {
      name: 'ginger-cart',
      icon: images.cart,
    },
    {
      name: 'ginger-phone',
      icon: images.phone,
    },
    {
      name: 'button-success',
      icon: images.buttonSuccess,
    },
    {
      name: 'button-error',
      icon: images.buttonError,
    },
    {
      name: 'ginger-stop',
      icon: images.stop,
    },
    {
      name: 'ginger-warning',
      icon: images.warning,
    },
    {
      name: 'ginger-pins',
      icon: images.pins,
    },
    {
      name: 'ginger-clock',
      icon: images.clock,
    },
  ];

  registerIcons(iconConfig);
}
