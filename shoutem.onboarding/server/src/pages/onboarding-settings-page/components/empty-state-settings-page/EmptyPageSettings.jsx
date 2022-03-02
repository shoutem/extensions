import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import emptyImage from 'src/assets/empty-state.svg';
import {
  EmptyResourcePlaceholder,
  LoaderContainer,
} from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default class EmptyPageSettings extends Component {
  static propTypes = {
    onEnable: PropTypes.func,
  };

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

    return (
      <EmptyResourcePlaceholder
        className="empty-onboarding-placeholder"
        imageSrc={emptyImage}
        title={i18next.t(LOCALIZATION.TITLE)}
      >
        <p>{i18next.t(LOCALIZATION.MESSAGE)}</p>
        <Button
          bsSize="large"
          bsStyle="primary"
          onClick={this.handleEnablePress}
        >
          <LoaderContainer isLoading={loading}>
            {i18next.t(LOCALIZATION.BUTTON_LABEL)}
          </LoaderContainer>
        </Button>
        {error && (
          <p className="text-error">{i18next.t(LOCALIZATION.ERROR_MESSAGE)}</p>
        )}
      </EmptyResourcePlaceholder>
    );
  }
}
