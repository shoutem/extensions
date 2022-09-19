import React, { useCallback, useMemo, useState } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { isURL } from 'validator';
import { AssetManager } from '@shoutem/assets-sdk';
import { ImageUploader, LoaderContainer } from '@shoutem/react-web-ui';
import { updateExtensionSettings } from '@shoutem/redux-api-sdk';
import { ext } from '../../const';
import LOCALIZATION from './localization';
import './style.scss';

function resolveHasChanges(value, initialValue) {
  return value !== initialValue && !_.isEmpty(value);
}

export default function AgeRestrictionPage({
  appId,
  extension,
  extension: {
    settings: { requiredAge, privacyPolicy, termsOfService, backgroundImage },
  },
  url,
}) {
  const dispatch = useDispatch();

  const [ageInput, setAgeInput] = useState(requiredAge);
  const [ageError, setAgeError] = useState();
  const [image, setImage] = useState(backgroundImage);
  const [privacyPolicyInput, setPrivacyPolicyInput] = useState(privacyPolicy);
  const [privacyPolicyError, setPrivacyPolicyError] = useState();
  const [termsOfServiceInput, setTermsOfServiceInput] = useState(
    termsOfService,
  );
  const [termsOfServiceError, setTermsOfServiceError] = useState();
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleSavePress() {
    setIsLoading(true);

    const error = validateInputs();

    if (error) {
      return setIsLoading(false);
    }

    return dispatch(
      updateExtensionSettings(extension, {
        requiredAge: ageInput,
        backgroundImage: image,
        privacyPolicy: privacyPolicyInput,
        termsOfService: termsOfServiceInput,
      }),
    ).finally(() => setIsLoading(false));
  }

  function validateInputs() {
    let error = false;

    if (_.isEmpty(ageInput)) {
      setAgeError(i18next.t(LOCALIZATION.EMPTY_INPUT_ERROR));
      error = true;
    }

    if (_.isEmpty(privacyPolicyInput) || !isURL(privacyPolicyInput)) {
      setPrivacyPolicyError(i18next.t(LOCALIZATION.INVALID_URL));
      error = true;
    }

    if (_.isEmpty(termsOfServiceInput) || !isURL(termsOfServiceInput)) {
      setTermsOfServiceError(i18next.t(LOCALIZATION.INVALID_URL));
      error = true;
    }

    return error;
  }

  const assetManager = useMemo(
    () =>
      new AssetManager({
        scopeType: 'application',
        scopeId: appId,
        assetPolicyHost: url.apps,
      }),
    [appId, url.apps],
  );

  const handleAgeChange = useCallback(
    ({ target: { value } }) => {
      setHasChanges(resolveHasChanges(value, ageInput));
      setAgeError(null);
      return setAgeInput(value);
    },
    [ageInput],
  );

  const handlePrivacyPolicyChange = useCallback(
    ({ target: { value } }) => {
      setHasChanges(resolveHasChanges(value, privacyPolicyInput));
      setPrivacyPolicyError(null);
      return setPrivacyPolicyInput(value);
    },
    [privacyPolicyInput],
  );

  const handleTermsOfServiceChange = useCallback(
    ({ target: { value } }) => {
      setHasChanges(resolveHasChanges(value, termsOfServiceInput));
      setTermsOfServiceError(null);
      return setTermsOfServiceInput(value);
    },
    [termsOfServiceInput],
  );

  const handleDeleteImage = useCallback(() => {
    setImage(null);
    setHasChanges(true);
  }, []);

  const handleImageChange = useCallback(
    value => {
      setHasChanges(resolveHasChanges(value, image));
      setImage(value);
    },
    [image],
  );

  const hasError = useMemo(
    () =>
      !_.isEmpty(ageError) &&
      !_.isEmpty(privacyPolicyError) &&
      !_.isEmpty(termsOfServiceError),
    [ageError, privacyPolicyError, termsOfServiceError],
  );

  const saveEnabled = useMemo(() => hasChanges && !isLoading && !hasError, [
    hasChanges,
    isLoading,
    hasError,
  ]);

  return (
    <div className="general-settings-page">
      <FormGroup>
        <ControlLabel>
          {i18next.t(LOCALIZATION.REQUIRED_AGE_LABEL)}
        </ControlLabel>
        <FormControl
          className="form-control"
          type="number"
          onChange={handleAgeChange}
          value={ageInput}
        />
        {!!ageError && <HelpBlock className="text-error">{ageError}</HelpBlock>}
      </FormGroup>
      <FormGroup>
        <ControlLabel>{i18next.t(LOCALIZATION.PRIVACY_POLICY)}</ControlLabel>
        <FormControl
          className="form-control"
          type="text"
          onChange={handlePrivacyPolicyChange}
          value={privacyPolicyInput}
        />
        {!!privacyPolicyError && (
          <HelpBlock className="text-error">{privacyPolicyError}</HelpBlock>
        )}
      </FormGroup>
      <FormGroup>
        <ControlLabel>{i18next.t(LOCALIZATION.TERMS_OF_SERVICE)}</ControlLabel>
        <FormControl
          className="form-control"
          type="text"
          onChange={handleTermsOfServiceChange}
          value={termsOfServiceInput}
        />
        {!!termsOfServiceError && (
          <HelpBlock className="text-error">{termsOfServiceError}</HelpBlock>
        )}
      </FormGroup>
      <FormGroup>
        <ControlLabel>
          {i18next.t(LOCALIZATION.BACKGROUND_IMAGE_TITLE)}
        </ControlLabel>
        <ImageUploader
          className="general-settings-page__image-uploader"
          assetManager={assetManager}
          accept="image/png"
          folderName={ext()}
          onDeleteSuccess={handleDeleteImage}
          onDrop={handleImageChange}
          onUploadSuccess={handleImageChange}
          preview={image}
          previewSize="custom"
          height={1920}
          width={1080}
        />
      </FormGroup>
      <ButtonToolbar>
        <Button
          bsStyle="primary"
          disabled={!saveEnabled}
          onClick={handleSavePress}
        >
          <LoaderContainer isLoading={isLoading}>
            {i18next.t(LOCALIZATION.SAVE_BUTTON)}
          </LoaderContainer>
        </Button>
      </ButtonToolbar>
    </div>
  );
}

AgeRestrictionPage.propTypes = {
  appId: PropTypes.string.isRequired,
  extension: PropTypes.object.isRequired,
  url: PropTypes.object.isRequired,
};
