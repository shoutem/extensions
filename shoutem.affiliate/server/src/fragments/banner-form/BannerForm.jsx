import React, { useCallback, useMemo, useState } from 'react';
import { Button, ButtonToolbar, HelpBlock } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { FormInput, LoaderContainer } from '@shoutem/react-web-ui';
import { getShortcuts, updateShortcutSettings } from '@shoutem/redux-api-sdk';
import { BannerImage, BannerLink } from '../../components';
import { resolveBannerLinkOptions } from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

export default function BannerForm(props) {
  const { config, shortcut } = props;

  const dispatch = useDispatch();

  const shortcuts = useSelector(getShortcuts);

  const noneItem = useMemo(
    () => ({
      id: null,
      title: i18next.t(LOCALIZATION.NONE_MENU_ITEM_TEXT),
    }),
    [],
  );

  const bannerLinkOptions = resolveBannerLinkOptions(shortcuts);
  const resolvedBannerLinkOptions = [noneItem, ...bannerLinkOptions];

  // Check if shortcut is not deleted
  const isExistingShortcutLinked = bannerLinkOptions.find(
    shortcut => shortcut.id === config.bannerLink?.id,
  );

  const resolvedInitialBannerLink = isExistingShortcutLinked
    ? config.bannerLink
    : noneItem;

  const [title, setTitle] = useState(config.title);
  const [description, setDescription] = useState(config.description);
  const [bannerLink, setBannerLink] = useState(resolvedInitialBannerLink);
  const [imageUrl, setImageUrl] = useState(config.imageUrl);
  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState(false);

  const handleTitleChange = useCallback(
    event => setTitle(event?.target?.value),
    [],
  );

  const handleDescriptionChange = useCallback(
    event => setDescription(event?.target?.value),
    [],
  );

  const handleBannerLinkSelected = useCallback(
    bannerLink => setBannerLink(bannerLink),
    [],
  );

  const handleImageUrlChange = useCallback(
    event => setImageUrl(event?.target?.value),
    [],
  );

  const handleImageDelete = useCallback(() => setImageUrl(''), []);

  function handleSave() {
    setInProgress(true);

    const patch = {
      bannerConfig: {
        showBanner: true,
        description,
        imageUrl,
        bannerLink,
        title,
      },
    };

    dispatch(updateShortcutSettings(shortcut, patch))
      .catch(err => setError(err))
      .finally(() => setInProgress(false));
  }

  function handleResetValues() {
    setTitle(config.title);
    setDescription(config.description);
    setBannerLink(config.bannerLink);
    setImageUrl(config.imageUrl);
  }

  const hasChanges =
    config.title !== title ||
    config.description !== description ||
    config.bannerLink?.id !== bannerLink.id ||
    config.imageUrl !== imageUrl;

  return (
    <>
      <FormInput
        elementId="bannerTitle"
        error={false}
        name={i18next.t(LOCALIZATION.BANNER_TITLE_TEXT)}
        onChange={handleTitleChange}
        value={title}
      />
      <FormInput
        elementId="bannerDescription"
        error={false}
        name={i18next.t(LOCALIZATION.BANNER_DESCRIPTION_TEXT)}
        onChange={handleDescriptionChange}
        value={description}
      />
      <BannerLink
        onSelect={handleBannerLinkSelected}
        selectedShortcutLink={bannerLink}
        shortcutOptions={resolvedBannerLinkOptions}
      />
      <BannerImage
        imageUrl={imageUrl}
        onDeleteImageClick={handleImageDelete}
        onImageUrlChange={handleImageUrlChange}
      />

      <div className="banner-page__footer">
        {!!error && (
          <div className="has-error">
            <HelpBlock>{error}</HelpBlock>
          </div>
        )}
        <ButtonToolbar>
          <Button bsStyle="primary" disabled={!hasChanges} onClick={handleSave}>
            <LoaderContainer isLoading={inProgress}>
              {i18next.t(LOCALIZATION.SAVE_BUTTON_TEXT)}
            </LoaderContainer>
          </Button>
          <Button disabled={!hasChanges} onClick={handleResetValues}>
            {i18next.t(LOCALIZATION.CANCEL_BUTTON_TEXT)}
          </Button>
        </ButtonToolbar>
      </div>
    </>
  );
}

BannerForm.propTypes = {
  config: PropTypes.object.isRequired,
  shortcut: PropTypes.object.isRequired,
};
