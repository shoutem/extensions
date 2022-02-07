import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import emptyImage from 'assets/images/empty-state-loyalty.svg';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import {
  EmptyResourcePlaceholder,
  LoaderContainer,
} from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default class LoyaltyDisabledPlaceholder extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      inError: false,
      inProgress: false,
    };
  }

  handleEnableLoyaltyClick() {
    const { onEnableLoyaltyClick } = this.props;
    this.setState({ inProgress: true });

    onEnableLoyaltyClick().then(
      () => this.setState({ inProgress: false }),
      () => this.setState({ inError: true }),
    );
  }

  render() {
    const { inError, inProgress } = this.state;
    const displayButtonLabel = inError
      ? i18next.t(LOCALIZATION.BUTTON_TRY_AGAIN_TITLE)
      : i18next.t(LOCALIZATION.BUTTON_GET_STARTED_TITLE);

    return (
      <EmptyResourcePlaceholder
        className="loyalty-disabled-placeholder"
        imageSrc={emptyImage}
        title={i18next.t(LOCALIZATION.TITLE)}
      >
        <p>{i18next.t(LOCALIZATION.DESCRIPTION)}</p>
        <Button
          bsSize="large"
          bsStyle="primary"
          onClick={this.handleEnableLoyaltyClick}
        >
          <LoaderContainer isLoading={inProgress}>
            {displayButtonLabel}
          </LoaderContainer>
        </Button>
        {inError && (
          <p className="text-error">
            {i18next.t(LOCALIZATION.FAILED_TO_ENABLE_MESSAGE)}
          </p>
        )}
      </EmptyResourcePlaceholder>
    );
  }
}

LoyaltyDisabledPlaceholder.propTypes = {
  onEnableLoyaltyClick: PropTypes.func,
};
