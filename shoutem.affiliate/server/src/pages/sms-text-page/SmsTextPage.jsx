import React, { useState } from 'react';
import { Button, ButtonToolbar, ControlLabel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import {
  FontIcon,
  FontIconPopover,
  FormInput,
  LoaderContainer,
} from '@shoutem/react-web-ui';
import { getExtension, updateExtensionSettings } from '@shoutem/redux-api-sdk';
import LOCALIZATION from './localization';
import './style.scss';

export default function SmsTextPage(props) {
  const { extensionName } = props;
  const extension = useSelector(state => getExtension(state, extensionName));

  const {
    settings: {
      shareMessage: prevShareMessage = '',
      collectPhoneNumber: prevCollectPhoneNumber = '',
      collectMessage: prevCollectMessage = '',
    },
  } = extension;

  const dispatch = useDispatch();

  const [shareMessage, setShareMessage] = useState(prevShareMessage);
  const [collectPhoneNumber, setCollectPhoneNumber] = useState(
    prevCollectPhoneNumber,
  );
  const [collectMessage, setCollectMessage] = useState(prevCollectMessage);
  const [isLoading, setIsLoading] = useState(false);

  const isSaveEnabled =
    (prevShareMessage !== shareMessage ||
      prevCollectMessage !== collectMessage ||
      prevCollectPhoneNumber !== collectPhoneNumber) &&
    !isLoading;

  function handleSavePress() {
    setIsLoading(true);
    const settings = { shareMessage, collectPhoneNumber, collectMessage };

    dispatch(updateExtensionSettings(extension, settings)).then(() =>
      setIsLoading(false),
    );
  }

  function handleShareMessageChange(event) {
    setShareMessage(event.target.value);
  }

  function handleCollectPhoneNumberChange(event) {
    setCollectPhoneNumber(event.target.value);
  }

  function handleCollectMessageChange(event) {
    setCollectMessage(event.target.value);
  }

  return (
    <div className="sharing-page">
      <ControlLabel>
        {i18next.t(LOCALIZATION.COLLECT_PHONE_NUMBER_LABEL)}
      </ControlLabel>

      <FormInput
        value={collectPhoneNumber}
        onChange={handleCollectPhoneNumberChange}
        placeholder={i18next.t(LOCALIZATION.PHONE_NUMBER_PLACEHOLDER)}
      />
      <div className="sharing-page__label-popover-container">
        <ControlLabel>
          {i18next.t(LOCALIZATION.COLLECT_MESSAGE_LABEL)}
        </ControlLabel>
        <FontIconPopover
          className="sharing-page__popover"
          message={i18next.t(LOCALIZATION.COLLECT_MESSAGE_POPOVER)}
        >
          <FontIcon
            className="sharing-page__icon-popover"
            name="info"
            size="24px"
          />
        </FontIconPopover>
      </div>
      <FormInput
        element="textarea"
        value={collectMessage}
        onChange={handleCollectMessageChange}
        enableEmojiPicker
        placeholder={i18next.t(LOCALIZATION.COLLECT_MESSAGE_PLACEHOLDER)}
      />
      <div className="sharing-page__label-popover-container">
        <ControlLabel>
          {i18next.t(LOCALIZATION.SHARE_MESSAGE_LABEL)}
        </ControlLabel>
        <FontIconPopover
          className="sharing-page__popover"
          message={i18next.t(LOCALIZATION.SHARE_MESSAGE_POPOVER)}
        >
          <FontIcon
            className="sharing-page__icon-popover"
            name="info"
            size="24px"
          />
        </FontIconPopover>
      </div>
      <FormInput
        element="textarea"
        value={shareMessage}
        onChange={handleShareMessageChange}
        enableEmojiPicker
        placeholder={i18next.t(LOCALIZATION.SHARE_MESSAGE_PLACEHOLDER)}
      />
      <ButtonToolbar>
        <Button
          bsStyle="primary"
          disabled={!isSaveEnabled}
          onClick={handleSavePress}
        >
          <LoaderContainer isLoading={isLoading}>
            {i18next.t(LOCALIZATION.SAVE_BUTTON_TEXT)}
          </LoaderContainer>
        </Button>
      </ButtonToolbar>
    </div>
  );
}

SmsTextPage.propTypes = {
  extensionName: PropTypes.string.isRequired,
};
