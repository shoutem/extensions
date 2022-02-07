import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { updateExtensionSettings } from '@shoutem/redux-api-sdk';
import { connect } from 'react-redux';
import { Trans } from 'react-i18next';
import i18next from 'i18next';
import { AssetManager } from '@shoutem/assets-sdk';
import { LanguageSelect } from 'src/components';
import { TranslationsDashboard } from 'src/modules/translations';
import {
  createChannel,
  updateChannel,
  deleteChannel,
} from 'src/modules/channels';
import { invalidateCurrentBuild, navigateToUrl } from 'src/redux';
import {
  DEFAULT_LANGUAGE_CODE,
  DEFAULT_LANGUAGE_URL_ZIP,
  LOCALIZATION_TUTORIAL_URL,
} from 'src/const';
import {
  LANGUAGES,
  migrateChannels,
  getActiveLanguageCodes,
  getNumberOfActiveTranslations,
} from 'src/services';
import LOCALIZATION from './localization';
import './style.scss';

class LanguagePage extends Component {
  constructor(props, context) {
    super(props, context);
    autoBindReact(this);

    const { appId } = props;
    const { page } = context;

    const appsUrl = _.get(page, 'pageContext.url.apps', {});

    this.assetManager = new AssetManager({
      scopeType: 'application',
      scopeId: appId,
      assetPolicyHost: appsUrl,
    });

    this.state = {
      migratingChannels: true,
    };
  }

  componentWillMount() {
    const { appId, extension, migrateChannels } = this.props;

    migrateChannels(appId, extension).then(() => {
      this.setState({ migratingChannels: false });
    });
  }

  handleLocaleChange(languageOption) {
    const { updateExtensionSettings } = this.props;
    const { value: locale } = languageOption;

    const patchSettings = {
      locale,
    };

    return updateExtensionSettings(patchSettings);
  }

  handleTranslationChange(translation) {
    const { updateExtensionSettings, invalidateCurrentBuild } = this.props;
    const { languageCode, translationUrl } = translation;

    return updateExtensionSettings({
      translations: {
        [languageCode]: translationUrl,
      },
    }).then(invalidateCurrentBuild);
  }

  async handleTranslationCreate(translation) {
    const {
      appId,
      createChannel,
      updateExtensionSettings,
      invalidateCurrentBuild,
    } = this.props;
    const { languageCode, translationUrl } = translation;

    const channelData = {
      name: i18next.t(LANGUAGES[languageCode]),
      isLanguage: true,
      disabled: true,
    };

    const response = await createChannel(appId, channelData);
    const channelId = _.get(response, 'payload.id');

    await updateExtensionSettings({
      translations: {
        [languageCode]: translationUrl,
      },
      channels: {
        [languageCode]: channelId,
      },
      disabled: {
        [languageCode]: true,
      },
    }).then(invalidateCurrentBuild);
  }

  async handleTranslationDelete(languageCode) {
    const {
      appId,
      extension,
      deleteChannel,
      updateExtensionSettings,
    } = this.props;
    const currentLocale = _.get(extension, 'settings.locale');
    const useDefaultLocale = languageCode === currentLocale;

    // get current number of active translations and if translation that
    // we are currently deleting, is active then subtract one active
    let numberOfActive = getNumberOfActiveTranslations(extension);
    const isActive = !_.get(extension, `settings.disabled.${languageCode}`);
    if (isActive) {
      numberOfActive -= 1;
    }

    // if there is at least two active languages, multilanguage will be true
    const isMultilanguage = numberOfActive > 1;

    const channelId = _.get(extension, `settings.channels.${languageCode}`);
    try {
      await deleteChannel(appId, channelId);
    } catch (error) {
      const status = _.get(error, 'payload.status');
      if (status !== 404) {
        throw error;
      }
    }

    await updateExtensionSettings({
      locale: useDefaultLocale ? DEFAULT_LANGUAGE_CODE : currentLocale,
      isMultilanguage,
      translations: {
        [languageCode]: null,
      },
      channels: {
        [languageCode]: null,
      },
      disabled: {
        [languageCode]: null,
      },
    });
  }

  async handleStatusChange(languageCode, disabled) {
    const {
      appId,
      extension,
      updateChannel,
      updateExtensionSettings,
    } = this.props;

    const locale = _.get(extension, 'settings.locale');
    const translations = _.cloneDeep(_.get(extension, 'settings.translations'));
    const channelId = _.get(extension, `settings.channels.${languageCode}`);

    const data = {
      name: i18next.t(LANGUAGES[languageCode]),
      isLanguage: true,
      disabled,
    };

    let numberOfActive = getNumberOfActiveTranslations(extension);
    if (disabled) {
      numberOfActive -= 1;
    } else {
      numberOfActive += 1;
    }

    // if there is at least two active languages, multilanguage will be true
    const isMultilanguage = numberOfActive > 1;
    updateChannel(appId, channelId, data);

    await updateExtensionSettings({
      locale,
      isMultilanguage,
      translations,
      disabled: {
        [languageCode]: disabled,
      },
    });
  }

  render() {
    const { extension, navigateToUrl } = this.props;
    const { migratingChannels } = this.state;

    const translations = _.get(extension, 'settings.translations');
    const disabledTranslations = _.get(extension, 'settings.disabled');
    const locale = _.get(extension, 'settings.locale', DEFAULT_LANGUAGE_CODE);
    const availableLanguageCodes = getActiveLanguageCodes(extension);

    return (
      <div className="languages-page settings-page">
        <LoaderContainer isLoading={migratingChannels}>
          <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
          <FormGroup className="languages-page__language">
            <ControlLabel>{i18next.t(LOCALIZATION.FORM_TITLE)}</ControlLabel>
            <LanguageSelect
              onChange={this.handleLocaleChange}
              value={locale}
              availableLanguageCodes={availableLanguageCodes}
            />
          </FormGroup>
          <TranslationsDashboard
            className="language-page__dashboard"
            translations={translations}
            disabledTranslations={disabledTranslations}
            locale={locale}
            assetManager={this.assetManager}
            onCreate={this.handleTranslationCreate}
            onUpdate={this.handleTranslationChange}
            onDelete={this.handleTranslationDelete}
            onStatusChange={this.handleStatusChange}
          />
          <p>
            <Trans i18nKey={LOCALIZATION.DESCRIPTION}>
              To download the source language file click{' '}
              <a
                href={DEFAULT_LANGUAGE_URL_ZIP}
                rel="noopener noreferrer"
                target="_blank"
                download
              >
                here
              </a>
              .<br />
            </Trans>
          </p>
          <p>
            <Trans i18nKey={LOCALIZATION.TUTORIAL_LINK}>
              You can find a tutorial on how to translate it{' '}
              <a onClick={navigateToUrl}>here</a>.
            </Trans>
          </p>
        </LoaderContainer>
      </div>
    );
  }
}

LanguagePage.propTypes = {
  appId: PropTypes.string,
  extension: PropTypes.object,
  migrateChannels: PropTypes.func,
  createChannel: PropTypes.func,
  updateChannel: PropTypes.func,
  deleteChannel: PropTypes.func,
  updateExtensionSettings: PropTypes.func,
  invalidateCurrentBuild: PropTypes.func,
  navigateToUrl: PropTypes.func,
};

LanguagePage.contextTypes = {
  page: PropTypes.object,
};

function mapDispatchToProps(dispatch, ownProps) {
  const { extension, appId } = ownProps;

  return {
    createChannel: (appId, data) => dispatch(createChannel(appId, data)),
    updateChannel: (appId, channelId, data) =>
      dispatch(updateChannel(appId, channelId, data)),
    deleteChannel: (appId, channelId) =>
      dispatch(deleteChannel(appId, channelId)),
    migrateChannels: (appId, extension) =>
      dispatch(migrateChannels(appId, extension)),
    updateExtensionSettings: settingsPatch =>
      dispatch(updateExtensionSettings(extension, settingsPatch)),
    invalidateCurrentBuild: () => dispatch(invalidateCurrentBuild(appId)),
    navigateToUrl: () => dispatch(navigateToUrl(LOCALIZATION_TUTORIAL_URL)),
  };
}

export default connect(null, mapDispatchToProps)(LanguagePage);
