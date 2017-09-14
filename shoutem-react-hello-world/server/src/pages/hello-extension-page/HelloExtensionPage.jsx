import React, { Component, PropTypes } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { fetchExtension, updateExtensionSettings, getExtension } from '@shoutem/redux-api-sdk';
import { shouldRefresh } from '@shoutem/redux-io';
import { connect } from 'react-redux';
import './style.scss';

class HelloExtensionPage extends Component {
  static propTypes = {
    extension: PropTypes.object,
    fetchExtension: PropTypes.func,
    updateExtensionSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    props.fetchExtension();

    this.state = {
      error: null,
      greetingTemplate: _.get(props.extension, 'settings.greetingTemplate'),
      // flag indicating if value in input field is changed
      hasChanges: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { extension } = this.props;
    const { extension: nextExtension } = nextProps;
    const { greetingTemplate } = this.state;

    if (_.isEmpty(greetingTemplate)) {
      this.setState({
        greetingTemplate: _.get(nextExtension, 'settings.greetingTemplate'),
      });
    }

    if (extension !== nextExtension && shouldRefresh(nextExtension)) {
      this.props.fetchExtension();
    }
  }

  handleTextChange(event) {
    this.setState({
      greetingTemplate: event.target.value,
      hasChanges: true,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  handleSave() {
    const { extension } = this.props;
    const { greetingTemplate } = this.state;

    this.setState({ error: '', inProgress: true });
    this.props.updateExtensionSettings(extension, { greetingTemplate })
      .then(() => (
        this.setState({ hasChanges: false, inProgress: false })
      )).catch((err) => {
        this.setState({ error: err, inProgress: false });
      });
  }

  render() {
    const { error, hasChanges, inProgress, greetingTemplate } = this.state;

    return (
      <div className="hello-extension-settings-page">
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <h3>Configure greeting template</h3>
            <ControlLabel>Template:</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={greetingTemplate}
              onChange={this.handleTextChange}
            />
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

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;

  return {
    extension: getExtension(state, extensionName),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;

  return {
    fetchExtension: () => dispatch(fetchExtension(extensionName)),
    updateExtensionSettings: (extension, settings) => (
      dispatch(updateExtensionSettings(extension, settings))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HelloExtensionPage);

