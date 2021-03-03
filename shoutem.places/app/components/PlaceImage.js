import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Caption, ImageBackground, Tile, Title } from '@shoutem/ui';

export default function PlaceImage(props) {
  const {
    place: { name },
    animationName,
    source,
    styleName,
    location,
    imageOverlay,
  } = props;

  return (
    <ImageBackground
      animationName={animationName}
      source={source}
      styleName={styleName}
    >
      {imageOverlay && (
        <Tile>
          <Title>{name.toUpperCase()}</Title>
          <Caption styleName="sm-gutter-top">
            {_.get(location, 'formattedAddress')}
          </Caption>
        </Tile>
      )}
    </ImageBackground>
  );
}

PlaceImage.propTypes = {
  place: PropTypes.object,
  styleName: PropTypes.string,
  animationName: PropTypes.string,
  source: PropTypes.object,
  location: PropTypes.object,
  imageOverlay: PropTypes.bool,
};
