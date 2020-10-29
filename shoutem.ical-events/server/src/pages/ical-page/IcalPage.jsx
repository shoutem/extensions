import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import i18next from 'i18next';
import autoBindReact from 'auto-bind/react';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import { connect } from 'react-redux';
import LOCALIZATION from './localization';
import './style.scss';

class IcalPage extends Component {
  static propTypes = {
    shortcut: PropTypes.object,
    updateShortcutSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      error: null,
      icalUrl: _.get(props.shortcut, 'settings.icalUrl'),
      // flag indicating if value in input field is changed
      hasChanges: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { shortcut: nextShortcut } = nextProps;
    const { icalUrl } = this.state;

    if (_.isEmpty(icalUrl)) {
      this.setState({
        icalUrl: _.get(nextShortcut, 'settings.icalUrl'),
      });
    }
  }

  handleTextChange(event) {
    this.setState({
      icalUrl: event.target.value,
      hasChanges: true,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  handleSave() {
    const { shortcut } = this.props;
    const { icalUrl } = this.state;

    this.setState({ error: '', inProgress: true });
    this.props
      .updateShortcutSettings(shortcut, { icalUrl })
      .then(() => this.setState({ hasChanges: false, inProgress: false }))
      .catch(err => {
        this.setState({ error: err, inProgress: false });
      });
  }

  render() {
    const { error, hasChanges, inProgress, icalUrl } = this.state;

    return (
      <div className="ical-page">
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
            <ControlLabel>{i18next.t(LOCALIZATION.FORM_URL)}</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={icalUrl}
              onChange={this.handleTextChange}
            />
          </FormGroup>
          {error && <HelpBlock className="text-error">{error}</HelpBlock>}
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!hasChanges}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={inProgress}>
              {i18next.t(LOCALIZATION.BUTTON_SAVE)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

const mapDispatchToProps = {
  updateShortcutSettings,
};

export default connect(null, mapDispatchToProps)(IcalPage);
