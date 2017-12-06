import React, { PropTypes } from 'react';
import Uri from 'urijs';
import classnames from 'classnames';
import { FontIcon } from '@shoutem/react-web-ui';
import './style.scss';

export default class FilePreview extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.stopPropagation();
  }

  render() {
    const {
      src,
      className,
      canBeDeleted,
      onDeleteClick,
    } = this.props;

    const filename = src ? new Uri(src).filename() : 'No file.';

    const classes = classnames(
      className,
      'file-preview',
      {
        'is-deletable': canBeDeleted,
      },
    );

    return (
      <div className={classes} onClick={this.handleClick}>
        <div>
          <FontIcon name="file-uploaded" size="24px" />
          <div>{filename}</div>
        </div>
        {canBeDeleted && (
          <FontIcon name="delete" onClick={onDeleteClick} className="file-preview__delete" />
        )}
      </div>
    );
  }
}

FilePreview.propTypes = {
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
   * Flag indicating whether file can be deleted
   */
  canBeDeleted: PropTypes.bool,
};
