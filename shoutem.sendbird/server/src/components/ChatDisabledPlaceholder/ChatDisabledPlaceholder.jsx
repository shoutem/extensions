import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import { LoaderContainer, EmptyResourcePlaceholder } from '@shoutem/react-web-ui';
import emptyImage from '../../../assets/empty-state-loyalty.svg';
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
    const displayButtonLabel = error ? 'Try again' : 'Get started';

    return (
      <EmptyResourcePlaceholder
        className="chat-disabled-placeholder"
        imageSrc={emptyImage}
        title="Please enable SendBird"
      >
        <p>
          {'This feature needs to be enabled and configured before using it in app. \nActivating this feature may move you to a higher '}
          <a href="https://shoutem.com/pricing/" rel="noopener noreferrer" target="_blank">pricing plan</a>
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
        {error && <p className="text-error">Something went wrong.</p>}
      </EmptyResourcePlaceholder>
    );
  }
}

ChatDisabledPlaceholder.propTypes = {
  onEnable: PropTypes.func,
};
