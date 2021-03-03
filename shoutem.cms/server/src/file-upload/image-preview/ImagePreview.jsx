import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import { FontIcon } from '@shoutem/react-web-ui';
import './style.scss';

export default class ImagePreview extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleClick(event) {
    event.stopPropagation();
  }

  render() {
    const {
      src,
      width,
      height,
      className,
      canBeDeleted,
      canBePreviewed,
      onDeleteClick,
      onPreviewClick,
    } = this.props;

    const classes = classNames(className, 'image-preview', {
      'is-deletable': canBeDeleted,
      'is-previewable': canBePreviewed,
    });

    const style = { width, height };
    if (!!src) {
      style.backgroundImage = `url('${src}')`;
    }

    return (
      <div className={classes} onClick={this.handleClick} style={style}>
        {canBeDeleted && (
          <div className="file-preview__delete" onClick={onDeleteClick}>
            <FontIcon className="file-preview__delete-icon" name="close" />
          </div>
        )}
        {canBePreviewed && (
          <div className="file-preview__preview" onClick={onPreviewClick}>
            <FontIcon
              className="file-preview__preview-icon"
              name="visibility-on"
            />
          </div>
        )}
      </div>
    );
  }
}

ImagePreview.propTypes = {
  /**
   * Valid url to the file
   */
  src: PropTypes.string.isRequired,
  /**
   * Additional classes to apply
   */
  className: PropTypes.string,
  /**
   * Click handler for delete icon
   */
  onDeleteClick: PropTypes.func,
  /**
   * Click handler for preview icon
   */
  onPreviewClick: PropTypes.func,
  /**
   * Flag indicating whether file can be deleted
   */
  canBeDeleted: PropTypes.bool,
  /**
   * Flag indicating whether file can be previewed
   */
  canBePreviewed: PropTypes.bool,
  /**
   * Preview width
   */
  width: PropTypes.string,
  /**
   * Preview height
   */
  height: PropTypes.string,
};

ImagePreview.defaultProps = {
  width: '200px',
  height: '200px',
};
