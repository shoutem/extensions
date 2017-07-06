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
import { fetchShortcut, updateShortcutSettings, getShortcut } from '@shoutem/api';
import { shouldRefresh } from '@shoutem/redux-io';
import { connect } from 'react-redux';
import './style.scss';

class HelloShortcutPage extends Component {
  static propTypes = {
    shortcut: PropTypes.object,
    fetchShortcut: PropTypes.func,
    updateShortcutSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    props.fetchShortcut();

    this.state = {
      error: null,
      greeting: _.get(props.shortcut, 'settings.greeting'),
      // flag indicating if value in input field is changed
      hasChanges: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { shortcut } = this.props;
    const { shortcut: nextShortcut } = nextProps;
    const { greeting } = this.state;

    if (_.isEmpty(greeting)) {
      this.setState({
        greeting: _.get(nextShortcut, 'settings.greeting'),
      });
    }

    if (shortcut !== nextShortcut && shouldRefresh(nextShortcut)) {
      this.props.fetchShortcut();
    }
  }

  handleTextChange(event) {
    this.setState({
      greeting: event.target.value,
      hasChanges: true,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  handleSave() {
    const { shortcut } = this.props;
    const { greeting } = this.state;

    this.setState({ error: '', inProgress: true });
    this.props.updateShortcutSettings(shortcut, { greeting })
      .then(() => (
        this.setState({ hasChanges: false, inProgress: false })
      )).catch((err) => {
        this.setState({ error: err, inProgress: false });
      });
  }

  render() {
    const { error, hasChanges, inProgress, greeting } = this.state;

    return (
      <div className="hello-page">
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <h3>Choose your greeting</h3>
            <ControlLabel>Name:</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={greeting}
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
  const { shortcutId } = ownProps;

  return {
    shortcut: getShortcut(state, shortcutId),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { shortcutId } = ownProps;

  return {
    fetchShortcut: () => dispatch(fetchShortcut(shortcutId)),
    updateShortcutSettings: (shortcut, settings) => (
      dispatch(updateShortcutSettings(shortcut, settings))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HelloShortcutPage);
