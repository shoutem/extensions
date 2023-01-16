import React, { useCallback } from 'react';
import { ControlLabel, FormGroup, Jumbotron } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Switch } from '@shoutem/react-web-ui';
import { getExtension, updateExtensionSettings } from '@shoutem/redux-api-sdk';
import LOCALIZATION from './localization';
import './style.scss';

export default function AppSettingsPage({ extensionName }) {
  const dispatch = useDispatch();
  const extension = useSelector(state => getExtension(state, extensionName));
  const imageResizingActive = _.get(extension, 'settings.imageResizingActive');

  const toggleResizingActive = useCallback(
    () =>
      dispatch(
        updateExtensionSettings(extension, {
          imageResizingActive: !imageResizingActive,
        }),
      ),
    [extension, imageResizingActive, dispatch],
  );

  return (
    <div className="settings-page">
      <h3>{i18next.t(LOCALIZATION.IMAGE_RESIZING_TITLE)}</h3>
      <div className="text-area">
        <Jumbotron>
          <b>{i18next.t(LOCALIZATION.IMAGE_RESIZING_TOOLTIP_TITLE)}</b>
          <p>{i18next.t(LOCALIZATION.IMAGE_RESIZING_DESCRIPTION)}</p>
        </Jumbotron>
      </div>
      <FormGroup className="switch-form-group">
        <ControlLabel>
          {i18next.t(LOCALIZATION.IMAGE_RESIZING_TOGGLE)}
        </ControlLabel>
        <Switch
          className="general-settings__switch"
          onChange={toggleResizingActive}
          value={imageResizingActive}
        />
      </FormGroup>
    </div>
  );
}

AppSettingsPage.propTypes = {
  extensionName: PropTypes.string.isRequired,
};
