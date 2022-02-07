import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import emptyImage from 'assets/images/empty-state-affiliate.svg';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import {
  EmptyResourcePlaceholder,
  LoaderContainer,
} from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default function AffiliateDisabledPlaceholder(props) {
  const [hasError, setHasError] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  function handleEnableAffiliateClick() {
    const { onEnableAffiliateClick } = props;

    setInProgress(true);

    // If successful, component will unmount so we don't need .then() here
    onEnableAffiliateClick().catch(() => {
      setInProgress(false);
      setHasError(true);
    });
  }

  const displayButtonLabel = hasError
    ? i18next.t(LOCALIZATION.DISABLED_PLACEHOLDER_BUTTON_TRY_AGAIN_TITLE)
    : i18next.t(LOCALIZATION.DISABLED_PLACEHOLDER_BUTTON_GET_STARTED_TITLE);

  return (
    <EmptyResourcePlaceholder
      className="affiliate-disabled-placeholder"
      imageSrc={emptyImage}
      title={i18next.t(LOCALIZATION.DISABLED_PLACEHOLDER_TITLE)}
    >
      <p>{i18next.t(LOCALIZATION.DISABLED_PLACEHOLDER_DESCRIPTION)}</p>
      <Button
        bsSize="large"
        bsStyle="primary"
        onClick={handleEnableAffiliateClick}
      >
        <LoaderContainer isLoading={inProgress}>
          {displayButtonLabel}
        </LoaderContainer>
      </Button>
      {hasError && (
        <p className="text-error">
          {i18next.t(
            LOCALIZATION.DISABLED_PLACEHOLDER_FAILED_TO_ENABLE_MESSAGE,
          )}
        </p>
      )}
    </EmptyResourcePlaceholder>
  );
}

AffiliateDisabledPlaceholder.propTypes = {
  onEnableAffiliateClick: PropTypes.func.isRequired,
};
