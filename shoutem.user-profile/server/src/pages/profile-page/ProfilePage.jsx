import React, { useState } from 'react';
import { Button, ButtonToolbar, HelpBlock } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FormInput, LoaderContainer } from '@shoutem/react-web-ui';
import { getExtension, updateExtensionSettings } from '@shoutem/redux-api-sdk';
import LOCALIZATION from './localization';
import './style.scss';

export default function ProfilePage(props) {
  const { extensionName } = props;

  const extension = useSelector(state => getExtension(state, extensionName));
  const {
    settings: { profileForm = '' },
  } = extension;

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [userProfile, setUserProfile] = useState(profileForm);

  function handleUserProfileChange(event) {
    setError('');
    setUserProfile(event.target.value);
  }

  async function handleSubmit() {
    setIsLoading(true);

    try {
      const parsedJson = JSON.parse(userProfile);

      // !_.isObject(parsedJson) - because double quotations are JSON parseable
      if (!parsedJson || !_.isObject(parsedJson)) {
        return null;
      }

      await dispatch(
        updateExtensionSettings(extension, {
          profileForm: JSON.stringify(parsedJson),
        }),
      );
    } catch (e) {
      setError(i18next.t(LOCALIZATION.INVALID_JSON));
    } finally {
      setIsLoading(false);
    }

    return null;
  }

  const hasChanges = profileForm !== userProfile;

  return (
    <div className="profile-page">
      <form onSubmit={handleSubmit}>
        <h3>{i18next.t(LOCALIZATION.ENTER_PROFILE_TITLE)}</h3>
        <FormInput
          className="profile-page__form"
          element="textarea"
          name={i18next.t(LOCALIZATION.PROFILE_LABEL)}
          onChange={handleUserProfileChange}
          value={userProfile}
        />
        {error && <HelpBlock className="text-error">{error}</HelpBlock>}
      </form>
      <ButtonToolbar className="save-button">
        <Button bsStyle="primary" disabled={!hasChanges} onClick={handleSubmit}>
          <LoaderContainer isLoading={isLoading}>
            {i18next.t(LOCALIZATION.SAVE)}
          </LoaderContainer>
        </Button>
      </ButtonToolbar>
    </div>
  );
}

ProfilePage.propTypes = {
  extensionName: PropTypes.string.isRequired,
};
