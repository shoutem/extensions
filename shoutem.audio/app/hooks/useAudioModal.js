import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getActiveSource } from '../redux';

export const useAudioModal = () => {
  const activeSource = useSelector(getActiveSource);

  const [isShown, setShown] = useState(false);

  const show = () => setShown(true);
  const dismiss = () => setShown(false);

  useEffect(() => {
    if (activeSource.url) {
      show();
    }
  }, [activeSource.url]);

  return {
    isShown,
    show,
    dismiss,
  };
};
