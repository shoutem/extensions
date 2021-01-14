import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { Row, Col } from 'react-bootstrap';
import './style.scss';

export default class TranslationRow extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleTextChanged(event) {
    const { shortcut, translateTo, onTranslationChanged } = this.props;
    const { key: shortcutKey } = shortcut;
    const { value: languageCode } = translateTo;

    const translationValue = {
      shortcutKey,
      languageCode,
      value: event.target.value,
    };

    onTranslationChanged(translationValue);
  }

  render() {
    const { shortcut } = this.props;

    return (
      <Row className="translate-table__row" key={shortcut.key}>
        <Col xs={7}>
          <div className="translate-table__row-item">{shortcut.title}</div>
        </Col>
        <Col className="translate-table__row-item" xs={5}>
          <input
            className="form-control"
            type="text"
            value={shortcut.translation}
            onChange={this.handleTextChanged}
          />
        </Col>
      </Row>
    );
  }
}

TranslationRow.propTypes = {
  shortcuts: PropTypes.array,
  translateTo: PropTypes.object,
  onTranslationChanged: PropTypes.func,
};
