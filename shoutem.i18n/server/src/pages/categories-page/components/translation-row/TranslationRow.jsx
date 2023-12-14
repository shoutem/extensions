import React, { useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './style.scss';

export default function TranslationRow({
  category,
  translation,
  languageCode,
  onChange,
}) {
  const handleOnChange = useCallback(
    event => {
      const translationValue = {
        id: category.id,
        languageCode,
        value: event?.target?.value,
      };

      onChange(translationValue);
    },
    [category, languageCode, onChange],
  );

  return (
    <Row className="row" key={category.id}>
      <Col xs={7}>
        <div className="row-item row-title">{category.name}</div>
      </Col>
      <Col className="row-item" xs={5}>
        <input
          className="form-control"
          type="text"
          value={translation}
          onChange={handleOnChange}
        />
      </Col>
    </Row>
  );
}

TranslationRow.propTypes = {
  category: PropTypes.object.isRequired,
  languageCode: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  translation: PropTypes.string,
};

TranslationRow.defaultProps = {
  translation: '',
};
