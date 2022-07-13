import React from 'react';
import { Button, FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useAudioPlay } from 'src/hooks';
import { FontIcon } from '@shoutem/react-web-ui';
import './style.scss';

export default function ChimeFilePreview({ url, soundName, onDelete }) {
  const [isChimePlaying, togglePlayChime] = useAudioPlay(url);
  const resolvedAudioIcon = isChimePlaying ? 'pause' : 'play';

  return (
    <div className="chime-file-preview">
      <FormControl readOnly value={soundName} />
      <div className="chime-file-preview__play-pause">
        <FontIcon
          name={resolvedAudioIcon}
          size="24px"
          onClick={togglePlayChime}
        />
      </div>
      <Button bsSize="small" onClick={onDelete}>
        <FontIcon name="delete" size="24px" />
      </Button>
    </div>
  );
}

ChimeFilePreview.propTypes = {
  url: PropTypes.string,
  soundName: PropTypes.string,
  onDelete: PropTypes.func,
};
