import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

export default function SectionForm({ children, title, editorSize }) {
  return (
    <Row className="section-form">
      <Col xs={editorSize}>
        <div className="section-form-title">{title && <h3>{title}</h3>}</div>
      </Col>
      {children}
    </Row>
  );
}

SectionForm.propTypes = {
  children: PropTypes.object,
  title: PropTypes.string,
  editorSize: PropTypes.string,
};
