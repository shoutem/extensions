import React from 'react';
import { MenuItem } from 'react-bootstrap';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { Dropdown } from '@shoutem/react-web-ui';
import './style.scss';

export default function AnalyticsDropdown(props) {
  const { activeFilter, filters, onItemClick } = props;

  return (
    <Dropdown className="analytics-dropdown" id={0} pullRight>
      <Dropdown.Toggle>{activeFilter}</Dropdown.Toggle>
      <Dropdown.Menu>
        {map(filters, filter => (
          <MenuItem key={filter} eventKey={filter} onSelect={onItemClick}>
            {filter}
          </MenuItem>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

AnalyticsDropdown.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  onItemClick: PropTypes.func.isRequired,
};
