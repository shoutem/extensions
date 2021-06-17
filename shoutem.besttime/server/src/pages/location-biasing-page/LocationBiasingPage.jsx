import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { Trans } from 'react-i18next';
import { connect } from 'react-redux';
import { Checkbox, LoaderContainer } from '@shoutem/react-web-ui';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import LOCALIZATION from './localization';
import './style.scss';

const LOCATION_BIASING_DOCS_URL =
  'https://developers.google.com/maps/documentation/places/web-service/autocomplete#location_biasing';

class LocationBiasingPage extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      error: '',
      hasChanges: false,
      inProgress: false,
      radius: props.shortcut.settings?.radius || '50000',
      useLocationBiasing: props.shortcut.settings?.useLocationBiasing,
    };
  }

  handleToggle(event) {
    if (!event.target) {
      return;
    }

    const { shortcut, updateShortcutSettings } = this.props;

    const useLocationBiasing = event.target.checked;

    this.setState({ useLocationBiasing });
    updateShortcutSettings(shortcut, { useLocationBiasing });
  }

  handleRadiusTextChange(event) {
    this.setState({
      error: '',
      hasChanges: true,
      radius: event.target.value,
    });
  }

  handleSave() {
    const { radius } = this.state;

    if (!radius || isNaN(radius)) {
      this.setState({
        error: i18next.t(LOCALIZATION.LOCATION_BIASING_RADIUS_ERROR),
      });

      return;
    }

    const { shortcut, updateShortcutSettings } = this.props;
    const { useLocationBiasing } = this.state;

    this.setState({ error: '', inProgress: true });
    updateShortcutSettings(shortcut, { radius, useLocationBiasing })
      .then(() =>
        this.setState({
          hasChanges: false,
          inProgress: false,
        }),
      )
      .catch(err => {
        this.setState({ error: err, inProgress: false });
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  render() {
    const {
      error,
      hasChanges,
      inProgress,
      radius,
      useLocationBiasing,
    } = this.state;

    return (
      <div className="settings-page">
        <div>
          <Checkbox checked={useLocationBiasing} onChange={this.handleToggle}>
            {i18next.t(LOCALIZATION.BIASING_CHECKBOX_LABEL)}
          </Checkbox>
        </div>
        <p>
          <Trans i18nKey={LOCALIZATION.LOCATION_BIASING_EXPLANATION}>
            If enabled, users will be asked for location permissions when
            opening the BestTime Search screen. Their location will then be used
            to make Google Places Autocomplete API use it's{' '}
            <a
              href={LOCATION_BIASING_DOCS_URL}
              rel="noopener noreferrer"
              target="_blank"
              download
            >
              location biasing
            </a>{' '}
            and prefer businesses within the given radius of the device
            location, while still showing relevant results outside of it.
          </Trans>
        </p>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.LOCATION_BIASING_RADIUS_LABEL)}
            </ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={radius}
              onChange={this.handleRadiusTextChange}
            />
          </FormGroup>
          {error && <HelpBlock className="text-error">{error}</HelpBlock>}
        </form>
        <ButtonToolbar className="save-button">
          <Button
            bsStyle="primary"
            disabled={!hasChanges}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={inProgress}>
              {i18next.t(LOCALIZATION.LOCATION_BIASING_SAVE_BUTTON)}
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
        <p>{i18next.t(LOCALIZATION.LOCATION_BIASING_NOTE)}</p>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateShortcutSettings: (shortcut, settings) =>
      dispatch(updateShortcutSettings(shortcut, settings)),
  };
}

export default connect(null, mapDispatchToProps)(LocationBiasingPage);
