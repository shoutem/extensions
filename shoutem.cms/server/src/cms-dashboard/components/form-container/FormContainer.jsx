import React, { PropTypes } from 'react';
import { Col } from 'react-bootstrap';

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
