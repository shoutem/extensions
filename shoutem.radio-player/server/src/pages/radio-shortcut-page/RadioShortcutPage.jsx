import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonToolbar,
  Checkbox,
  ControlLabel,
  FormGroup,
} from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import { useDispatch } from 'react-redux';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { fetchShortcut, updateShortcutSettings } from '@shoutem/redux-api-sdk';
import SettingField from '../../components/SettingField';
import getWeServUrl from '../../services/getWeServUrl';
import LOCALIZATION from './localization';
import './style.scss';

export function RadioShortcutPage({ shortcut }) {
  const [initialized, setInitialized] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [shortcutSettings, setShortcutSettings] = useState({});
  const [screenSettings, setScreenSettings] = useState({});

  const dispatch = useDispatch();

  const { ref } = useInView({
    // This settings page is rendered differently depending on screen settings.
    // Screen settings are defined by the screen layout that user chooses in another tab.
    // Currently, we don't have the mechanism to sync props between two settings page tabs.
    // Instead, we track the visibility of this page and, if it changed and is visible again
    // we will refetch the shortcut to make sure new screen settings are loaded.
    onChange: handlePageVisibilityChange,
    initialInView: true,
  });

  useEffect(() => {
    if (!shortcut) {
      return;
    }

    const { settings = {}, screen: canonicalType, screens } = shortcut;

    const screen = _.find(screens, { canonicalType });
    const currentScreenSettings = screen?.settings;

    setShortcutSettings(settings);
    setScreenSettings(currentScreenSettings);
    setInitialized(true);
  }, [shortcut]);

  function handlePageVisibilityChange(isVisible) {
    if (isVisible) {
      dispatch(fetchShortcut(shortcut.id));
    }
  }

  function handleFormItemChange(event, key) {
    const newSettings = { ...shortcutSettings, [key]: event.target?.value };

    setShortcutSettings(newSettings);
  }

  function handleToggleSharing() {
    const { showSharing } = shortcutSettings;
    const newSettings = { ...shortcutSettings, showSharing: !showSharing };

    setShortcutSettings(newSettings);
  }

  function handleToggleArtwork() {
    const { showArtwork } = shortcutSettings;
    const newSettings = { ...shortcutSettings, showArtwork: !showArtwork };

    setShortcutSettings(newSettings);
  }

  function validateForm() {
    const { streamUrl, feedUrl } = shortcutSettings;
    const { canHaveRssFeed } = screenSettings;
    const errors = {};

    if (!streamUrl) {
      errors.streamUrl = i18next.t(LOCALIZATION.FORM_STREAM_URL_FIELD_ERROR);
    }

    if (canHaveRssFeed && !feedUrl) {
      errors.feedUrl = i18next.t(LOCALIZATION.FORM_FEED_URL_FIELD_ERROR);
    }

    return errors;
  }

  async function handleSaveSettings() {
    const errors = validateForm();

    if (!_.isEmpty(errors)) {
      setErrors(errors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    await dispatch(updateShortcutSettings(shortcut, { ...shortcutSettings }));

    setIsLoading(false);
  }

  const {
    streamUrl,
    feedUrl,
    streamTitle,
    backgroundImageUrl,
    showArtwork,
    showSharing,
  } = shortcutSettings;

  const {
    canToggleArtwork,
    canUseBackgroundImage,
    canHaveRssFeed,
    canShowStreamTitle,
  } = screenSettings;

  const imageSrc =
    canUseBackgroundImage &&
    !!backgroundImageUrl &&
    getWeServUrl(backgroundImageUrl, 200);

  return (
    <div ref={ref}>
      <LoaderContainer isLoading={!initialized}>
        <FormGroup>
          <ControlLabel>{i18next.t(LOCALIZATION.FORM_LABEL_NOTE)}</ControlLabel>
          <SettingField
            fieldKey="streamUrl"
            errorText={errors.streamUrl}
            onChange={handleFormItemChange}
            textValue={streamUrl}
            title={i18next.t(LOCALIZATION.FORM_STREAM_URL_FIELD_TITLE)}
          />
          {canHaveRssFeed && (
            <SettingField
              fieldKey="feedUrl"
              errorText={errors.feedUrl}
              onChange={handleFormItemChange}
              textValue={feedUrl}
              title={i18next.t(LOCALIZATION.FORM_FEED_URL_FIELD_TITLE)}
            />
          )}
          {canShowStreamTitle && (
            <SettingField
              fieldKey="streamTitle"
              onChange={handleFormItemChange}
              textValue={streamTitle}
              title={i18next.t(LOCALIZATION.FORM_STREAM_FIELD_TITLE)}
            />
          )}
          {canUseBackgroundImage && (
            <SettingField
              fieldKey="backgroundImageUrl"
              onChange={handleFormItemChange}
              textValue={backgroundImageUrl}
              title={i18next.t(LOCALIZATION.FORM_BACKGROUND_FIELD_TITLE)}
              popoverMessage={i18next.t(
                LOCALIZATION.FORM_BACKGROUND_FIELD_POPOVER,
              )}
            />
          )}
          {!!imageSrc && (
            <div>
              <ControlLabel className="background-image-label">
                {i18next.t(LOCALIZATION.BACKGROUND_IMAGE_LABEL_TEXT)}
              </ControlLabel>
              <img
                alt={i18next.t(LOCALIZATION.BACKGROUND_IMAGE_ALT_TEXT)}
                src={imageSrc}
              />
            </div>
          )}
          <Checkbox
            checked={showSharing}
            name="Enable Sharing"
            onChange={handleToggleSharing}
          >
            {i18next.t(LOCALIZATION.FORM_SHARING_CHECKBOX_TITLE)}
          </Checkbox>
          {canToggleArtwork && (
            <Checkbox
              checked={showArtwork}
              name="Display artwork"
              onChange={handleToggleArtwork}
            >
              {i18next.t(LOCALIZATION.FORM_ARTWORK_CHECKBOX_TITLE)}
            </Checkbox>
          )}
          <ButtonToolbar>
            <Button bsStyle="primary" onClick={handleSaveSettings}>
              <LoaderContainer isLoading={isLoading}>
                {i18next.t(LOCALIZATION.BUTTON_SAVE)}
              </LoaderContainer>
            </Button>
          </ButtonToolbar>
        </FormGroup>
      </LoaderContainer>
    </div>
  );
}

RadioShortcutPage.propTypes = {
  shortcut: PropTypes.object.isRequired,
};
