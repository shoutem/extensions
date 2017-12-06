import React, { PropTypes, Component } from 'react';
import { PasswordBox, ReduxFormElement } from '@shoutem/react-web-ui';
import { FormGroup, Button } from 'react-bootstrap';
import passwordGenerator from 'generate-password';
import './style.scss';

export default class GeneratedPasswordControl extends Component {
  constructor(props) {
    super(props);

    this.handleGeneratePasswordClick = this.handleGeneratePasswordClick.bind(this);
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
        <ReduxFormElement
          field={password}
          {...otherProps}
        >
          <PasswordBox />
        </ReduxFormElement>
        <Button
          className="btn-textual"
          onClick={this.handleGeneratePasswordClick}
        >
          Generate password
        </Button>
      </FormGroup>
    );
  }
}

GeneratedPasswordControl.propTypes = {
  password: PropTypes.object,
  onPasswordUpdated: PropTypes.func,
};
