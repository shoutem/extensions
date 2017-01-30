import React from 'react';
import { Image } from '@shoutem/ui';
import _ from 'lodash';

function EventImage(props) {
  return (
    <Image
      {...props}
      source={{ uri: _.get(props.event, 'image.url') }}
      defaultSource={require('../assets/images/image-fallback.png')}
    >
      {props.children}
    </Image>
  );
}

EventImage.propTypes = {
  event: React.PropTypes.object,
  styleName: React.PropTypes.string,
  animationName: React.PropTypes.string,
  children: React.PropTypes.node,
};

export default EventImage;
