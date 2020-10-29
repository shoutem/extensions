import PropTypes from 'prop-types';
import React, { Component } from 'react';
import i18next from 'i18next';
import { PasswordBox, ReduxFormElement } from '@shoutem/react-web-ui';
import { FormGroup, Button } from 'react-bootstrap';
import passwordGenerator from 'generate-password';
import LOCALIZATION from './localization';
import './style.scss';

export default class GeneratedPasswordControl extends Component {
  constructor(props) {
    super(props);

    this.handleGeneratePasswordClick = this.handleGeneratePasswordClick.bind(
      this,
    );
  }

  handleGeneratePasswordClick() {
    const password = passwordGenerator.generate({
      length: 6,
      numbers: true,
      uppercase: true,
    });

    this.props.onPasswordUpdated(password);
  }

  render() {
    const { password, ...otherProps } = this.props;

    return (
      <FormGroup className="generated-password-control">
        <ReduxFormElement field={password} {...otherProps}>
          <PasswordBox />
        </ReduxFormElement>
        <Button
          className="btn-textual"
          onClick={this.handleGeneratePasswordClick}
        >
          {i18next.t(LOCALIZATION.BUTTON_GENERATE_PASSWORD_TITLE)}
        </Button>
      </FormGroup>
    );
  }
}

GeneratedPasswordControl.propTypes = {
  password: PropTypes.object,
  onPasswordUpdated: PropTypes.func,
};
