import { useEffect, useState } from 'react';

export default function useAudioPlay(url) {
  const [audio] = useState(new Audio(url));
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  function toggleAudioPlay() {
    setIsAudioPlaying(!isAudioPlaying);
  }

  useEffect(() => {
    audio.addEventListener('ended', () => setIsAudioPlaying(false));

    return () => {
      audio.removeEventListener('ended', () => setIsAudioPlaying(false));
    };
  }, []);

  useEffect(() => {
    if (isAudioPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isAudioPlaying]);

  return [isAudioPlaying, toggleAudioPlay];
}
