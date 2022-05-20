import React, { useEffect, useState } from 'react';
import { ControlLabel, Dropdown, FormGroup, MenuItem } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  FontIcon,
  FontIconPopover,
  LoaderContainer,
  Switch,
} from '@shoutem/react-web-ui';
import { updateExtensionSettings } from '@shoutem/redux-api-sdk';
import { fetchThemes, getThemes } from '../../redux';
import LOCALIZATION from './localization';
import './style.scss';

export default function ThemeSelectionPage(props) {
  const {
    ownExtension: extension,
    ownExtension: {
      settings: { autoSelectEnabled, lightThemeId, darkThemeId },
    },
    appId,
    activeThemeId,
  } = props;

  const [isLoading, setisLoading] = useState(false);
  const [lightTheme, setLightTheme] = useState();
  const [darkTheme, setDarkTheme] = useState();

  const themes = useSelector(getThemes);
  const dispatch = useDispatch();

  useEffect(() => {
    setisLoading(true);
    dispatch(fetchThemes(appId)).then(() => setisLoading(false));
  }, [appId, dispatch]);

  useEffect(() => {
    if (!_.isEmpty(themes)) {
      setLightTheme(_.find(themes, { canonicalName: lightThemeId }));
      setDarkTheme(_.find(themes, { canonicalName: darkThemeId }));
    }
  }, [darkThemeId, lightThemeId, themes]);

  function handleThemeAutoSelectionToggle() {
    const activeTheme = _.find(themes, { id: activeThemeId });
    const hasVariantsSelected = !!lightThemeId && !!darkThemeId;
    const settingsPatch = {
      autoSelectEnabled: !autoSelectEnabled,
      ...(!autoSelectEnabled &&
        !hasVariantsSelected && {
          lightThemeId: activeTheme.canonicalName,
          darkThemeId: activeTheme.canonicalName,
        }),
    };

    dispatch(updateExtensionSettings(extension, settingsPatch));
  }

  function handleLightThemeSelected(lightThemeId) {
    setLightTheme(_.find(themes, { canonicalName: lightThemeId }));
    dispatch(updateExtensionSettings(extension, { lightThemeId }));
  }

  function handleDarkThemeSelected(darkThemeId) {
    setDarkTheme(_.find(themes, { canonicalName: darkThemeId }));
    dispatch(updateExtensionSettings(extension, { darkThemeId }));
  }

  const lightThemeDropDownTitle = lightTheme
    ? lightTheme.title
    : i18next.t(LOCALIZATION.SELECT_LIGHT_THEME);
  const darkThemeDropDownTitle = darkTheme
    ? darkTheme.title
    : i18next.t(LOCALIZATION.SELECT_DARK_THEME);

  if (isLoading) {
    return <LoaderContainer isLoading />;
  }

  return (
    <div className="theme-settings-page">
      <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
      <FormGroup>
        <ControlLabel>
          {i18next.t(LOCALIZATION.ENABLE_AUTO_SELECT)}
        </ControlLabel>
        <Switch
          className="theme-settings-page__switch"
          onChange={handleThemeAutoSelectionToggle}
          value={autoSelectEnabled}
        />
        <FontIconPopover
          message={i18next.t(LOCALIZATION.THEME_AUTO_SELECTION_POPOVER)}
        >
          <FontIcon
            className="theme-settings-page__icon-popover"
            name="info"
            size="24px"
          />
        </FontIconPopover>
      </FormGroup>
      {autoSelectEnabled && (
        <>
          <ControlLabel>
            {i18next.t(LOCALIZATION.LIGHT_THEME_TITLE)}
          </ControlLabel>
          <Dropdown className="block" onSelect={handleLightThemeSelected}>
            <Dropdown.Toggle>{lightThemeDropDownTitle}</Dropdown.Toggle>
            <Dropdown.Menu>
              {_.map(themes, theme => (
                <MenuItem key={theme.title} eventKey={theme.canonicalName}>
                  {theme.title}
                </MenuItem>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <ControlLabel>
            {i18next.t(LOCALIZATION.DARK_THEME_TITLE)}
          </ControlLabel>
          <Dropdown className="block" onSelect={handleDarkThemeSelected}>
            <Dropdown.Toggle>{darkThemeDropDownTitle}</Dropdown.Toggle>
            <Dropdown.Menu>
              {_.map(themes, theme => (
                <MenuItem key={theme.title} eventKey={theme.canonicalName}>
                  {theme.title}
                </MenuItem>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </>
      )}
    </div>
  );
}

ThemeSelectionPage.propTypes = {
  appId: PropTypes.string.isRequired,
  ownExtension: PropTypes.object.isRequired,
  activeThemeId: PropTypes.string,
};

ThemeSelectionPage.defaultProps = {
  activeThemeId: undefined,
};
