import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getShortcut } from 'environment';
import _ from 'lodash';
import i18next from 'i18next';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
} from 'react-bootstrap';
import { updateShortcut } from '../reducer';
import LOCALIZATION from './localization';
import './style.scss';

export class FaqSettings extends Component {
  static propTypes = {
    shortcut: PropTypes.object,
    updateShortcut: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.getStartingMessage = this.getStartingMessage.bind(this);
    this.hasChanges = this.hasChanges.bind(this);
    this.handleSaveStartingMessage = this.handleSaveStartingMessage.bind(this);
    this.handleSetStartingMessage = this.handleSetStartingMessage.bind(this);

    this.state = { startMessage: this.getStartingMessage() };
  }

  getStartingMessage() {
    const { shortcut } = this.props;

    return _.get(shortcut, 'settings.startMessage', '');
  }

  hasChanges() {
    const { startMessage } = this.state;
    const previousStartingMessage = this.getStartingMessage();

    return startMessage !== previousStartingMessage;
  }

  handleSaveStartingMessage() {
    const {
      shortcut: { id },
      updateShortcut,
    } = this.props;
    const { startMessage } = this.state;

    if (!this.hasChanges()) {
      return;
    }

    const updatedShortcut = {
      id,
      attributes: {
        settings: { startMessage },
      },
    };

    updateShortcut(updatedShortcut);
  }

  handleSetStartingMessage(event) {
    const startMessage = event.target.value;

    this.setState({ startMessage });
  }

  render() {
    const { startMessage } = this.state;
    const buttonDisabled = !this.hasChanges();

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_STARTING_MESSAGE)}
            </ControlLabel>
            <FormControl
              type="textarea"
              className="form-control"
              onChange={this.handleSetStartingMessage}
              value={startMessage}
            />
          </FormGroup>
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={buttonDisabled}
            onClick={this.handleSaveStartingMessage}
          >
            {i18next.t(LOCALIZATION.BUTTON_SAVE)}
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

function mapStateToProps() {
  return {
    shortcut: getShortcut(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateShortcut: shortcut => dispatch(updateShortcut(shortcut)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FaqSettings);
