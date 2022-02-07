import React, { useMemo, useState } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { LoaderContainer, Switch } from '@shoutem/react-web-ui';
import { getExtension, updateExtensionSettings } from '@shoutem/redux-api-sdk';
import LOCALIZATION from './localization';
import './style.scss';

function SettingsPage({ extension, updateExtensionSettings }) {
  const {
    settings: { userProfileRequired: currentUserProfileRequired },
  } = extension;

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [userProfileRequired, setUserProfileRequired] = useState(
    currentUserProfileRequired,
  );
  const hasChanges = useMemo(
    () => currentUserProfileRequired !== userProfileRequired,
    [currentUserProfileRequired, userProfileRequired],
  );

  function handleUserProfileRequiredToggle() {
    setUserProfileRequired(prevValue => !prevValue);
    setError(null);
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      await updateExtensionSettings(extension, { userProfileRequired });
    } catch {
      setError(i18next.t(LOCALIZATION.GENERAL_ERROR));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="user-profile-settings-page">
      <h3>{i18next.t(LOCALIZATION.USER_PROFILE_REQUIRED_TITLE)}</h3>
      <FormGroup className="switch-form-group">
        <ControlLabel>
          {i18next.t(LOCALIZATION.USER_PROFILE_REQUIRED_TOGGLE_LABEL)}
        </ControlLabel>
        <Switch
          onChange={handleUserProfileRequiredToggle}
          value={userProfileRequired}
        />
      </FormGroup>
      <ButtonToolbar className="save-button">
        <Button bsStyle="primary" disabled={!hasChanges} onClick={handleSubmit}>
          <LoaderContainer isLoading={isLoading}>
            {i18next.t(LOCALIZATION.SAVE)}
          </LoaderContainer>
        </Button>
      </ButtonToolbar>
      {!!error && <HelpBlock className="text-error">{error}</HelpBlock>}
    </div>
  );
}

SettingsPage.propTypes = {
  extension: PropTypes.object.isRequired,
  updateExtensionSettings: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const { extensionName } = ownProps;

  return {
    extension: getExtension(state, extensionName),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateExtensionSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
