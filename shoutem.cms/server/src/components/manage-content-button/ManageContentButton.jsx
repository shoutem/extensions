import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import { Button, ButtonGroup } from 'react-bootstrap';
import { FontIcon, LoaderContainer } from '@shoutem/react-web-ui';
import './style.scss';

const styles = {
  advancedToggle: {
    marginLeft: 1,
  },
};

export default class ManageContentButton extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      inProgress: false,
    };
  }

  handleCmsButtonClick() {
    const { onNavigateToCmsClick } = this.props;

    this.setState({ inProgress: true });
    onNavigateToCmsClick().then(() => this.setState({ inProgress: false }));
  }

  render() {
    const { inProgress } = this.state;
    const {
      className,
      cmsButtonLabel,
      onNavigateToCmsClick,
      showAdditionalOptions,
      onToggleAdditionalOptions,
    } = this.props;

    const toggleButtonIcon = showAdditionalOptions
      ? 'arrow-drop-up'
      : 'arrow-drop-down';
    const toggleButtonClass = showAdditionalOptions ? 'primary' : 'default';
    const classes = classNames('manage-content-button', className);

    return (
      <ButtonGroup className={classes}>
        <Button
          bsSize="large"
          className="manage-content-button__items"
          onClick={onNavigateToCmsClick}
        >
          <LoaderContainer isLoading={inProgress}>
            {cmsButtonLabel}
          </LoaderContainer>
        </Button>
        <Button
          bsSize="large"
          style={styles.advancedToggle}
          bsStyle={toggleButtonClass}
          className="manage-content-button__advanced-setup"
          onClick={onToggleAdditionalOptions}
        >
          <FontIcon name={toggleButtonIcon} size="24px" />
        </Button>
      </ButtonGroup>
    );
  }
}

ManageContentButton.propTypes = {
  className: PropTypes.string,
  cmsButtonLabel: PropTypes.string,
  onNavigateToCmsClick: PropTypes.func,
  showAdditionalOptions: PropTypes.bool,
  onToggleAdditionalOptions: PropTypes.func,
};
