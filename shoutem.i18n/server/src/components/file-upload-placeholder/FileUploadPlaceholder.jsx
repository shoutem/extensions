import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { FontIcon } from '@shoutem/react-web-ui';
import './style.scss';

export default function FileUploadPlaceholder({ className }) {
  const classes = classnames(
    'file-upload-placeholder',
    className,
  );

  return (
    <div className={classes}>
      <div>
        <FontIcon name="add" />
        <div>Choose a file or drag it here.</div>
      </div>
    </div>
  );
}

FileUploadPlaceholder.propTypes = {
  /**
   * Additional classes to apply
   */
  className: PropTypes.string,
};
