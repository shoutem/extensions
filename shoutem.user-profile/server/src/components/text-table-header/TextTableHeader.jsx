import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FontIcon, FontIconPopover } from '@shoutem/react-web-ui';
import './style.scss';

export default function TextTableHeader({ className, header }) {
  const { value, helpText } = header;
  const classes = classNames('text-table-header', className);

  return (
    <th className={classes}>
      {value}
      {helpText && (
        <FontIconPopover
          className="text-table-header__popover"
          message={helpText}
        >
          <FontIcon
            className="text-table-header__icon-popover"
            name="info"
            size="24px"
          />
        </FontIconPopover>
      )}
    </th>
  );
}

TextTableHeader.propTypes = {
  header: PropTypes.object.isRequired,
  className: PropTypes.string,
};

TextTableHeader.defaultProps = {
  className: null,
};
