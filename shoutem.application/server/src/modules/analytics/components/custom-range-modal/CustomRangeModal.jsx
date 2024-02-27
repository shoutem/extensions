import React, { Component } from 'react';
import {
  Button,
  ControlLabel,
  FormGroup,
  HelpBlock,
  Modal,
} from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { DateTimePicker, FontIcon } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

const DATE_FORMAT = 'MM/DD/YYYY';

export default class CustomRangeModal extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    const now = moment();

    this.state = {
      from: now,
      to: now,
      error: null,
    };
  }

  validateRange() {
    const { from, to, error } = this.state;

    const startDate = moment(from);
    const endDate = moment(to);
    const diffMonths = endDate.diff(startDate, 'months');

    if (diffMonths >= 24) {
      this.setState({
        error: i18next.t(LOCALIZATION.RANGE_DURATION_ERROR_MESSAGE),
      });
      return;
    }

    if (error) {
      this.setState({ error: null });
    }
  }

  handleOnSubmit() {
    const { onSubmit, onHide } = this.props;
    const { from, to } = this.state;

    if (_.isFunction(onSubmit)) {
      const fromFormatted = moment(from).format(DATE_FORMAT);
      const toFormatted = moment(to).format(DATE_FORMAT);

      onSubmit(fromFormatted, toFormatted);
    }

    onHide();
  }

  handleFromChange(from) {
    this.setState({ from }, this.validateRange);
  }

  handleToChange(to) {
    this.setState({ to }, this.validateRange);
  }

  render() {
    const { onHide } = this.props;
    const { from, to, error } = this.state;

    const fromValid = moment(from).isValid();
    const toValid = moment(to).isValid();
    const isFormValid = fromValid && toValid && !error;

    return (
      <Modal
        dialogClassName="custom-range-modal"
        bsSize="medium"
        show
        backdrop
        onHide={onHide}
      >
        <Modal.Header className="custom-range-modal__modal-header">
          <div className="modal-title">
            <Button className="btn-icon modal-close" onClick={onHide}>
              <FontIcon name="close" size="24px" />
            </Button>
            {i18next.t(LOCALIZATION.TITLE)}
          </div>
        </Modal.Header>
        <Modal.Body className="custom-range-modal__modal-body">
          <FormGroup controlId="from-element-id">
            <ControlLabel>{i18next.t(LOCALIZATION.FROM)}</ControlLabel>
            <DateTimePicker
              dateFormat={DATE_FORMAT}
              utc={false}
              value={from}
              timeFormat={false}
              clearable={false}
              onChange={this.handleFromChange}
            />
          </FormGroup>
          <FormGroup controlId="to-element-id">
            <ControlLabel>{i18next.t(LOCALIZATION.TO)}</ControlLabel>
            <DateTimePicker
              dateFormat={DATE_FORMAT}
              utc={false}
              value={to}
              timeFormat={false}
              clearable={false}
              onChange={this.handleToChange}
            />
          </FormGroup>
          {error && <HelpBlock className="text-error">{error}</HelpBlock>}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>{i18next.t(LOCALIZATION.CANCEL)}</Button>
          <Button
            type="submit"
            bsStyle="primary"
            disabled={!isFormValid}
            onClick={this.handleOnSubmit}
          >
            {i18next.t(LOCALIZATION.APPLY)}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

CustomRangeModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onHide: PropTypes.func,
};

CustomRangeModal.defaultProps = {
  onHide: () => {},
};
