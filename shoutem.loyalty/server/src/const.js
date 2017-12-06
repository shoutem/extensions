import pack from '../package.json';

export default function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const LOYALTY_TYPES = {
  POINTS: 'points',
  PUNCH: 'punch',
  MULTI: 'multi',
};
