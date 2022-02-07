import _ from 'lodash';
import i18next from 'i18next';
import { updateExtensionSettings } from '@shoutem/redux-api-sdk';
import { DEFAULT_LANGUAGE_CODE, DEFAULT_LANGUAGE_URL } from 'src/const';
import { LANGUAGES } from 'src/services';
import { enableChannelsModule, createChannel } from 'src/modules/channels';
import { getNumberOfActiveTranslations } from './translations';

export function migrateChannels(appId, extension) {
  return async dispatch => {
    let hasChanges = false;

    const locale = _.get(extension, 'settings.locale') || DEFAULT_LANGUAGE_CODE;
    const translations =
      _.cloneDeep(_.get(extension, 'settings.translations')) || {};
    const channels = _.cloneDeep(_.get(extension, 'settings.channels')) || {};
    const disabled = _.cloneDeep(_.get(extension, 'settings.disabled')) || {};

    const translationCodes = _.keys(translations);
    const channelCodes = _.keys(channels);
    const disabledCodes = _.keys(disabled);

    // enable channels feature and module
    if (_.isEmpty(channelCodes)) {
      await dispatch(enableChannelsModule(appId));
    }

    // add default translation code only if default language is selected
    if (
      locale === DEFAULT_LANGUAGE_CODE &&
      !_.includes(translationCodes, DEFAULT_LANGUAGE_CODE)
    ) {
      translationCodes.unshift(DEFAULT_LANGUAGE_CODE);
      translations[DEFAULT_LANGUAGE_CODE] = DEFAULT_LANGUAGE_URL;
      hasChanges = true;
    }

    // create channels for translations
    for (let i = 0; i < translationCodes.length; i++) {
      const code = translationCodes[i];

      if (!_.includes(channelCodes, code)) {
        const data = {
          isLanguage: true,
          name: i18next.t(LANGUAGES[code]),
          disabled: locale !== code,
        };

        try {
          const response = await dispatch(createChannel(appId, data));
          const channelId = _.get(response, 'payload.id');

          _.set(channels, code, channelId);
          hasChanges = true;
        } catch (error) {
          // ignore error
        }
      }
    }

    // create disabled for translations
    for (let i = 0; i < translationCodes.length; i++) {
      const code = translationCodes[i];

      if (!_.includes(disabledCodes, code)) {
        const isDisabled = locale !== code;
        _.set(disabled, code, isDisabled);
        hasChanges = true;
      }
    }

    const oldIsMultilanguage = _.get(extension, 'settings.isMultilanguage');
    const tempExt = { settings: { translations, disabled } };
    const isMultilanguage = getNumberOfActiveTranslations(tempExt) > 1;
    if (oldIsMultilanguage !== isMultilanguage) {
      hasChanges = true;
    }

    // update extension settings with new channels
    if (hasChanges) {
      const patchSettings = {
        isMultilanguage,
        channels,
        translations,
        disabled,
      };

      try {
        await dispatch(updateExtensionSettings(extension, patchSettings));
      } catch (error) {
        // ignore error
      }
    }
  };
}
