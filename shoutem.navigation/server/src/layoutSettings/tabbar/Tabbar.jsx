import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup } from 'react-bootstrap';
import i18next from 'i18next';
import provideScreenSettings from '../provideScreenSettings';
import StartingScreen from '../common/StartingScreen';
import IconsAndText from '../common/IconsAndText';
import LOCALIZATION from './localization';

export function Tabbar({ settings, childShortcuts, onSettingsChanged }) {
  return (
    <div>
      <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
      <form>
        <FormGroup>
          <StartingScreen
            settings={settings}
            childShortcuts={childShortcuts}
            onSettingsChanged={onSettingsChanged}
          />
        </FormGroup>
        <FormGroup>
          <IconsAndText
            settings={settings}
            onSettingsChanged={onSettingsChanged}
          />
        </FormGroup>
      </form>
    </div>
  );
}

Tabbar.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
  childShortcuts: PropTypes.array.isRequired,
};

export default provideScreenSettings(Tabbar);
