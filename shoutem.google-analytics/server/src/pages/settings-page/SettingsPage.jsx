import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { getExtension } from '@shoutem/redux-api-sdk';
import { isInitialized } from '@shoutem/redux-io';
import { AppForm, getApp, loadApp, updateApp } from '../../modules/app';
import LOCALIZATION from './localization';
import './style.scss';

export default function SettingsPage({ extensionName }) {
  const dispatch = useDispatch();
  const app = useSelector(getApp);
  const extension = useSelector(state => getExtension(state, extensionName));
  const appId = _.get(extension, 'app');

  useEffect(() => {
    dispatch(loadApp(extensionName, appId));
  }, [extensionName, appId, dispatch]);

  const handleOnSubmit = useCallback(
    data => {
      return dispatch(updateApp(extensionName, appId, data));
    },
    [extensionName, appId, dispatch],
  );

  return (
    <div className="settings-page">
      <h3>{i18next.t(LOCALIZATION.CONFIGURATION)}</h3>
      <LoaderContainer isLoading={!isInitialized(app)}>
        <AppForm app={app} onSubmit={handleOnSubmit} />
      </LoaderContainer>
    </div>
  );
}

SettingsPage.propTypes = {
  extensionName: PropTypes.string.isRequired,
};
