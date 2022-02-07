import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FontIcon, ImagePreview } from '@shoutem/react-web-ui';
import { SHAPE_VALUES, SHAPES } from './imageShapes';
import './style.scss';

function handleClick(link, isCircularImage) {
  if (link && !isCircularImage) {
    // eslint-disable-next-line no-undef
    window.open(link, '_blank');
  }
}

export default function FormImagesPreview({
  label,
  variant: shape,
  value: images,
}) {
  const isCircularImage = shape === SHAPES.CIRCLE;

  if (_.isEmpty(images)) {
    const resolvedContainerStyle = classNames(
      'form-images-preview__empty-container',
      {
        'circular-image': isCircularImage,
      },
    );

    return (
      <>
        <p className="control-label">{label}</p>
        <div className="form-images-preview__container">
          <div className={resolvedContainerStyle}>
            <FontIcon name="eyeoff" size="24px" />
          </div>
        </div>
      </>
    );
  }

  const resolvedImageStyle = classNames('form-images-preview__image', {
    'circular-image': isCircularImage,
    'has-full-image-preview': !isCircularImage,
  });

  return (
    <>
      <p className="control-label">{label}</p>
      <div className="form-images-preview__container">
        {images.map(image => (
          <div
            key={`${image.slice(-8)}`}
            className="form-images-preview__image-container"
          >
            {!isCircularImage && (
              <FontIcon
                className="form-images-preview__icon"
                name="eyeon"
                size="24px"
              />
            )}
            <ImagePreview
              className={resolvedImageStyle}
              width="300"
              height="300"
              previewSize="large"
              canBeDeleted={false}
              onClick={() => handleClick(image, isCircularImage)}
              src={image}
            />
          </div>
        ))}
      </div>
    </>
  );
}

FormImagesPreview.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(SHAPE_VALUES).isRequired,
  value: PropTypes.array,
};

FormImagesPreview.defaultProps = {
  value: [],
};
