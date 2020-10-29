import React from 'react';
import PropTypes from 'prop-types';

/**
 * Tooltip message with the link.
 */
export default function MessageWithLink({ message, link, linkText }) {
  return (
    <span>
      {message}{' '}
      <a href={link} rel="noopener noreferrer" target="_blank">
        {linkText}
      </a>
    </span>
  );
}

MessageWithLink.propTypes = {
  /**
   * Popover message
   */
  message: PropTypes.string,
  /**
   * The link that should be opened from popover
   */
  link: PropTypes.string,
  /**
   * Hyperlink text
   */
  linkText: PropTypes.string,
};
