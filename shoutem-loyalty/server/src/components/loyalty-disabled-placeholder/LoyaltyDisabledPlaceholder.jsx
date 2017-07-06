import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { EmptyResourcePlaceholder } from '@shoutem/react-web-ui';
import emptyImage from '../../../assets/images/empty-state-loyalty.svg';
import './style.scss';

export default class LoyaltyDisabledPlaceholder extends Component {
  constructor(props) {
    super(props);

    this.handleEnableLoyaltyClick = this.handleEnableLoyaltyClick.bind(this);

    this.state = {
      inError: false,
    };
  }

  handleEnableLoyaltyClick() {
    const { onEnableLoyaltyClick } = this.props;

    onEnableLoyaltyClick()
      .then(undefined, () => this.setState({ inError: true }));
  }

  render() {
    const { inError } = this.state;
    const displayButtonLabel = inError ? 'Try again' : 'Enable';

    return (
      <EmptyResourcePlaceholder
        imageSrc={emptyImage}
        title="Loyalty disabled"
        className="loyalty-disabled-placeholder"
      >
        <p>Enable Loyalty and configure your Loyalty program.</p>
        <Button bsStyle="primary" bsSize="large" onClick={this.handleEnableLoyaltyClick}>
          {displayButtonLabel}
        </Button>
        {inError && <p className="text-error">Failed to enable.</p>}
      </EmptyResourcePlaceholder>
    );
  }
}

LoyaltyDisabledPlaceholder.propTypes = {
  onEnableLoyaltyClick: PropTypes.func,
};
