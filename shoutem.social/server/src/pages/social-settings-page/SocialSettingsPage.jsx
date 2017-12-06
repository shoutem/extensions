import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import {
  LoaderContainer,
  Switch,
  FontIconPopover,
  FontIcon,
} from '@shoutem/react-web-ui';
import { fetchExtension, updateExtensionSettings } from '@shoutem/redux-api-sdk';
import { shouldLoad } from '@shoutem/redux-io';
import './style.scss';

class SocialSettingsPage extends Component {
  static propTypes = {
    ownExtension: PropTypes.object,
    fetchExtension: PropTypes.func,
    updateExtensionSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTogglePhotoAttachments = this.handleTogglePhotoAttachments.bind(this);
    this.handleToggleComments = this.handleToggleComments.bind(this);
    this.handleToggleInteractions = this.handleToggleInteractions.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    const settings = _.get(this.props, 'ownExtension.settings', {});
    this.state = {
      settings,
      error: null,
      hasChanges: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (shouldLoad(nextProps, this.props, 'ownExtension')) {
      this.props.fetchExtension();
    }
  }

  handleTextChange(event) {
    const { settings } = this.state;

    this.setState({
      settings: {
        ...settings,
        maxStatusLength: Number(event.target.value),
      },
    });
  }

  handleTogglePhotoAttachments() {
    const { settings } = this.state;
    const { enablePhotoAttachments } = settings;

    this.setState({
      settings: {
        ...settings,
        enablePhotoAttachments: !enablePhotoAttachments,
      }
    });
  }

  handleToggleComments() {
    const { settings } = this.state;
    const { enableComments } = settings;

    this.setState({
      settings: {
        ...settings,
        enableComments: !enableComments,
      },
    });
  }

  handleToggleInteractions() {
    const { settings } = this.state;
    const { enableInteractions } = settings;

    this.setState({
      settings: {
        ...settings,
        enableInteractions: !enableInteractions,
      },
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  handleSave() {
    const { extension } = this.props;
    const { settings } = this.state;

    this.setState({ error: null, inProgress: true });

    this.props.updateExtensionSettings(extension, settings)
      .then(() => this.setState({ inProgress: false }))
      .catch(() => this.setState({
        error: 'Something went wrong, please try again',
        inProgress: false,
      }));
  }

  render() {
    const { error, inProgress, settings } = this.state;
    const {
      maxStatusLength,
      enablePhotoAttachments,
      enableComments,
      enableInteractions,
    } = settings;

    const initialSettings = _.get(this.props, 'ownExtension.settings', {});
    const hasChanges = !_.isEqual(settings, initialSettings);

    return (
      <div className="social-settings-page">
        <form onSubmit={this.handleSubmit}>
          <h3>General settings</h3>
          <FormGroup className="social-settings-page__status-length">
            <ControlLabel>Max status length:</ControlLabel>
            <FormControl
              type="number"
              className="form-control"
              value={maxStatusLength}
              onChange={this.handleTextChange}
            />
          </FormGroup>
          <FormGroup className="social-settings-page__photos">
            <ControlLabel>Enable photo attachments</ControlLabel>
            <Switch
              className="social-settings-page__switch"
              onChange={this.handleTogglePhotoAttachments}
              value={enablePhotoAttachments}
            />
          </FormGroup>
          <FormGroup className="social-settings-page__comments">
            <ControlLabel>Enable comments</ControlLabel>
            <Switch
              className="social-settings-page__switch"
              onChange={this.handleToggleComments}
              value={enableComments}
            />
          </FormGroup>
          <FormGroup className="social-settings-page__interactions">
            <ControlLabel>Enable interactions</ControlLabel>
            <Switch
              className="social-settings-page__switch"
              onChange={this.handleToggleInteractions}
              value={enableInteractions}
            />
            <FontIconPopover message="Enable users to like posts">
              <FontIcon
                className="social-settings-page__icon-popover"
                name="info"
                size="24px"
              />
            </FontIconPopover>
          </FormGroup>
          {error &&
            <HelpBlock className="text-error">{error}</HelpBlock>
          }
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!hasChanges}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={inProgress}>
              Save
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const { ownExtensionName } = ownProps;

  return {
    fetchExtension: () => dispatch(fetchExtension(ownExtensionName)),
    updateExtensionSettings: (extension, settings) => (
      dispatch(updateExtensionSettings(extension, settings))
    ),
  };
}

export default connect(null, mapDispatchToProps)(SocialSettingsPage);
