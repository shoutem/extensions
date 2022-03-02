import React, { useMemo, useState } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormGroup,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer, RichTextEditor } from '@shoutem/react-web-ui';
import { updateExtensionSettings } from '@shoutem/redux-api-sdk';
import LOCALIZATION from './localization';
import './style.scss';

function resolveHasChanges(value, initialValue) {
  return value !== initialValue && !_.isEmpty(value);
}

export default function LegalPage({
  extension,
  extension: {
    settings: { privacyPolicy, termsOfService },
  },
}) {
  const dispatch = useDispatch();

  const [privacyPolicyInput, setPrivacyPolicyInput] = useState(privacyPolicy);
  const [termsOfServiceInput, setTermsOfServiceInput] = useState(
    termsOfService,
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleSavePress() {
    setIsLoading(true);

    return dispatch(
      updateExtensionSettings(extension, {
        privacyPolicy: privacyPolicyInput,
        termsOfService: termsOfServiceInput,
      }),
    ).finally(() => setIsLoading(false));
  }

  function handlePrivacyPolicyChange(value) {
    setHasChanges(resolveHasChanges(value, privacyPolicyInput));
    setPrivacyPolicyInput(value);
  }

  function handleTermsOfServiceChange(value) {
    setHasChanges(resolveHasChanges(value, termsOfServiceInput));
    setTermsOfServiceInput(value);
  }

  const saveEnabled = useMemo(() => hasChanges && !isLoading, [
    hasChanges,
    isLoading,
  ]);

  return (
    <div className="general-settings-page">
      <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
      <FormGroup>
        <ControlLabel>{i18next.t(LOCALIZATION.PRIVACY_POLICY)}</ControlLabel>
        <RichTextEditor
          onChange={handlePrivacyPolicyChange}
          value={privacyPolicyInput}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>{i18next.t(LOCALIZATION.TERMS_OF_SERVICE)}</ControlLabel>
        <RichTextEditor
          onChange={handleTermsOfServiceChange}
          value={termsOfServiceInput}
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

LegalPage.propTypes = {
  extension: PropTypes.object.isRequired,
};
