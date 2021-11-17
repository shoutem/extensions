import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontIcon } from '@shoutem/react-web-ui';
import './style.scss';

export default function ImageUploadPlaceholder({ className }) {
  const classes = classNames('image-upload-placeholder', className);

  return (
    <div className={classes}>
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
};
