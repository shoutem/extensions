import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground } from '@shoutem/ui';
import { assets } from 'shoutem.layouts';

export default function EventImage({
  animationName,
  event,
  children,
  isListItemImage,
  styleName,
}) {
  const resolvedPlaceholderSource = isListItemImage
    ? assets.noImagePlaceholder
    : null;

  const resolvedEventImage = event.image
    ? { uri: event.image.url }
    : resolvedPlaceholderSource;

  return (
    <ImageBackground
      event={event}
      animationName={animationName}
      styleName={`placeholder ${styleName}`}
      source={resolvedEventImage}
    >
      {children}
    </ImageBackground>
  );
}

EventImage.propTypes = {
  event: PropTypes.object.isRequired,
  styleName: PropTypes.string.isRequired,
  animationName: PropTypes.string,
  children: PropTypes.node,
  isListItemImage: PropTypes.bool,
};

EventImage.defaultProps = {
  animationName: '',
  isListItemImage: true,
  children: undefined,
};
