import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import {
  LoaderContainer,
  ReduxFormElement,
  FontIcon,
  FontIconPopover,
} from '@shoutem/react-web-ui';
import { Row, Col, Button, ButtonToolbar } from 'react-bootstrap';
import { getFormState } from 'src/redux';
import './style.scss';

const BARCODE_HELP_EXAMPLE = 'https://regex101.com/r/rtg3cg/4';

export class BarcodeRegexForm extends Component {
  constructor(props) {
    super(props);

    this.handleBarcodeExampleClick = this.handleBarcodeExampleClick.bind(this);
    this.renderBarcodeHelpText = this.renderBarcodeHelpText.bind(this);
    this.renderBarcodeControlLabel = this.renderBarcodeControlLabel.bind(this);
  }

  handleBarcodeExampleClick() {
    this.props.navigateToUrl(BARCODE_HELP_EXAMPLE);
  }

  renderBarcodeHelpText() {
    return (
      <div>
        Regular expression used to validate the barcode.<br />
        Use following markers within regular expression<br />
        - <strong>amount</strong>: specifies the placement of amount (with decimal places)<br />
        - <strong>mod13</strong>: specifies the placement of control digits. '13' indicates{' '}
        that sum of all digits can be divided by 13.<br />
        Example:<br />
        <a
          className="barcode-regex-form__link"
          onClick={this.handleBarcodeExampleClick}
        >
          {'^(.{6})(?<amount>.{5})(?<mod13>.{2})$'}
        </a>.
      </div>
    );
  }

  renderBarcodeControlLabel() {
    return (
      <div>
        <span>Barcode regular expression</span>
        <FontIconPopover
          message={this.renderBarcodeHelpText()}
          trigger="click"
        >
          <FontIcon
            className="barcode-regex-form__icon-popover"
            name="info"
            size="24px"
          />
        </FontIconPopover>
      </div>
    );
  }

  render() {
    const {
      submitting,
      pristine,
      fields: { regex },
      handleSubmit,
    } = this.props;

    const actionsDisabled = submitting || pristine;

    return (
      <form className="barcode-regex-form" onSubmit={handleSubmit}>
        <Row>
          <Col>
            <ReduxFormElement
              className="barcode-regex-form__input"
              disabled={submitting}
              elementId="regex"
              field={regex}
              name={this.renderBarcodeControlLabel()}
            />
          </Col>
        </Row>
        <ButtonToolbar>
          <Button bsStyle="primary" disabled={actionsDisabled} type="submit">
            <LoaderContainer isLoading={submitting}>
              Save
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </form>
    );
  }
}

BarcodeRegexForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
  fields: PropTypes.object,
  navigateToUrl: PropTypes.func,
};

export default reduxForm({
  getFormState,
  form: 'barcodeRegexForm',
  fields: [
    'regex',
  ],
})(BarcodeRegexForm);
