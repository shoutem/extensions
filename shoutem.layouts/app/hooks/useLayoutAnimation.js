import { useEffect } from 'react';
import { LayoutAnimation } from 'react-native';

export const useLayoutAnimation = (
  dependencies = [],
  animation = 'easeInEaseOut',
) => {
  useEffect(() => {
    LayoutAnimation[animation]();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
