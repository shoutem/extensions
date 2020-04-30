import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 * Tooltip message with the link.
 */
export default class MessageWithLink extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { message, link, linkText } = this.props;

    return (
      <span>
        {message}{' '}
        <a href={link} target="_blank">
          {linkText}
        </a>
      </span>
    );
  }
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
