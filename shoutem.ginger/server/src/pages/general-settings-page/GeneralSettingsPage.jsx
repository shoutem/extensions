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
import { AssetManager } from '@shoutem/assets-sdk';
import {
  FormInput,
  ImageUploader,
  LoaderContainer,
} from '@shoutem/react-web-ui';
import { updateExtensionSettings } from '@shoutem/redux-api-sdk';
import { ext } from '../../const';
import LOCALIZATION from './localization';
import './style.scss';

export default function GeneralSettingsPage({
  appId,
  extension,
  extension: {
    settings: { storeApiKey, retailerList, supportEmail, backgroundImage },
  },
  url,
}) {
  const dispatch = useDispatch();

  const [apiKey, setApiKey] = useState(storeApiKey);
  const [email, setEmail] = useState(supportEmail);
  const [image, setImage] = useState(backgroundImage);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [retailers, setRetailers] = useState(
    retailerList ? JSON.stringify(retailerList) : retailerList,
  );
  const [error, setError] = useState();

  function resolveHasChanges(value, initialValue) {
    return value !== initialValue && !_.isEmpty(value);
  }

  function handleApiKeyChange(event) {
    const { value } = event.target;

    setHasChanges(resolveHasChanges(value, storeApiKey));
    setApiKey(value);
  }

  function handleRetailersChange(event) {
    const { value } = event.target;

    setHasChanges(resolveHasChanges(value, retailers));
    setRetailers(value);
  }

  function handleEmailChange(event) {
    const { value } = event.target;

    setHasChanges(resolveHasChanges(value, supportEmail));
    setEmail(value);
  }

  function handleImageChange(value) {
    setHasChanges(resolveHasChanges(value, backgroundImage));
    setImage(value);
  }

  const handleDeleteImage = useCallback(() => {
    setImage(null);
    setHasChanges(true);
  }, []);

  function handleSavePress() {
    setIsLoading(true);
    setError();

    try {
      const parsedJson = JSON.parse(retailers);

      if (!parsedJson || !_.isArray(parsedJson)) {
        setError(i18next.t(LOCALIZATION.INVALID_JSON_MESSAGE));
        setIsLoading(false);
        return;
      }

      dispatch(
        updateExtensionSettings(extension, {
          storeApiKey: apiKey,
          supportEmail: email,
          backgroundImage: image,
          retailerList: parsedJson,
        }),
      ).finally(() => setIsLoading(false));
    } catch (e) {
      setError(i18next.t(LOCALIZATION.INVALID_JSON_MESSAGE));
      setIsLoading(false);
    }
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

  const saveEnabled = useMemo(() => hasChanges && !isLoading, [
    hasChanges,
    isLoading,
  ]);

  return (
    <div className="general-settings-page">
      <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
      <FormGroup>
        <ControlLabel>{i18next.t(LOCALIZATION.API_KEY_TITLE)}</ControlLabel>
        <FormControl
          className="form-control"
          onChange={handleApiKeyChange}
          type="text"
          value={apiKey}
        />
      </FormGroup>
      <FormGroup>
        <FormInput
          className="retailers__form"
          element="textarea"
          name={i18next.t(LOCALIZATION.RETAILER_LIST_TITLE)}
          onChange={handleRetailersChange}
          value={retailers}
          placeholder={i18next.t(LOCALIZATION.RETAILER_LIST_PLACEHOLDER)}
        />
        {error && <HelpBlock className="text-error">{error}</HelpBlock>}
      </FormGroup>
      <FormGroup>
        <ControlLabel>
          {i18next.t(LOCALIZATION.SUPPORT_MAIL_TITLE)}
        </ControlLabel>
        <FormControl
          className="form-control"
          onChange={handleEmailChange}
          type="text"
          value={email}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>
          {i18next.t(LOCALIZATION.BACKGROUND_IMAGE_TITLE)}
        </ControlLabel>
        <ImageUploader
          className="general-settings-page__image-uploader"
          assetManager={assetManager}
          accept="image/*"
          folderName={ext()}
          onDeleteSuccess={handleDeleteImage}
          onDrop={handleImageChange}
          onUploadSuccess={handleImageChange}
          previewSize="large"
          preview={image}
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

GeneralSettingsPage.propTypes = {
  appId: PropTypes.string.isRequired,
  extension: PropTypes.object.isRequired,
  url: PropTypes.object.isRequired,
};
