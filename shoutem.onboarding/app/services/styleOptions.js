import _ from 'lodash';

export function resolveTextPositionStyle(option, style) {
  const value = _.get(option, 'value');

  switch (value) {
    case 'bottom':
      return style.textContainerBottom;
    case 'middle':
      return style.textContainerMiddle;
    case 'top':
      return style.textContainerTop;
    default:
      return style.textContainerMiddle;
  }
}

export default {
  resolveTextPositionStyle,
};
