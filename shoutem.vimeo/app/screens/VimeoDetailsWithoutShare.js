import React from 'react';

import { VimeoDetails } from './VimeoDetails';

class VimeoDetailsWithoutShare extends VimeoDetails {
  getNavBarProps(video, videoAttachment) {
    return {
      animationName: 'boxing',
      title: video.title,
    };
  }
}

export default VimeoDetailsWithoutShare;
