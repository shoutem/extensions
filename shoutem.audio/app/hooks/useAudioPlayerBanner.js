import { useCallback } from 'react';
import { LayoutAnimation } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getAudioPlayerBannerShown, setBannerShown } from '../redux';

export const useAudioPlayerBanner = () => {
  const dispatch = useDispatch();

  const isShown = useSelector(getAudioPlayerBannerShown);

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
