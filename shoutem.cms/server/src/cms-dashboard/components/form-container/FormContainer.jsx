import React from 'react';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function FormContainer({ children, colSize }) {
  return (
    <Col xs={colSize} className="container-form">
      {children}
    </Col>
  );
}

FormContainer.propTypes = {
  children: PropTypes.object,
  colSize: PropTypes.number,
};
