import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import i18next from 'i18next';
import { Trans } from 'react-i18next';
import autoBindReact from 'auto-bind/react';
import {
  LoaderContainer,
  EmptyResourcePlaceholder,
} from '@shoutem/react-web-ui';
import emptyImage from '../../../assets/empty-state-loyalty.svg';
import LOCALIZATION from './localization';
import './style.scss';

export default class ChatDisabledPlaceholder extends Component {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      error: false,
      loading: false,
    };
  }

  handleEnablePress() {
    const { onEnable } = this.props;
    if (!onEnable) {
      return;
    }

    this.setState({ loading: true, error: false });

    onEnable()
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false, error: true }));
  }

  render() {
    const { error, loading } = this.state;
    const displayButtonLabel = error
      ? i18next.t(LOCALIZATION.BUTTON_LABEL_ERROR)
      : i18next.t(LOCALIZATION.BUTTON_LABEL_START);

    return (
      <EmptyResourcePlaceholder
        className="chat-disabled-placeholder"
        imageSrc={emptyImage}
        title={i18next.t(LOCALIZATION.TITLE)}
      >
        <p>
          <Trans i18nKey={LOCALIZATION.FEATURE_ENABLE_MESSAGE}>
            {
              'This feature needs to be enabled and configured before using it in app. \nActivating this feature may move you to a higher '
            }
            <a
              href="https://shoutem.com/pricing/"
              rel="noopener noreferrer"
              target="_blank"
            >
              pricing plan
            </a>
            .
          </Trans>
        </p>
        <Button
          bsSize="large"
          bsStyle="primary"
          onClick={this.handleEnablePress}
        >
          <LoaderContainer isLoading={loading}>
            {displayButtonLabel}
          </LoaderContainer>
        </Button>
        {error && <p className="text-error">{i18next.t(LOCALIZATION.ERROR)}</p>}
      </EmptyResourcePlaceholder>
    );
  }
}

ChatDisabledPlaceholder.propTypes = {
  onEnable: PropTypes.func,
};
