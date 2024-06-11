import { combineReducers } from 'redux';
import { ext } from 'src/const';
import { collection, one, resource } from '@shoutem/redux-io';
import { CHANNELS, LANGUAGE_MODULE_STATUS } from '../const';

export const reducer = () =>
  combineReducers({
    rawChannels: resource(CHANNELS),
    rawLanguageModule: resource(LANGUAGE_MODULE_STATUS),
    languageModule: one(LANGUAGE_MODULE_STATUS, ext('language-module')),
    languages: collection(CHANNELS, ext('all-languages')),
  });
