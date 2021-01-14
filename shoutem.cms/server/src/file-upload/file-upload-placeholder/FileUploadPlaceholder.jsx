import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import i18next from 'i18next';
import { FontIcon } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default function FileUploadPlaceholder({ className }) {
  const classes = classnames('file-upload-placeholder', className);

  return (
    <div className={classes}>
      <div>
        <FontIcon name="add" />
        <div>{i18next.t(LOCALIZATION.FILE_UPLOAD_MESSAGE)}</div>
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
