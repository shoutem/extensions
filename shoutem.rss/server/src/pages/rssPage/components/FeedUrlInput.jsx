import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind';
import _ from 'lodash';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import validator from 'validator';
import LOCALIZATION from './localization';
import './style.scss';

const validateUrl = url => validator.isURL(url, { require_protocol: false });

export default class FeedUrlInput extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      feedUrl: '',
      error: props.error,
    };
  }

  getValidationState() {
    const { error } = this.state;

    return error ? 'error' : null;
  }

  handleTextChange(event) {
    this.setState({
      feedUrl: event.target.value,
      error: null,
    });
  }

  handleContinue() {
    const { onContinueClick } = this.props;
    const { feedUrl: untrimmedFeedUrl } = this.state;

    const feedUrl = _.trim(untrimmedFeedUrl);

    if (validateUrl(feedUrl)) {
      onContinueClick(feedUrl);
    } else {
      this.setState({ error: i18next.t(LOCALIZATION.INVALID_URL) });
    }
  }

  render() {
    const { inProgress } = this.props;
    const { error, feedUrl } = this.state;

    return (
      <div>
        <FormGroup validationState={this.getValidationState()}>
          <ControlLabel>{i18next.t(LOCALIZATION.FORM_FEED)}</ControlLabel>
          <FormControl
            type="text"
            className="form-control"
            onChange={this.handleTextChange}
          />
          <HelpBlock className="text-error">{error}</HelpBlock>
        </FormGroup>
        <Button
          bsStyle="primary"
          disabled={!feedUrl}
          onClick={this.handleContinue}
        >
          <LoaderContainer isLoading={inProgress}>
            {i18next.t(LOCALIZATION.BUTTON_CONTINUE)}
          </LoaderContainer>
        </Button>
      </div>
    );
  }
}

FeedUrlInput.propTypes = {
  error: PropTypes.string,
  inProgress: PropTypes.bool,
  onContinueClick: PropTypes.func.isRequired,
};

FeedUrlInput.defaultProps = {
  inProgress: false,
  error: undefined,
};
