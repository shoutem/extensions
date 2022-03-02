import _ from 'lodash';

export const TEXT_POSITIONS = {
  TOP: 'top',
  MIDDLE: 'middle',
  BOTTOM: 'bottom',
};

export function resolveTextPositionStyle(option, style) {
  const value = _.get(option, 'value');

  switch (value) {
    case TEXT_POSITIONS.BOTTOM:
      return style.textContainerBottom;
    case TEXT_POSITIONS.MIDDLE:
      return style.textContainerMiddle;
    case TEXT_POSITIONS.TOP:
      return style.textContainerTop;
    default:
      return style.textContainerMiddle;
  }
}

export default {
  resolveTextPositionStyle,
  TEXT_POSITIONS,
};
