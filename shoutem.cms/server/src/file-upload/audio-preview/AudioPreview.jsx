import React, { useEffect, useState } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontIcon } from '@shoutem/react-web-ui';
import './style.scss';

function getFileName(fileUri) {
  if (!fileUri) {
    return null;
  }

  return fileUri.split('/').pop();
}

function useAudioPlay(url) {
  // eslint-disable-next-line no-undef
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
  }, [audio]);

  useEffect(() => {
    if (isAudioPlaying) {
      audio.play();
    } else {
      audio.pause();
    }

    // stop playing on unmnount
    return () => {
      if (isAudioPlaying) {
        audio.pause();
      }
    };
  }, [audio, isAudioPlaying]);

  return [isAudioPlaying, toggleAudioPlay];
}

export default function AudioPreview({ src, onDelete }) {
  const [isAudioPlaying, toggleAudioPlay] = useAudioPlay(src);
  const resolvedAudioIcon = isAudioPlaying ? 'pause' : 'play';

  return (
    <div className="audio-preview">
      <FormControl readOnly value={getFileName(src)} />
      <div className="audio-preview__play-pause">
        <FontIcon
          size="24px"
          name={resolvedAudioIcon}
          onClick={toggleAudioPlay}
        />
      </div>
      <Button bsSize="small" onClick={onDelete}>
        <FontIcon name="delete" size="24px" />
      </Button>
    </div>
  );
}

AudioPreview.propTypes = {
  src: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};
