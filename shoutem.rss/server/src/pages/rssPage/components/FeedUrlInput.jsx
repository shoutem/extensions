import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import i18next from 'i18next';
import {
  Button,
  ButtonToolbar,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
} from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import validator from 'validator';
import LOCALIZATION from './localization';
import './style.scss';

const validateUrl = url => validator.isURL(url, { require_protocol: false });

export default class FeedUrlInput extends Component {
  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.getValidationState = this.getValidationState.bind(this);

    this.state = {
      feedUrl: '',
      error: props.error,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ error: newProps.error });
  }

  getValidationState() {
    return this.state.error ? 'error' : null;
  }

  handleTextChange(event) {
    this.setState({
      feedUrl: event.target.value,
      error: null,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.feedUrl) {
      this.handleContinue();
    }
  }

  handleContinue() {
    const feedUrl = _.trim(this.state.feedUrl);
    if (validateUrl(feedUrl)) {
      this.props.onContinueClick(feedUrl);
    } else {
      this.setState({ error: i18next.t(LOCALIZATION.INVALID_URL) });
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup validationState={this.getValidationState()}>
            <ControlLabel>{i18next.t(LOCALIZATION.FORM_FEED)}</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              onChange={this.handleTextChange}
            />
            <HelpBlock className="text-error">{this.state.error}</HelpBlock>
          </FormGroup>
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!this.state.feedUrl}
            onClick={this.handleContinue}
          >
            <LoaderContainer isLoading={this.props.inProgress}>
              {i18next.t(LOCALIZATION.BUTTON_CONTINUE)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

FeedUrlInput.propTypes = {
  inProgress: PropTypes.bool,
  onContinueClick: PropTypes.func,
  error: PropTypes.string,
};

FeedUrlInput.defaultProps = {
  inProgress: false,
};
