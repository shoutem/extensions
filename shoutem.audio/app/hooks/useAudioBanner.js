import { useCallback } from 'react';
import { LayoutAnimation } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getBannerShown, setBannerShown } from '../redux';

/**
 * Manages the display state of audio banner, depending on respective Redux state.
 * Provides functions to show or hide audio banner, as well as shown state
 */
export const useAudioBanner = () => {
  const dispatch = useDispatch();

  const isShown = useSelector(getBannerShown);

  const show = useCallback(
    () => {
      LayoutAnimation.easeInEaseOut();
      dispatch(setBannerShown(true));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const dismiss = useCallback(() => {
    LayoutAnimation.easeInEaseOut();
    dispatch(setBannerShown(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isShown,
    show,
    dismiss,
  };
};
