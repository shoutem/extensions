import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FontIcon } from '@shoutem/react-web-ui';
import './style.scss';

export default function ImageUploadPlaceholder({ className, width, height }) {
  const classes = classNames('image-upload-placeholder', className);
  const style = { width, height };

  return (
    <div className={classes} style={style}>
      <div>
        <FontIcon name="add" />
      </div>
    </div>
  );
}

ImageUploadPlaceholder.propTypes = {
  /**
   * Additional classes to apply
   */
  className: PropTypes.string,
  /**
   * Placeholder height
   */
  height: PropTypes.string,
  /**
   * Placeholder width
   */
  width: PropTypes.string,
};

ImageUploadPlaceholder.defaultProps = {
  width: '200px',
  height: '200px',
};
