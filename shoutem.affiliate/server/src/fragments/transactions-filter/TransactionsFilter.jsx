import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { getUsers } from '../../redux';
import { formatUsers } from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

export default function TransactionsFilter({ onChange }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const users = useSelector(getUsers);

  function handleSelectedUserChange(filter) {
    if (selectedUser === filter) {
      return null;
    }

    setSelectedUser(filter);

    return onChange(filter?.value);
  }

  return (
    <>
      <h3>{i18next.t(LOCALIZATION.TRANSACTIONS_TITLE)}</h3>
      <Row className="transactions-filter">
        <Col xs={6}>
          <Select
            autoBlur
            clearable
            onChange={handleSelectedUserChange}
            options={formatUsers(users)}
            placeholder={i18next.t(LOCALIZATION.FILTER_BY_USER_PLACEHOLDER)}
            value={selectedUser}
          />
        </Col>
      </Row>
    </>
  );
}

TransactionsFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
};
