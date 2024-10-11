import { useState } from 'react';

export const useAudioModal = () => {
  const [isShown, setShown] = useState(false);

  const show = () => setShown(true);
  const dismiss = () => setShown(false);

  return {
    isShown,
    show,
    dismiss,
  };
};
