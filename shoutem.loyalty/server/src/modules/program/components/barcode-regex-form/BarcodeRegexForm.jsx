import React, { Component } from 'react';
import { Button, ButtonToolbar, Col, Row } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { getFormState } from 'src/redux';
import {
  FontIcon,
  FontIconPopover,
  LoaderContainer,
  ReduxFormElement,
} from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

const BARCODE_HELP_EXAMPLE = 'https://regex101.com/r/rtg3cg/4';

export class BarcodeRegexForm extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleBarcodeExampleClick() {
    this.props.navigateToUrl(BARCODE_HELP_EXAMPLE);
  }

  renderBarcodeHelpText() {
    return (
      <div>
        <Trans i18nKey={LOCALIZATION.HELP_MESSAGE}>
          Regular expression used to validate the barcode.
          <br />
          Use following markers within regular expression
          <br />- <strong>amount</strong>: specifies the placement of amount
          (with decimal places)
          <br />- <strong>mod13</strong>: specifies the placement of control
          digits. '13' indicates that sum of all digits can be divided by 13.
          <br />
          Example:
          <br />
        </Trans>
        <a
          className="barcode-regex-form__link"
          onClick={this.handleBarcodeExampleClick}
        >
          {i18next.t(LOCALIZATION.REGEX_EXAMPLE)}
        </a>
        .
      </div>
    );
  }

  renderBarcodeControlLabel() {
    return (
      <div>
        <span>{i18next.t(LOCALIZATION.REGULAR_EXPRESSION_TITLE)}</span>
        <FontIconPopover message={this.renderBarcodeHelpText()} trigger="click">
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
              {i18next.t(LOCALIZATION.BUTTON_SAVE_TITLE)}
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
  fields: ['regex'],
})(BarcodeRegexForm);
